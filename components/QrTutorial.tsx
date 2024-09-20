"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import init, { ECL, generate, Mask, QrOptions, Version } from "fuqr";

const Module = {
  ON: 1 << 0,
  DATA: 1 << 1,
  FINDER: 1 << 2,
  ALIGNMENT: 1 << 3,
  TIMING: 1 << 4,
  FORMAT: 1 << 5,
  VERSION: 1 << 6,
  MODIFIER: 1 << 7,
};

let initDone = false;
let initStarted = false;

const FinderShapes = {
  Perfect: () => (
    <svg viewBox="-.05 -.05 7.1 7.1">
      <path d="M0,0h7v7h-7z" fill="white" />
      <path d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h3v3h-3z" fill="black" />
      <path
        d="M0,0h7M0,1h7M0,2h7M0,3h7M0,4h7M0,5h7M0,6h7M0,7v7M0,0v7M1,0v7M2,0v7M3,0v7M4,0v7M5,0v7M6,0v7M7,0v7"
        stroke="gray"
        strokeWidth="0.05"
      />
    </svg>
  ),
  OK: () => (
    <svg viewBox="-.05 -.05 7.1 7.1">
      <path d="M0,0h7v7h-7z" fill="white" />
      <path
        d="M3,0h1v1h-1zM0,3h1v1h-1zM6,3h1v1h-1zM3,6h1v1h-1zM3,2h1v1h1v1h-1v1h-1v-1h-1v-1h1z"
        fill="black"
      />
      <path
        d="M0,0h7M0,1h7M0,2h7M0,3h7M0,4h7M0,5h7M0,6h7M0,7v7M0,0v7M1,0v7M2,0v7M3,0v7M4,0v7M5,0v7M6,0v7M7,0v7"
        stroke="gray"
        strokeWidth="0.05"
      />
    </svg>
  ),
  Bad: () => (
    <svg viewBox="-.05 -.05 7.1 7.1">
      <path d="M0,0h7v7h-7z" fill="white" />
      <path
        d="M0,0h3v1h-2v2h-1zM7,0v3h-1v-2h-2v-1zM0,7v-3h1v2h2v1zM7,7h-3v-1h2v-2h1zM2,2h3v3h-3z"
        fill="black"
      />
      <path
        d="M0,0h7M0,1h7M0,2h7M0,3h7M0,4h7M0,5h7M0,6h7M0,7v7M0,0v7M1,0v7M2,0v7M3,0v7M4,0v7M5,0v7M6,0v7M7,0v7"
        stroke="gray"
        strokeWidth="0.05"
      />
    </svg>
  ),
  Bad2: () => (
    <svg viewBox="-.05 -.05 7.1 7.1">
      <path d="M0,0h7v7h-7z" fill="white" />
      <path
        d="M0,0h7v7h-7zM1,1v5h5v-5zM2,2h1v1h1v-1h1v1h-1v1h1v1h-1v-1h-1v1h-1v-1h1v-1h-1z"
        fill="black"
      />
      <path
        d="M0,0h7M0,1h7M0,2h7M0,3h7M0,4h7M0,5h7M0,6h7M0,7v7M0,0v7M1,0v7M2,0v7M3,0v7M4,0v7M5,0v7M6,0v7M7,0v7"
        stroke="gray"
        strokeWidth="0.05"
      />
    </svg>
  ),
};

