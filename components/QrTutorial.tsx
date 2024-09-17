"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export function QrTutorial(props) {
  const scrollHighlight = useRef<HTMLDivElement>(null!);

  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const flip = useRef(true);

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
  const [mirror, setMirror] = useState(false);

  const [section, setSection] = useState("");

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

  useEffect(() => {
    if (!initStarted) {
      initStarted = true;
      init().then(() => {
        initDone = true;
        render();
      });
    } else if (initDone) {
      render();
    }
  }, [text, version, ecl, mask, invert, mirror, section]);

  const prevSection = useRef(section);

  const render = () => {
    try {
      console.log("rendder");
      const { matrix, version: outVersion } = generate(
        text,
        new QrOptions()
          .min_ecl(ecl)
          .strict_ecl(true)
          .min_version(new Version(version))
          .mask(mask)
      );
      const nextCanvas = (flip.current ? canvasA : canvasB).current!;
      const prevCanvas = (flip.current ? canvasB : canvasA).current!;

      prevCanvas.style.zIndex = "-1";
      nextCanvas.style.zIndex = "1";

      // nextCanvas.style.opacity = "0";

      const ctx = nextCanvas.getContext("2d")!;
      flip.current = !flip.current;
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
      for (let y = 0; y < qrWidth; y++) {
        for (let x = 0; x < qrWidth; x++) {
          let on;
          if (section === "mask" && matrix[y * qrWidth + x] & Module.DATA) {
            switch (mask) {
              case 0:
                on = (y + x) % 2 === 0;
                break;
              case 1:
                on = y % 2 === 0;
                break;
              case 2:
                on = x % 3 === 0;
                break;
              case 3:
                on = (y + x) % 3 === 0;
                break;
              case 4:
                on = (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
                break;
              case 5:
                on = ((y * x) % 2) + ((y * x) % 3) === 0;
                break;
              case 6:
                on = (((y * x) % 2) + ((y * x) % 3)) % 2 === 0;
                break;
              case 7:
                on = (((y + x) % 2) + ((y * x) % 3)) % 2 === 0;
                break;
            }
          } else {
            on = matrix[y * qrWidth + x] & Module.ON;
          }

          if (!on) continue;

          ctx.fillStyle = fgColor;
          switch (section) {
            case "finder":
              if (!(matrix[y * qrWidth + x] & Module.FINDER)) {
                ctx.fillStyle = "#ccc";
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

      // only animate sections
      if (prevSection.current !== section) {
        nextCanvas.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 100,
          easing: "ease-out",
        });
      }
      prevSection.current = section;
    } catch (e) {
      console.error("Exceeded max capacity, fool");
    }
  };

  const observer = useRef<IntersectionObserver>(null!);
  const finderRef = useRef<HTMLDivElement>(null!);
  const alignmentRef = useRef<HTMLDivElement>(null!);
  const timingRef = useRef<HTMLDivElement>(null!);
  const formatRef = useRef<HTMLDivElement>(null!);
  const maskRef = useRef<HTMLDivElement>(null!);
  const versionRef = useRef<HTMLDivElement>(null!);
  const dataRef = useRef<HTMLDivElement>(null!);

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

    observer.current.observe(finderRef.current);
    observer.current.observe(alignmentRef.current);
    observer.current.observe(timingRef.current);
    observer.current.observe(formatRef.current);
    observer.current.observe(maskRef.current);
    observer.current.observe(versionRef.current);
    observer.current.observe(dataRef.current);
  }, []);
  // ugly parent max-w instead of child max-w makes padding easier
  return (
    <div
      className="w-screen max-w-[1536px] ml-[calc(50%-min(768px,50vw))] flex flex-col gap-4 sm:flex-row"
      ref={setupObserver}
    >
      <div className="flex-1 z-10 sticky top-0 h-full py-4 px-2 mx-2 bg-gradient-to-b from-white from-95%">
        <div
          className="max-w-80% mx-auto sm:max-w-unset relative"
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
        className="flex-1 flex flex-col gap-32 py-32 scroll-highlight px-4"
      >
        <div ref={finderRef} data-step="finder">
          <p>
            <span className="font-bold">Finder patterns</span> are the big
            squares shapes in three corners. These are used to determine the
            code's orientation, dimensions, perspective and more. The
            approximate ratio of 1:1:3:1:1 black and white pixels through the
            vertical and horizontal center is key.
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
            often necessary to preserve this ratio. That's because this is the ONE AND ONLY place where precision somewhat matters.
          </p>
        </div>
        <div ref={alignmentRef} data-step="alignment">
          <p>
            <span className="font-bold">Alignment patterns</span> are smaller
            squares used to account for distortion. There's usually one in the
            last corner, but the smallest QR code doesn't have any, while very
            large codes have multiple.
          </p>
        </div>
        <div ref={timingRef} data-step="timing">
          <p>
            <span className="font-bold">Timing patterns</span> are the
            horizontal and vertical belts of alternating black and white pixels.
            These help with aligning rows and columns while decoding.
          </p>
        </div>
        <p>
          Unlike the finder patterns, the timing patterns and alignment patterns
          are not strictly necessary. A QR code will{" "}
          <span className="font-italic">mostly</span> scan fine without them.
        </p>
        <div ref={formatRef} data-step="format">
          <p>
            <span className="font-bold">Format information</span> stores the
            error correction level and the mask pattern applied to the data. One
            copy is in the top left, and the other copy is split between the top
            right and bottom left.
          </p>
        </div>
        <div ref={maskRef} data-step="mask">
          <p>
            The mask is one of 8 patterns XOR-ed with the data to break up
            undesirable pixel arrangements (like the finder pattern ratio).
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
        <div ref={versionRef} data-step="version">
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
        <div ref={dataRef} data-step="data">
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
        <div>
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
