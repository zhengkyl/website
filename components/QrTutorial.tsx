"use client";

import { useEffect, useRef, useState } from "react";
import init, { ECL, generate, Mask, QrOptions, Version } from "fuqr";

const SECTIONS = [
  "finder",
  "quietZone",
  "alignment",
  "timing",
  "format1",
  "format2",
  "version1",
  "version2",
  "dataHeader",
  "dataData",
  "dataPadding",
  "dataECC",
] as const;

// TODO
// timing off
// alignment off
// cross finder
// planet finder
// 1/3 pixels

let inited = false;
export function QrTutorial(props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState("hello there");
  const [version, setVersion] = useState(2);
  const [mask, setMask] = useState(Mask.M0);
  const [ecl, setECL] = useState(ECL.Low);

  const [drawColor, setDrawColor] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [path, setPath] = useState("");
  const [zRot, setZRot] = useState(0);
  const [xRot, setXRot] = useState(0);
  const [yRot, setYRot] = useState(0);
  // const width = version * 4 + 17;

  const [invert, setInvert] = useState(false);

  let highlight: (typeof SECTIONS)[number][] = [];

  let enabled = {
    alignment: true,
    timing: true,
    format1: true,
    format2: true,
    version1: true,
    version2: true,
  };

  let transforms = {
    // rotate
    rotateZ: 0,
    // perspective
    rotateX: 0,
    rotateY: 0,
    // mirroring
    scaleX: 1,
    scaleY: 1,
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (!inited) {
      init().then(() => {
        inited = true;
        render();
      });
    } else {
      render();
    }
  }, [inited, text, version, ecl, mask]);

  const render = () => {
    try {
      const { matrix, version: outVersion } = generate(
        text,
        new QrOptions()
          .min_ecl(ecl)
          .strict_ecl(true)
          .min_version(new Version(version))
          .strict_version(true)
          .mask(mask)
      );
      const ctx = canvas.current!.getContext("2d")!;
      const margin = 1;
      const qrWidth = outVersion * 4 + 17;
      const size = qrWidth + 2 * margin;
      ctx.canvas.width = size;
      ctx.canvas.height = size;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = "#000000";
      for (let y = 0; y < qrWidth; y++) {
        for (let x = 0; x < qrWidth; x++) {
          if (matrix[y * qrWidth + x] & 1) {
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
      }
    } catch (e) {
      console.error("Exceeded max capacity, stupid");
    }
  };

  // ugly parent max-w instead of child max-w makes padding easier
  return (
    <div className="w-screen max-w-[1536px] ml-[calc(50%-min(768px,50vw))] px-4 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1 relative sticky top-0 h-full p-4 bg-gradient-to-b from-white from-95%">
        <div
          className="max-w-80% mx-auto sm:max-w-unset relative"
          style={{
            transform: `rotateZ(${zRot}deg) rotateX(${xRot}deg) rotateY(${yRot}deg)`,
          }}
        >
          <canvas
            ref={canvas}
            className={`w-full pixelated ${invert ? "invert" : ""}`}
          />
          {/* <svg
            className={`absolute top-0 left-0`}
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
          </svg> */}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-lg">Finder patterns</div>
          <p>
            These are the big squares shapes in three corners. These allow
            scanners to detect the code's orientation, perspective, dimensions
            and more. The approximate ratio of 1:1:3:1:1 black and white pixels
            through the vertical and horizontal center is key.
          </p>
          <svg viewBox="-.1 -.1 7.2 1.2" stroke="gray" strokeWidth="0.1">
            <path d="M0,0h1v1h-1z" fill="black" />
            <path d="M1,0h1v1h-1z" fill="white" />
            <path d="M2,0h1v1h-1z" fill="black" />
            <path d="M3,0h1v1h-1z" fill="black" />
            <path d="M4,0h1v1h-1z" fill="black" />
            <path d="M5,0h1v1h-1z" fill="white" />
            <path d="M6,0h1v1h-1z" fill="black" />
          </svg>
          <p>
            A white separator or "quiet zone" around each finder pattern is
            often necessary to preserve this ratio.
          </p>
          <label>
            <input
              className="w-5 h-5 mr-1"
              type="checkbox"
              checked={drawColor}
              onChange={(e) => setDrawColor(e.target.checked)}
            />
            Highlight finder
          </label>
          <div className="font-bold text-lg">Alignment patterns</div>
          <p>
            This is the smaller square in the last corner which helps account
            for distortion. The smallest QR code doesn't have one, while very
            large codes have multiple.
          </p>
          <div className="font-bold text-lg">Timing patterns</div>
          <p>
            These are the horizontal and vertical belts of alternating black and
            white pixels. These help scanners align rows and columns.
          </p>
          <p>
            The timing patterns and alignment patterns are{" "}
            <span className="font-italic">technically</span> optional, in the
            sense that a QR code without them will still be scannable, albeit
            less reliably.
          </p>
          <div className="text-lg">Metadata</div>
          <p>
            <span className="font-bold">Format information</span> stores the
            error correction level and the mask pattern applied to the data. One
            copy is in the top left, and the other copy is split between the top
            right and bottom left.
          </p>
          <div className="w-full flex select-none">
            {["Low", "Medium", "Quartile", "High"].map((key, i) => (
              <label className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer" key={key}>
                <input
                  type="radio"
                  name="ecl"
                  value={i}
                  checked={i === ecl}
                  onChange={() => setECL(i)}
                />
                {key}
              </label>
            ))}
          </div>
          <small>
            You'll often see figures like 7%, 15%, 25%, 30%, but those are just
            lower bounds. Real error tolerance may be 3–5% higher. //TODO do
            math to prove this
          </small>
          <div className="w-full flex select-none">
            {Array.from({ length: 8 }, (_, i) => i).map((key, i) => (
              <label className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer" key={key}>
                <input
                  type="radio"
                  name="mask"
                  value={i}
                  checked={i === mask}
                  onChange={() => setMask(i)}
                />
                {key}
              </label>
            ))}
          </div>
          <p>
            Only very large QR codes will have{" "}
            <span className="font-bold">version information</span>. Version
            means size, and it ranges from 1 - 40. Most QR codes fit in Versions
            1 through 6, where size is just calculated using the distance
            between the finder patterns. One copy is in the top left, and the
            other copy is in the bottom left.
          </p>
          <input
            value={version}
            onChange={(e) => setVersion(e.target.valueAsNumber)}
            type="range"
            min="1"
            max="40"
          />
          <div className="font-bold text-lg">Data</div>
          <p>
            The remaining space is for the{" "}
            <span className="font-bold">data</span>. It starts with a header
            describing the encoding mode and the data length.
          </p>
          <p>
            There are efficient encoding modes for numbers, alphanumeric
            strings, and Japanese characters, but the only relevant mode for
            URLs is Byte mode. This just means UTF-8.
          </p>
          <input
            className="border p-2"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p>
            The header is followed by the actual data, padded to fill the
            capacity, and then error correction codewords fill the remaining
            space.
          </p>
          <div>
            <label className="flex items-center">
              <input
                className="w-5 h-5 mr-1"
                type="checkbox"
                checked={drawColor}
                onChange={(e) => setDrawColor(e.target.checked)}
              />
              Show byte boundaries
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
          <div className="font-bold text-lg">Transformations</div>
          <p>
            QR codes can be rotated, mirrored, and the "dark" and "light" pixels
            can be inverted.
          </p>
          <label>
            Rotation
            <input
              value={zRot}
              onChange={(e) => setZRot(e.target.valueAsNumber)}
              type="range"
              step="15"
              min="-180"
              max="180"
            />
          </label>
          <label className="flex items-center">
            <input
              className="w-5 h-5 mr-1"
              type="checkbox"
              checked={invert}
              onChange={(e) => setInvert(e.target.checked)}
            />
            Invert color
          </label>
        </div>
      </div>
    </div>
  );
}