export function QrTutorial() {
  const scrollHighlight = useRef<HTMLDivElement>(null!);

  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const showA = useRef(false);

  const [text, setText] = useState("hello there");
  const [version, setVersion] = useState(2);
  const [mask, setMask] = useState(Mask.M0);
  const [ecl, setECL] = useState(ECL.Low);

  const [finderShape, setFinderShape] =
    useState<keyof typeof FinderShapes>("Perfect");
  const [brap, setBrap] = useState(false); // bottom right alignment pattern
  const [drawColor, setDrawColor] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [path, setPath] = useState("");
  const [zRot, setZRot] = useState(0);
  const [xRot, setXRot] = useState(0);
  const [yRot, setYRot] = useState(0);
  // const width = version * 4 + 17;

  const [invert, setInvert] = useState(false);
  const [mirror, setMirror] = useState(false);

  const [section, setSection] = useState("");
  const prevSection = useRef(section);

  useEffect(() => {
    if (!initStarted) {
      initStarted = true;
      init().then(() => {
        initDone = true;
        render(true, false);
      });
    }
  }, []);

  useEffect(() => {
    if (initDone) {
      render(false, prevSection.current !== section || section === "finder");
      prevSection.current = section;
    }
  }, [finderShape, brap, invert, mirror, section]);

  useEffect(() => {
    if (initDone) {
      render(true, false);
    }
  }, [text, version, ecl, mask]);

  // todo return type from fuqr
  const qrCode = useRef<any>(null!);

  const render = (regenerate, animate) => {
    console.log("rendder", "regen", regenerate, "animate", animate);
    if (regenerate) {
      try {
        qrCode.current = generate(
          text,
          new QrOptions()
            .min_ecl(ecl)
            .strict_ecl(true)
            .min_version(new Version(version))
            .mask(mask)
        );
      } catch (e) {
        console.error("Exceeded max capacity, fool");
        return;
      }
    }
    const { matrix, version: outVersion } = qrCode.current;

    if (animate) showA.current = !showA.current;
    const nextCanvas = (showA.current ? canvasA : canvasB).current!;
    const prevCanvas = (showA.current ? canvasB : canvasA).current!;
    prevCanvas.style.zIndex = "-1";
    nextCanvas.style.zIndex = "1";

    const ctx = nextCanvas.getContext("2d")!;
    const margin = 1;
    const qrWidth = outVersion * 4 + 17;
    const size = qrWidth + 2 * margin;
    ctx.canvas.width = size;
    ctx.canvas.height = size;

    const fgColor = invert ? "#fff" : "#000";
    const bgColor = invert ? "#000" : "#fff";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = fgColor;

    for (const [x, y] of [
      [margin, margin],
      [margin + qrWidth - 7, margin],
      [mirror ? margin + qrWidth - 7 : margin, margin + qrWidth - 7],
    ]) {
      switch (finderShape) {
        case "Perfect":
          ctx.fillRect(x, y, 7, 1);
          for (let i = 1; i < 6; i++) {
            ctx.fillRect(x, y + i, 1, 1);
            ctx.fillRect(x + 6, y + i, 1, 1);
          }
          ctx.fillRect(x + 2, y + 2, 3, 1);
          ctx.fillRect(x + 2, y + 3, 3, 1);
          ctx.fillRect(x + 2, y + 4, 3, 1);
          ctx.fillRect(x, y + 6, 7, 1);
          break;
        case "OK":
          ctx.fillRect(x + 3, y, 1, 1);
          ctx.fillRect(x + 3, y + 2, 1, 1);
          ctx.fillRect(x, y + 3, 1, 1);
          ctx.fillRect(x + 2, y + 3, 3, 1);
          ctx.fillRect(x + 6, y + 3, 1, 1);
          ctx.fillRect(x + 3, y + 4, 1, 1);
          ctx.fillRect(x + 3, y + 6, 1, 1);
          break;
        case "Bad":
          ctx.fillRect(x, y, 3, 1);
          ctx.fillRect(x + 4, y, 3, 1);
          for (let i = 1; i < 3; i++) {
            ctx.fillRect(x, y + i, 1, 1);
            ctx.fillRect(x + 6, y + i, 1, 1);
          }
          for (let i = 4; i < 6; i++) {
            ctx.fillRect(x, y + i, 1, 1);
            ctx.fillRect(x + 6, y + i, 1, 1);
          }
          ctx.fillRect(x + 2, y + 2, 3, 1);
          ctx.fillRect(x + 2, y + 3, 3, 1);
          ctx.fillRect(x + 2, y + 4, 3, 1);

          ctx.fillRect(x, y + 6, 3, 1);
          ctx.fillRect(x + 4, y + 6, 3, 1);
          break;
        case "Bad2":
          ctx.fillRect(x, y, 7, 1);
          for (let i = 1; i < 6; i++) {
            ctx.fillRect(x, y + i, 1, 1);
            ctx.fillRect(x + 6, y + i, 1, 1);
          }
          ctx.fillRect(x + 2, y + 2, 1, 1);
          ctx.fillRect(x + 4, y + 2, 1, 1);
          ctx.fillRect(x + 3, y + 3, 1, 1);
          ctx.fillRect(x + 2, y + 4, 1, 1);
          ctx.fillRect(x + 4, y + 4, 1, 1);

          ctx.fillRect(x, y + 6, 7, 1);
          break;
      }
    }

    for (let y = 0; y < qrWidth; y++) {
      for (let x = 0; x < qrWidth; x++) {
        if (matrix[y * qrWidth + x] & Module.FINDER) continue;
        let on;
        if (section === "mask" && matrix[y * qrWidth + x] & Module.DATA) {
          on = maskValue(mask, x, y);
        } else {
          on = matrix[y * qrWidth + x] & Module.ON;
        }

        if (!on) continue;

        ctx.fillStyle = fgColor;
        switch (section) {
          case "finder":
            if (!(matrix[y * qrWidth + x] & Module.FINDER)) {
              if (finderShape === "Perfect") {
                ctx.fillStyle = "#ccc";
              }
            } else {
              continue;
            }
            break;
          case "alignment":
            if (!(matrix[y * qrWidth + x] & Module.ALIGNMENT)) {
              ctx.fillStyle = "#ccc";
            }
            break;
          case "timing":
            if (!(matrix[y * qrWidth + x] & Module.TIMING)) {
              ctx.fillStyle = "#ccc";
            }
            break;
          case "no-alignment-timing":
            if (matrix[y * qrWidth + x] & Module.TIMING) {
              continue;
            }
            if (matrix[y * qrWidth + x] & Module.ALIGNMENT) {
              if (!brap || y < qrWidth - 9 || x < qrWidth - 9) {
                continue;
              }
            }
            break;
          case "mask":
            if (!(matrix[y * qrWidth + x] & Module.DATA)) {
              ctx.fillStyle = "#ccc";
            }
            break;
          case "version":
            if (!(matrix[y * qrWidth + x] & Module.VERSION)) {
              ctx.fillStyle = "#ccc";
            }
            break;
        }

        if (mirror) {
          ctx.fillRect(size - 1 - margin - x, y + margin, 1, 1);
        } else {
          ctx.fillRect(x + margin, y + margin, 1, 1);
        }
      }
    }

    if (animate) {
      nextCanvas.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        easing: "ease-out",
      });
    }
  };

  const observer = useRef<IntersectionObserver>(null!);
  const regions = useRef<HTMLDivElement[]>([]);

  const setupRegion = useCallback((e) => {
    console.log("regin");
    regions.current.push(e);
  }, []);

  const setupObserver = useCallback(() => {
    console.log("setupObserver");
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-step")!;
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;

            scrollHighlight.current.style.setProperty(
              "--_top",
              `${target.offsetTop!}px`
            );
            scrollHighlight.current.style.setProperty(
              "--_yScale",
              `${target.offsetHeight / scrollHighlight.current.offsetHeight}`
            );
            setSection(key);
          }
        });
      },
      {
        root: null,
        rootMargin: matchMedia("(min-width: 640px)").matches
          ? "-50% 0px"
          : "-60% 0px -40% 0px",
      }
    );

    regions.current.forEach((e) => observer.current.observe(e));
  }, []);
  // ugly parent max-w instead of child max-w makes padding easier
  return (
    <div
      className="w-screen max-w-[1536px] ml-[calc(50%-min(768px,50vw))] flex flex-col gap-4 sm:flex-row"
      ref={setupObserver}
    >
      <div className="flex-1 z-10 sticky top-0 sm:top-[calc(max(45vh-min(768px,50vw)/2,0px))] h-full py-4 px-2 mx-2 bg-gradient-to-b from-white from-95%">
        <div
          className="max-w-80% mx-auto sm:max-w-unset relative border"
          style={{
            transform: `rotateZ(${zRot}deg) rotateX(${xRot}deg) rotateY(${yRot}deg)`,
          }}
        >
          <canvas
            ref={canvasA}
            className="w-full pixelated absolute transition-opacity"
          />
          <canvas
            ref={canvasB}
            className="w-full pixelated absolute transition-opacity"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`}>
            <path
              d={path}
              fill="none"
              stroke="#f0f"
              strokeWidth="0.1"
              transform="translate(0.5 0.5)"
            />
          </svg>
        </div>
      </div>
      <div
        ref={scrollHighlight}
        className="flex-1 flex flex-col gap-32 pt-16 pb-[30%] scroll-highlight px-4"
      >
        <div ref={setupRegion} data-step="finder">
          <p>
            <span className="font-bold">Finder patterns</span> are the big
            squares shapes in three corners and the only part of a QR code that
            requires some precision. These are used to determine the code's
            orientation, dimensions, perspective and more. The approximate ratio
            of 1:1:3:1:1 black and white pixels through the vertical and
            horizontal center is key.
          </p>
          <div className="flex">
            <div className="w-full flex border ">
              {Object.keys(FinderShapes).map(
                // @ts-expect-error fuck this shit
                (key: keyof typeof FinderShapes) => (
                  <label
                    className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer"
                    key={key}
                  >
                    <input
                      type="radio"
                      name="finder"
                      value={key}
                      checked={key === finderShape}
                      onChange={() => setFinderShape(key)}
                    />
                    {FinderShapes[key]()}
                    {key}
                  </label>
                )
              )}
            </div>
          </div>
          <p>
            To aid detection, finder patterns need a separator or "quiet zone"
            around them, but this doesn't have to be a specific size.
          </p>
        </div>
        <div ref={setupRegion} data-step="alignment">
          <p>
            <span className="font-bold">Alignment patterns</span> are smaller
            squares used to account for distortion. There's usually one in the
            last corner, but the smallest QR code doesn't have any, while very
            large codes have multiple.
          </p>
        </div>
        <div ref={setupRegion} data-step="timing">
          <p>
            <span className="font-bold">Timing patterns</span> are the
            horizontal and vertical belts of alternating black and white pixels.
            These help with aligning rows and columns while decoding.
          </p>
        </div>
        <div ref={setupRegion} data-step="no-alignment-timing">
          <p>
            Unlike the finder patterns, the timing patterns and alignment
            patterns are not strictly necessary. A QR code will{" "}
            <span className="font-italic">mostly*</span> scan fine without them.
          </p>
          <small>
            *I suspect the timing pattern is actually useless, while{" "}
            <a href="https://github.com/zxing/zxing/blob/474f4bb5a0c5ca0f200df4a8cafc1b99c8f24397/core/src/main/java/com/google/zxing/qrcode/detector/AlignmentPatternFinder.java#L30">
              the bottom right alignment pattern does help
            </a>
            .
            <label className="flex items-center">
              <input
                className="w-4 h-4 mr-1"
                type="checkbox"
                checked={brap}
                onChange={(e) => setBrap(e.target.checked)}
              />
              Enable bottom right alignment pattern
            </label>
          </small>
        </div>
        <div ref={setupRegion} data-step="format">
          <p>
            <span className="font-bold">Format information</span> stores the
            error correction level and the mask pattern applied to the data. One
            copy is in the top left, and the other copy is split between the top
            right and bottom left.
          </p>
        </div>
        <div ref={setupRegion} data-step="mask">
          <p>
            The mask is one of 8 patterns XOR-ed with the data to break up
            undesirable pixel arrangements (like the finder pattern shape).
          </p>
          <div className="w-full flex border">
            {Array.from({ length: 8 }, (_, i) => i).map((key, i) => (
              <label
                className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer"
                key={key}
              >
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
        </div>
        <div ref={setupRegion} data-step="version">
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
        </div>
        <div ref={setupRegion} data-step="data">
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
          <div className="w-full flex border ">
            {["Low", "Medium", "Quartile", "High"].map((key, i) => (
              <label
                className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer"
                key={key}
              >
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
        </div>
        <div ref={setupRegion}>
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
              checked={mirror}
              onChange={(e) => setMirror(e.target.checked)}
            />
            Mirror
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

function maskValue(mask, x, y) {
  switch (mask) {
    case 0:
      return (y + x) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (y + x) % 3 === 0;
    case 4:
      return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5:
      return ((y * x) % 2) + ((y * x) % 3) === 0;
    case 6:
      return (((y * x) % 2) + ((y * x) % 3)) % 2 === 0;
    case 7:
      return (((y + x) % 2) + ((y * x) % 3)) % 2 === 0;
  }
}
