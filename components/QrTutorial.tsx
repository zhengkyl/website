"use client";

import { useEffect, useRef, useState } from "react";

export function QrTutorial(props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [drawColor, setDrawColor] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [path, setPath] = useState("");
  const [version, setVersion] = useState(2);
  const width = version * 4 + 17;

  useEffect(() => {
    const newPath = update(
      version,
      canvas.current!.getContext("2d"),
      drawColor,
      drawPath
    );
    setPath(newPath);
  }, [drawColor, drawPath]);

  return (
    <div className="w-screen ml-[calc(50%-50vw)] px-4 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1 relative">
        <canvas ref={canvas} className="bg-slate-400 w-full pixelated" />
        <svg
          className="absolute top-0 left-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${width}`}
        >
          <path
            d={path}
            fill="none"
            stroke="#f0f"
            strokeWidth="0.1"
            transform="translate(0.5 0.5)"
          />
        </svg>
      </div>
      <div className="flex-1">
        <input
          value={version}
          onChange={(e) => {
            setVersion(e.target.valueAsNumber);
            const newPath = update(
              e.target.valueAsNumber,
              canvas.current!.getContext("2d"),
              drawColor,
              drawPath
            );
            setPath(newPath);
          }}
          type="range"
          min="1"
          max="40"
        />
        <div>
          <label className="flex items-center">
            <input
              className="w-5 h-5 mr-1"
              type="checkbox"
              checked={drawColor}
              onChange={(e) => setDrawColor(e.target.checked)}
            />
            Show data bytes
          </label>
          <label className="flex items-center">
            <input
              className="w-5 h-5 mr-1"
              type="checkbox"
              checked={drawPath}
              onChange={(e) => setDrawPath(e.target.checked)}
            />
            Show zigzag pattern
          </label>
        </div>
        <p>
          There are <span className="font-bold">finder patterns</span> in three
          corners.
        </p>

        <p>
          There is usually one{" "}
          <span className="font-bold">alignment pattern</span> in last corner.
          The smallest possible code has none, and very large codes have
          multiple.
        </p>
        <p>
          There is a horizontal and vertical{" "}
          <span className="font-bold">timing pattern</span>.
        </p>

        <p>
          There is <span className="font-bold">format information</span>,
          storing the error correction level and the mask pattern applied to the
          data. There are 4 error correction levels, which can recover 7% to 30%
          of the data. There are 8 mask patterns, which
        </p>
        <p>
          Very large QR codes will have **version information** on the remaining
          two finder pattern sides not taken by format information. Version
          means size, and it ranges from 1 - 40. Most QR codes fit in Versions 1
          through 6.
        </p>
        <p>
          QR codes can be rotated any which way, mirrored, and the "dark" and
          "light" pixels can be inverted.
        </p>
      </div>
    </div>
  );
}

