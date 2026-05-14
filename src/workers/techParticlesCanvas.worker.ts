type ActiveRect = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
  driftX: number;
  decay: number;
  active: boolean;
};

type TechParticlesInitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
  maxParticles: number;
};

type TechParticlesResizeMessage = {
  type: "resize";
  width: number;
  height: number;
  dpr: number;
};

type TechParticlesActiveRectMessage = {
  type: "activeRect";
  rect: ActiveRect;
  color: string;
};

type TechParticlesStopMessage = {
  type: "stop";
};

type TechParticlesMessage =
  | TechParticlesInitMessage
  | TechParticlesResizeMessage
  | TechParticlesActiveRectMessage
  | TechParticlesStopMessage;

const scope = self as unknown as {
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let dpr = 1;
let activeRect: ActiveRect = null;
let color = "#A69F8D";
let particles: Particle[] = [];
let frameId: number | null = null;
let lastFrameTime = 0;

function requestFrame(callback: FrameRequestCallback) {
  if (scope.requestAnimationFrame) {
    return scope.requestAnimationFrame(callback);
  }

  return scope.setTimeout(() => callback(performance.now()), 1000 / 30) as unknown as number;
}

function cancelFrame(handle: number | null) {
  if (handle === null) return;

  if (scope.cancelAnimationFrame) {
    scope.cancelAnimationFrame(handle);
  } else {
    scope.clearTimeout(handle);
  }
}

function createPool(size: number) {
  particles = Array.from({ length: size }, () => ({
    x: 0,
    y: 0,
    size: 0,
    alpha: 0,
    speedY: 0,
    driftX: 0,
    decay: 0,
    active: false,
  }));
}

function getInactiveParticle() {
  for (let i = 0; i < particles.length; i += 1) {
    if (!particles[i].active) return particles[i];
  }
  return null;
}

function tick(timestamp: number) {
  if (!ctx) {
    frameId = null;
    return;
  }

  if (timestamp - lastFrameTime < 33) {
    frameId = requestFrame(tick);
    return;
  }

  lastFrameTime = timestamp;
  ctx.clearRect(0, 0, width, height);

  if (activeRect && Math.random() < 0.4) {
    const particle = getInactiveParticle();
    if (particle) {
      particle.x = activeRect.x + Math.random() * activeRect.width;
      particle.y = activeRect.y + Math.random() * activeRect.height;
      particle.size = Math.random() * 2 + 1;
      particle.alpha = 0.85;
      particle.speedY = Math.random() * 0.4 + 0.3;
      particle.driftX = (Math.random() - 0.5) * 0.5;
      particle.decay = Math.random() * 0.025 + 0.015;
      particle.active = true;
    }
  }

  let hasActiveParticles = false;
  ctx.fillStyle = color;

  for (let i = 0; i < particles.length; i += 1) {
    const particle = particles[i];
    if (!particle.active) continue;

    particle.x += particle.driftX;
    particle.y -= particle.speedY;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) {
      particle.active = false;
      continue;
    }

    hasActiveParticles = true;
    ctx.globalAlpha = particle.alpha;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  ctx.globalAlpha = 1;

  if (activeRect || hasActiveParticles) {
    frameId = requestFrame(tick);
  } else {
    frameId = null;
  }
}

function start() {
  if (frameId !== null) return;
  lastFrameTime = performance.now();
  frameId = requestFrame(tick);
}

function resizeCanvas() {
  if (!canvas || !ctx) return;

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function stop() {
  cancelFrame(frameId);
  frameId = null;
  activeRect = null;
  for (let i = 0; i < particles.length; i += 1) {
    particles[i].active = false;
  }
  ctx?.clearRect(0, 0, width, height);
}

self.onmessage = (event: MessageEvent<TechParticlesMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true });
    createPool(message.maxParticles);
    return;
  }

  if (message.type === "resize") {
    width = message.width;
    height = message.height;
    dpr = message.dpr;
    resizeCanvas();
    return;
  }

  if (message.type === "activeRect") {
    activeRect = message.rect;
    color = message.color;
    start();
    return;
  }

  stop();
};

export {};

