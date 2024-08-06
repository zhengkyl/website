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
        max="6"
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
          <path
            d={`M${width - 9},${width - 9}h5v5h-5zM${width - 8},${
              width - 8
            }v3h3v-3zM${width - 7},${width - 7}h1v1h-1z`}
          />
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
      </svg>
    </div>
  );
}