const update = (version, ctx, drawColor, drawPath) => {
  const width = version * 4 + 17;

  ctx.canvas.width = width;
  ctx.canvas.height = width;
  const imgData = ctx.createImageData(width, width);
  const data = imgData.data;
  function fill(i, r, g, b) {
    i *= 4;
    data[i + 0] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  function drawFinder(x, y) {
    let i;
    for (let dx = 0; dx < 7; dx++) {
      i = y * width + x + dx;
      fill(i, 0, 0, 0);
    }

    i = (y + 1) * width + x;
    fill(i + 0, 0, 0, 0);
    for (let j = 1; j < 6; j++) {
      fill(i + j, 255, 255, 255);
    }
    fill(i + 6, 0, 0, 0);

    for (let j = 0; j < 3; j++) {
      i = (y + 2 + j) * width + x;
      fill(i + 0, 0, 0, 0);
      fill(i + 1, 255, 255, 255);
      fill(i + 2, 0, 0, 0);
      fill(i + 3, 0, 0, 0);
      fill(i + 4, 0, 0, 0);
      fill(i + 5, 255, 255, 255);
      fill(i + 6, 0, 0, 0);
    }

    i = (y + 5) * width + x;
    fill(i + 0, 0, 0, 0);
    for (let j = 1; j < 6; j++) {
      fill(i + j, 255, 255, 255);
    }
    fill(i + 6, 0, 0, 0);

    for (let dx = 0; dx < 7; dx++) {
      i = (y + 6) * width + x + dx;
      fill(i, 0, 0, 0);
    }
  }

  drawFinder(0, 0);
  for (let y = 0; y < 7; y++) {
    fill(y * width + 7, 255, 255, 255);
  }
  for (let x = 0; x < 8; x++) {
    fill(7 * width + x, 255, 255, 255);
  }
  drawFinder(width - 7, 0);
  for (let y = 0; y < 7; y++) {
    fill(y * width + width - 8, 255, 255, 255);
  }
  for (let x = width - 8; x < width; x++) {
    fill(7 * width + x, 255, 255, 255);
  }
  drawFinder(0, width - 7);
  for (let y = width - 8; y < width; y++) {
    fill(y * width + 7, 255, 255, 255);
  }
  for (let x = 0; x < 8; x++) {
    fill((width - 8) * width + x, 255, 255, 255);
  }

  getAlignCoords(version).forEach(([x, y]) => {
    let i;
    for (let dx = 0; dx < 5; dx++) {
      i = y * width + x + dx;
      fill(i, 0, 0, 0);
    }

    i = (y + 1) * width + x;
    fill(i + 0, 0, 0, 0);
    fill(i + 1, 255, 255, 255);
    fill(i + 2, 255, 255, 255);
    fill(i + 3, 255, 255, 255);
    fill(i + 4, 0, 0, 0);

    i = (y + 2) * width + x;
    fill(i + 0, 0, 0, 0);
    fill(i + 1, 255, 255, 255);
    fill(i + 2, 0, 0, 0);
    fill(i + 3, 255, 255, 255);
    fill(i + 4, 0, 0, 0);

    i = (y + 3) * width + x;
    fill(i + 0, 0, 0, 0);
    fill(i + 1, 255, 255, 255);
    fill(i + 2, 255, 255, 255);
    fill(i + 3, 255, 255, 255);
    fill(i + 4, 0, 0, 0);

    for (let dx = 0; dx < 5; dx++) {
      i = (y + 4) * width + x + dx;
      fill(i, 0, 0, 0);
    }
  });

  // Format 1
  for (let y = 0; y < 6; y++) {
    fill(y * width + 8, 100, 100, 100);
  }
  fill(7 * width + 8, 100, 100, 100);
  fill(8 * width + 8, 100, 100, 100);
  fill(8 * width + 7, 100, 100, 100);
  for (let x = 5; x >= 0; x--) {
    fill(8 * width + x, 100, 100, 100);
  }

  // Format 2
  for (let x = width - 1; x >= width - 8; x--) {
    fill(8 * width + x, 100, 100, 100);
  }
  fill((width - 8) * width + 8, 0, 0, 0);
  for (let y = width - 7; y < width; y++) {
    fill(y * width + 8, 100, 100, 100);
  }

  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const x = i % 3;
      const y = (i / 3) | 0;
      fill(y * width + x + width - 11, 100, 100, 100);
      fill((x + width - 11) * width + y, 100, 100, 100);
    }
  }

  for (let i = 8; i < width - 8; i++) {
    if (i & 1) {
      fill(6 * width + i, 255, 255, 255);
      fill(i * width + 6, 255, 255, 255);
    } else {
      fill(6 * width + i, 0, 0, 0);
      fill(i * width + 6, 0, 0, 0);
    }
  }

  let x = width - 1;
  let y = width - 1;

  let bit = 0;
  let dir = -1;

  let path = `M${width - 1}, ${width - 1}`;
  while (x >= 0) {
    while (y >= 0 && y < width) {
      if (!data[(y * width + x) * 4 + 3]) {
        if (drawColor) {
          const color = DATA_COLORS[((bit / 8) | 0) % 3];
          fill(y * width + x, color[0], color[1], color[2]);
        }
        if (drawPath) path += `L${x},${y}`;
        bit++;
      }
      if (!data[(y * width + x - 1) * 4 + 3]) {
        if (drawColor) {
          const color = DATA_COLORS[((bit / 8) | 0) % 3];
          fill(y * width + x - 1, color[0], color[1], color[2]);
        }
        if (drawPath) path += `L${x - 1},${y}`;
        bit++;
      }
      y += dir;
    }
    x -= 2;
    if (x === 6) {
      x -= 1;
    }
    dir *= -1;
    y += dir;
  }

  ctx.putImageData(imgData, 0, 0);
  return path;
};

const DATA_COLORS = [
  [14, 165, 233],
  [253, 164, 175],
  [251, 247, 111],
];

function getAlignCoords(version) {
  if (version === 1) return [];

  const last = version * 4 + 17 - 9;
  if (version < 7) return [[last, last]];

  const coords = [4];

  const len = Math.floor(version / 7) + 2;
  for (let gap = len - 2; gap > 0; gap--) {
    coords.push(last - gap * ALIGN_OFFSETS[version - 7]);
  }
  coords.push(last);

  const pairs: [number, number][] = [];

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (
        (i === 0 && (j === 0 || j === len - 1)) ||
        (i === len - 1 && j === 0)
      ) {
        continue;
      }

      pairs.push([coords[i], coords[j]]);
    }
  }

  return pairs;
}

// prettier-ignore
const ALIGN_OFFSETS = [
  16, 18, 20, 22, 24, 26, 28, // 7-13
  20, 22, 24, 24, 26, 28, 28, // 14-20
  22, 24, 24, 26, 26, 28, 28, // 21-27
  24, 24, 26, 26, 26, 28, 28, // 28-34
  24, 26, 26, 26, 28, 28, // 35-40
];
