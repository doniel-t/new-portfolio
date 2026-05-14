import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FPS = 24;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "src", "components", "pixelDividerMediaAssets.json");
const publicRoot = path.join(repoRoot, "public");
const force = process.argv.includes("--force");

const assets = JSON.parse(await fs.readFile(manifestPath, "utf8"));

function normalizeHex(hex) {
  const trimmed = hex.trim().toLowerCase();
  const shortHex = trimmed.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    return `#${shortHex[1]
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`;
  }
  return trimmed;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  const match = normalized.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    throw new Error(`Unsupported color: ${hex}`);
  }

  const value = Number.parseInt(match[1], 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function createRng(seed) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createParticles(asset) {
  const seed = asset.src.replace(/-(?:2k|4k)(?=\.webm$)/, "");
  const rng = createRng(seed);
  const particles = [];

  if (asset.axis === "vertical") {
    const columns = Math.max(1, Math.ceil(asset.width / asset.pixelSize) + 2);
    for (let column = 0; column < columns; column++) {
      for (let stream = 0; stream < asset.streams; stream++) {
        particles.push({
          x: column * asset.pixelSize,
          progress: rng(),
        });
      }
    }
    return particles;
  }

  const rows = Math.max(1, Math.ceil(asset.height / asset.pixelSize) + 1);
  for (let row = 0; row < rows; row++) {
    for (let stream = 0; stream < asset.streams; stream++) {
      particles.push({
        y: row * asset.pixelSize,
        progress: rng(),
      });
    }
  }
  return particles;
}

function drawRect(buffer, width, height, x, y, size, color, alpha) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(width, Math.ceil(x + size));
  const y1 = Math.min(height, Math.ceil(y + size));

  if (x0 >= x1 || y0 >= y1 || alpha <= 0) return;

  for (let yy = y0; yy < y1; yy++) {
    let offset = (yy * width + x0) * 4;
    for (let xx = x0; xx < x1; xx++) {
      if (alpha >= buffer[offset + 3]) {
        buffer[offset] = color.r;
        buffer[offset + 1] = color.g;
        buffer[offset + 2] = color.b;
        buffer[offset + 3] = alpha;
      }
      offset += 4;
    }
  }
}

function particleOpacity(progress, axis) {
  if (axis === "vertical") {
    return progress <= 0.7
      ? 1 - (progress / 0.7) * 0.15
      : 0.85 * (1 - (progress - 0.7) / 0.3);
  }

  return progress <= 0.72
    ? 1 - (progress / 0.72) * 0.18
    : 0.82 * (1 - (progress - 0.72) / 0.28);
}

function renderFrame(asset, particles, color, frameIndex, frameCount) {
  const frame = Buffer.alloc(asset.width * asset.height * 4);
  const travelDistance = asset.pixelSize * (asset.travelPercent / 100);
  const progressOffset = frameIndex / frameCount;

  for (const particle of particles) {
    const progress = (particle.progress + progressOffset) % 1;
    const alpha = Math.round(particleOpacity(progress, asset.axis) * 255);

    if (asset.axis === "vertical") {
      const y =
        asset.direction === "up"
          ? asset.height - progress * travelDistance
          : -asset.pixelSize + progress * travelDistance;
      drawRect(frame, asset.width, asset.height, particle.x, y, asset.pixelSize, color, alpha);
      continue;
    }

    const x =
      asset.direction === "right"
        ? -asset.pixelSize + progress * travelDistance
        : asset.width - progress * travelDistance;
    drawRect(frame, asset.width, asset.height, x, particle.y, asset.pixelSize, color, alpha);
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

  const frameCount = Math.round(asset.durationSec * FPS);
  const particles = createParticles(asset);
  const color = hexToRgb(asset.color);
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
    "4",
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

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    await writeFrame(ffmpeg.stdin, renderFrame(asset, particles, color, frameIndex, frameCount));
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
