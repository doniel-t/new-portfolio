import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FPS = 24;
const REVEAL_MS = 1325;
const PIXEL_SIZE = 28;
const CELL_DURATION = 0.36;
const MAX_CELL_DELAY = 1 - CELL_DURATION;
const DARK_COLOR = "#0d0b08";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(repoRoot, "public");
const force = process.argv.includes("--force");

const assets = [
  { src: "/load-transition/dissolve-landscape-720.webm", width: 720, height: 450 },
  { src: "/load-transition/dissolve-landscape-1440.webm", width: 1440, height: 900 },
  { src: "/load-transition/dissolve-landscape-2560.webm", width: 2560, height: 1600 },
  { src: "/load-transition/dissolve-landscape-3840.webm", width: 3840, height: 2400 },
  { src: "/load-transition/dissolve-portrait-720.webm", width: 720, height: 1280 },
  { src: "/load-transition/dissolve-portrait-1440.webm", width: 1440, height: 2560 },
  { src: "/load-transition/dissolve-portrait-2160.webm", width: 2160, height: 3840 },
];

function hexToRgbaValue(hex, alpha) {
  const match = hex.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    throw new Error(`Unsupported color: ${hex}`);
  }

  const value = Number.parseInt(match[1], 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return ((alpha & 255) << 24) | (b << 16) | (g << 8) | r;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value) {
  const inverse = 1 - value;
  return 1 - inverse * inverse * inverse;
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function hashNoise(column, row) {
  const seed = Math.sin(column * 127.1 + row * 311.7) * 43758.5453123;
  return seed - Math.floor(seed);
}

function createGrid(width, height) {
  const pixel = Math.max(20, Math.round(PIXEL_SIZE * Math.min(width / 1440, 1.1)));
  const columns = Math.ceil(width / pixel);
  const rows = Math.ceil(height / pixel);
  const delays = new Float32Array(columns * rows);
  const maxColumn = Math.max(columns - 1, 1);
  const maxRow = Math.max(rows - 1, 1);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const fromRight = 1 - column / maxColumn;
      const rowBand = Math.abs(row / maxRow - 0.5);
      const noise = hashNoise(column, row);
      const flutter = hashNoise(row + 17, column + 29);
      const timingScore = clamp(
        fromRight * 0.82 + rowBand * 0.08 + noise * 0.06 + flutter * 0.04,
        0,
        1,
      );

      delays[row * columns + column] = timingScore * MAX_CELL_DELAY;
    }
  }

  return { columns, rows, delays, pixel };
}

function fillRect(view, width, height, x, y, rectWidth, rectHeight, rgbaValue) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(width, Math.ceil(x + rectWidth));
  const y1 = Math.min(height, Math.ceil(y + rectHeight));

  if (x0 >= x1 || y0 >= y1) return;

  for (let yy = y0; yy < y1; yy += 1) {
    let offset = yy * width + x0;
    for (let xx = x0; xx < x1; xx += 1) {
      view[offset] = rgbaValue;
      offset += 1;
    }
  }
}

function renderFrame(asset, grid, frameIndex, frameCount, solidValue, transparentValue) {
  const frame = Buffer.allocUnsafe(asset.width * asset.height * 4);
  const view = new Uint32Array(frame.buffer, frame.byteOffset, asset.width * asset.height);
  view.fill(solidValue);

  const progress = frameCount <= 1 ? 1 : frameIndex / (frameCount - 1);
  const easedProgress = easeInOutCubic(progress);

  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      const rawProgress =
        (easedProgress - grid.delays[row * grid.columns + column]) / CELL_DURATION;

      if (rawProgress <= 0) continue;

      const tileX = column * grid.pixel;
      const tileY = row * grid.pixel;

      if (rawProgress >= 1) {
        fillRect(
          view,
          asset.width,
          asset.height,
          tileX - 1,
          tileY - 1,
          grid.pixel + 2,
          grid.pixel + 2,
          transparentValue,
        );
        continue;
      }

      const carve = easeOutCubic(clamp(rawProgress, 0, 1));
      const size = Math.max(1, grid.pixel * carve);
      const x = tileX + (grid.pixel - size) / 2;
      const y = tileY + (grid.pixel - size) / 2;
      const alpha = Math.round(255 * (1 - carve));
      const partialValue = hexToRgbaValue(DARK_COLOR, alpha);

      fillRect(view, asset.width, asset.height, x, y, size, size, partialValue);
    }
  }

  return frame;
}

async function writeFrame(stdin, frame) {
  if (!stdin.write(frame)) {
    await once(stdin, "drain");
  }
}

async function encodeAsset(asset) {
  const outputPath = path.join(publicRoot, asset.src.replace(/^\//, ""));
  if (!force && existsSync(outputPath)) {
    console.log(`skip ${asset.src}`);
    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const frameCount = Math.round((REVEAL_MS / 1000) * FPS);
  const grid = createGrid(asset.width, asset.height);
  const solidValue = hexToRgbaValue(DARK_COLOR, 255);
  const transparentValue = hexToRgbaValue(DARK_COLOR, 0);
  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgba",
    "-s",
    `${asset.width}x${asset.height}`,
    "-r",
    String(FPS),
    "-i",
    "pipe:0",
    "-an",
    "-vf",
    "format=yuva420p",
    "-c:v",
    "libvpx-vp9",
    "-pix_fmt",
    "yuva420p",
    "-auto-alt-ref",
    "0",
    "-row-mt",
    "1",
    "-deadline",
    "good",
    "-cpu-used",
    "5",
    "-b:v",
    "0",
    "-crf",
    "34",
    outputPath,
  ];

  const ffmpeg = spawn("ffmpeg", args, {
    cwd: repoRoot,
    stdio: ["pipe", "ignore", "pipe"],
  });

  let stderr = "";
  ffmpeg.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const closePromise = once(ffmpeg, "close");

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    await writeFrame(
      ffmpeg.stdin,
      renderFrame(asset, grid, frameIndex, frameCount, solidValue, transparentValue),
    );
  }

  ffmpeg.stdin.end();
  const [code] = await closePromise;

  if (code !== 0) {
    throw new Error(`ffmpeg failed for ${asset.src}\n${stderr}`);
  }

  console.log(`rendered ${asset.src}`);
}

for (const asset of assets) {
  await encodeAsset(asset);
}
