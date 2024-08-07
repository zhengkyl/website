"use client";

import { useState } from "react";

export function QrTutorial(props) {
  const [version, setVersion] = useState(2);
  const width = version * 4 + 17;

  return (
    <div>
      <input
        value={version}
        onChange={(e) => setVersion(e.target.valueAsNumber)}
        type="range"
        min="1"
        max="40"
      />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${width}`}>
        {/* Finder patterns */}
        <g>
          <path d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h3v3h-3z" />
          <path
            d={`M${width - 7},0h7v7h-7zM${width - 6},1v5h5v-5zM${
              width - 5
            },2h3v3h-3z`}
          />
          <path
            d={`M0,${width - 7}h7v7h-7zM1,${width - 6}v5h5v-5zM2,${
              width - 5
            }h3v3h-3z`}
          />
        </g>
        {/* Alignment pattern */}
        {version > 1 && (
          <g>
            {getAlignCoords(version).map(([x, y]) => (
              <path
                key={`${x},${y}`}
                d={`M${x - 2},${y - 2}h5v5h-5zM${x - 1},${
                  y - 1
                }v3h3v-3zM${x},${y}h1v1h-1z`}
              />
            ))}
          </g>
        )}
        {/* Timing pattern */}
        <g>
          <path
            d={Array.from(
              { length: (width - 14) / 2 },
              (_, i) => `M${8 + 2 * i},6h1v1h-1z`
            ).join("")}
          />
          <path
            d={Array.from(
              { length: (width - 14) / 2 },
              (_, i) => `M6,${8 + 2 * i}h1v1h-1z`
            ).join("")}
          />
        </g>
        {/* Format information */}
        <g fill="#ccc">
          <path d="M8,0h1v6h-1zM8,7h1v2h-2v-1h1zM0,8h6v1h-6z" />
          <path d={`M${width},8v1h-8v-1zM8,${width}v-7h1v7z`} />
          <path fill="#000" d={`M8,${width - 8}h1v1h-1z`} />
        </g>

        {/* Version information */}
        {version >= 7 && (
          <g fill="#ccc">
            <rect x={width - 11} y="0" width="3" height="6" />
            <rect x="0" y={width - 11} width="6" height="3" />
          </g>
        )}
      </svg>
    </div>
  );
}

function getAlignCoords(version) {
  if (version === 1) return [];

  const last = version * 4 + 17 - 7;
  if (version < 7) return [[last, last]];

  const coords = [6];

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
