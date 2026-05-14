type PixelWipeInitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
};

type PixelWipeResizeMessage = {
  type: "resize";
  width: number;
  height: number;
  dpr: number;
};

type PixelWipePlayMessage = {
  type: "play";
  mode: "navbar" | "content";
  color: string;
  durationMs: number;
  isRevealing?: boolean;
  pixelSize?: number;
  gridSize?: number;
  showThreshold?: number;
};

type PixelWipeStopMessage = {
  type: "stop";
};

type PixelWipeMessage =
  | PixelWipeInitMessage
  | PixelWipeResizeMessage
  | PixelWipePlayMessage
  | PixelWipeStopMessage;

type WorkerFrame = number;

const scope = self as unknown as {
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  postMessage: typeof postMessage;
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let dpr = 1;
let frameId: WorkerFrame | null = null;
let completionTimeoutId = 0;
let playToken = 0;

function requestFrame(callback: FrameRequestCallback) {
  if (scope.requestAnimationFrame) {
    return scope.requestAnimationFrame(callback);
  }

  return scope.setTimeout(() => callback(performance.now()), 1000 / 60) as unknown as number;
}

function cancelFrame(handle: WorkerFrame | null) {
  if (handle === null) return;

  if (scope.cancelAnimationFrame) {
    scope.cancelAnimationFrame(handle);
  } else {
    scope.clearTimeout(handle);
  }
}

function stop() {
  playToken += 1;
  cancelFrame(frameId);
  frameId = null;
  if (completionTimeoutId) {
    scope.clearTimeout(completionTimeoutId);
    completionTimeoutId = 0;
  }
}

function shuffle(total: number) {
  const indices = Array.from({ length: total }, (_, index) => index);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function finishWithDelay(token: number) {
  completionTimeoutId = scope.setTimeout(() => {
    if (token === playToken) {
      scope.postMessage({ type: "complete" });
    }
  }, 50) as unknown as number;
}

function playNavbar(message: PixelWipePlayMessage, token: number) {
  if (!ctx || width <= 0 || height <= 0) {
    scope.postMessage({ type: "complete" });
    return;
  }

  const pixelSize = message.pixelSize ?? 6;
  const cols = Math.max(1, Math.ceil(width / pixelSize));
  const rows = Math.max(1, Math.ceil(height / pixelSize));
  const totalPixels = cols * rows;
  const indices = shuffle(totalPixels);
  const pixelState = new Uint8Array(totalPixels);
  const isRevealing = message.isRevealing ?? true;
  const showThreshold = message.showThreshold ?? 0.8;

  if (!isRevealing) {
    pixelState.fill(1);
  }

  let showContentSent = false;
  const startTime = performance.now();

  const draw = (timestamp: number) => {
    if (token !== playToken || !ctx) return;

    const progress = Math.min((timestamp - startTime) / message.durationMs, 1);
    const targetPixelCount = Math.floor(progress * totalPixels);

    for (let i = 0; i < targetPixelCount; i += 1) {
      pixelState[indices[i]] = isRevealing ? 1 : 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = message.color;

    for (let i = 0; i < totalPixels; i += 1) {
      if (!pixelState[i]) continue;
      const x = (i % cols) * pixelSize;
      const y = Math.floor(i / cols) * pixelSize;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    if (progress >= showThreshold && isRevealing && !showContentSent) {
      showContentSent = true;
      scope.postMessage({ type: "showContent" });
    }

    if (progress < 1) {
      frameId = requestFrame(draw);
    } else {
      finishWithDelay(token);
    }
  };

  frameId = requestFrame(draw);
}

function playContent(message: PixelWipePlayMessage, token: number) {
  if (!ctx || width <= 0 || height <= 0) {
    scope.postMessage({ type: "midpoint" });
    scope.postMessage({ type: "complete" });
    return;
  }

  const gridSize = Math.max(1, message.gridSize ?? 7);
  const totalPixels = gridSize * gridSize;
  const pixelW = width / gridSize;
  const pixelH = height / gridSize;
  const indices = shuffle(totalPixels);
  const pixelState = new Uint8Array(totalPixels);
  const startTime = performance.now();
  let midpointSent = false;

  const draw = (timestamp: number) => {
    if (token !== playToken || !ctx) return;

    const progress = Math.min((timestamp - startTime) / message.durationMs, 1);
    ctx.clearRect(0, 0, width, height);

    if (progress <= 0.5) {
      const targetCount = Math.floor((progress / 0.5) * totalPixels);
      for (let i = 0; i < targetCount; i += 1) {
        pixelState[indices[i]] = 1;
      }
    } else {
      if (!midpointSent) {
        midpointSent = true;
        scope.postMessage({ type: "midpoint" });
      }

      const targetCount = Math.floor(((progress - 0.5) / 0.5) * totalPixels);
      for (let i = 0; i < targetCount; i += 1) {
        pixelState[indices[i]] = 0;
      }
    }

    ctx.fillStyle = message.color;
    for (let i = 0; i < totalPixels; i += 1) {
      if (!pixelState[i]) continue;
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      ctx.fillRect(col * pixelW, row * pixelH, pixelW, pixelH);
    }

    if (progress < 1) {
      frameId = requestFrame(draw);
    } else {
      scope.postMessage({ type: "complete" });
    }
  };

  frameId = requestFrame(draw);
}

self.onmessage = (event: MessageEvent<PixelWipeMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true });
    return;
  }

  if (message.type === "resize") {
    width = message.width;
    height = message.height;
    dpr = message.dpr;

    if (canvas && ctx) {
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return;
  }

  if (message.type === "play") {
    stop();
    const token = playToken;
    if (message.mode === "navbar") {
      playNavbar(message, token);
    } else {
      playContent(message, token);
    }
    return;
  }

  stop();
  ctx?.clearRect(0, 0, width, height);
};

export {};

