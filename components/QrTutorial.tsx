"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import init, { ECL, generate, Mask, Mode, QrOptions, Version } from "fuqr";

let initDone = false;
let initStarted = false;

export function QrTutorial() {
  const scrollHighlight = useRef<HTMLDivElement>(null!);

  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const showA = useRef(false);
  const svgOverlay = useRef<SVGSVGElement>(null);
  const zigzag = useRef<SVGPolylineElement>(null);

  const [text, setText] = useState("hello there");
  const [version, setVersion] = useState(2);
  const [mask, setMask] = useState(Mask.M0);
  const [ecl, setECL] = useState(ECL.Low);

  const [finderShape, setFinderShape] =
    useState<keyof typeof FinderShapes>("Perfect");
  const [brap, setBrap] = useState(false); // bottom right alignment pattern
  const [drawColor, setDrawColor] = useState(false);
  const [showZigzag, setShowZigzag] = useState(false);

  const [zRot, setZRot] = useState(0);

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
  }, [finderShape, brap, section]);

  useEffect(() => {
    if (initDone) {
      render(true, false);
    }
  }, [text, ecl, version, mask]);

  // todo return type from fuqr
  const qrCode = useRef<any>(null!);

  const render = (regenerate, animate) => {
    if (regenerate) {
      try {
        qrCode.current = generate(
          text,
          new QrOptions()
            .mode(Mode.Byte)
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
    svgOverlay.current!.setAttribute("viewBox", `0 0 ${size} ${size}`);
    console.log("here");
    if (showZigzag) {
      zigzag.current!.setAttribute(
        "points",
        getZigzagPoints(qrCode.current!.matrix, qrCode.current.version * 4 + 17)
      );
    }

    const focusON = "#7f1d1d";
    const focusOFF = "#fee2e2";

    const fgColor = "#000";
    const bgColor = "#fff";
    const gray = "#ccc";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    switch (section) {
      case "finder":
        if (finderShape === "Perfect") {
          ctx.fillStyle = focusOFF;
          ctx.fillRect(margin, margin, 7, 7);
          ctx.fillRect(margin + qrWidth - 7, margin, 7, 7);
          ctx.fillRect(margin, margin + qrWidth - 7, 7, 7);
          ctx.fillStyle = focusON;
          renderFinder(ctx, finderShape, qrWidth);
          ctx.fillStyle = gray;
        } else {
          ctx.fillStyle = fgColor;
          renderFinder(ctx, finderShape, qrWidth);
        }
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            if (matrix[y * qrWidth + x] & Module.FINDER) continue;
            if (!(matrix[y * qrWidth + x] & Module.ON)) continue;
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "alignment":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.ALIGNMENT) {
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "timing":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.TIMING) {
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "no-alignment-timing":
        ctx.fillStyle = fgColor;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.TIMING) {
              ctx.fillStyle = focusOFF;
            } else if (
              module & Module.ALIGNMENT &&
              (!brap || x < qrWidth - 9 || y < qrWidth - 9)
            ) {
              ctx.fillStyle = focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = fgColor;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "mask":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.DATA) {
              ctx.fillStyle = maskValue(mask, x, y) ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "data":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.DATA) {
              continue;
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }

        const headerEnd = headerLength(outVersion);
        const eccEnd = (NUM_DATA_MODULES[outVersion] >> 3) * 8;
        const paddingEnd = eccEnd - NUM_EC_CODEWORDS[outVersion][ecl] * 8;

        const bytes = new TextEncoder().encode(text).length;
        const dataEnd = headerEnd + bytes * 8;

        let i = 0;
        let start = qrWidth - 1;
        let end = -1;
        let inc = -1;

        ctx.fillStyle = "red";
        for (let x = qrWidth - 1; x > 0; x -= 2) {
          if (x === 6) {
            x -= 1;
          }
          for (let y = start; y !== end; y += inc) {
            if (matrix[y * qrWidth + x] & Module.DATA) {
              if (i === headerEnd) {
                ctx.fillStyle = "orange";
              }
              if (i === dataEnd) {
                ctx.fillStyle = "yellow";
              } else if (i === paddingEnd) {
                ctx.fillStyle = "green";
              } else if (i === eccEnd) {
                ctx.fillStyle = "blue";
              } else {
              }
              ctx.fillRect(x + margin, y + margin, 1, 1);
              i++;
            }
            if (matrix[y * qrWidth + x - 1] & Module.DATA) {
              if (i === headerEnd) {
                ctx.fillStyle = "orange";
              }
              if (i === dataEnd) {
                ctx.fillStyle = "yellow";
              } else if (i === paddingEnd) {
                ctx.fillStyle = "green";
              } else if (i === eccEnd) {
                ctx.fillStyle = "blue";
              } else {
              }
              ctx.fillRect(x - 1 + margin, y + margin, 1, 1);
              i++;
            }
          }
          start += inc * (qrWidth - 1);
          end -= inc * (qrWidth + 1);
          inc *= -1;
        }
        break;
      case "format":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.FORMAT) {
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "version":
        ctx.fillStyle = gray;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.VERSION) {
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      default:
        ctx.fillStyle = fgColor;
        renderFinder(ctx, finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            if (matrix[y * qrWidth + x] & Module.FINDER) continue;
            if (!(matrix[y * qrWidth + x] & Module.ON)) continue;
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
    regions.current.push(e);
  }, []);

  const setupObserver = useCallback(() => {
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
            transform: `rotateZ(${zRot}deg) rotateY(${mirror ? 180 : 0}deg)`,
            filter: `invert(${invert ? 1 : 0})`,
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1 1"
            className="relative z-10"
            ref={svgOverlay}
          >
            <polyline
              ref={zigzag}
              fill="none"
              stroke="#f0f"
              strokeWidth="0.1"
              transform="translate(1.5 1.5)"
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
            squares shapes in three corners. These are used to determine the
            code's orientation, dimensions, perspective and more. The ratio of
            black and white pixels through the center is key (roughly
            1:1:3:1:1), so the corners aren't essential.
          </p>
          <div className="w-full flex border my-2">
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
          <input
            value={version}
            onChange={(e) => setVersion(e.target.valueAsNumber)}
            type="range"
            min="1"
            max="40"
          />
        </div>
        <div ref={setupRegion} data-step="timing">
          <p>
            <span className="font-bold">Timing patterns</span> are the
            horizontal and vertical belts of alternating black and white pixels.
            These supposedly help with aligning rows and columns while decoding.
          </p>
        </div>
        <div ref={setupRegion} data-step="no-alignment-timing">
          <p>
            Unlike the finder patterns, the timing patterns and alignment
            patterns are not strictly necessary in practice. A QR code will{" "}
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
        <div ref={setupRegion} data-step="data">
          <div className="font-bold text-lg">Data</div>
          <p>
            The remaining space is for the{" "}
            <span className="font-bold">data</span> (and some metadata which
            will make more sense after).{" "}
          </p>
          <input
            className="border p-2"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p>
            Surprisingly, it starts at the bottom right, and zigzags left and
            right, up and down.
          </p>
          <label className="flex items-center">
            <input
              className="w-5 h-5 mr-1"
              type="checkbox"
              checked={showZigzag}
              onChange={(e) => {
                setShowZigzag(e.target.checked);
                zigzag.current!.setAttribute(
                  "points",
                  e.target.checked
                    ? getZigzagPoints(
                        qrCode.current!.matrix,
                        qrCode.current.version * 4 + 17
                      )
                    : ""
                );
              }}
            />
            Show zigzag pattern
          </label>
        </div>
        <div ref={setupRegion} data-step="encoding">
          <p>
            It starts with a header describing the encoding mode and the data
            length. There are efficient encoding modes for numbers, alphanumeric
            strings, and Japanese characters*, but the only relevant mode for
            URLs is Byte mode, which just means UTF-8.
          </p>
          <small>
            *Most QR code generators don't support this, let alone QR code
            scanners.
          </small>
        </div>
        <div ref={setupRegion} data-step="ecl">
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
          </div>
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
        <div ref={setupRegion} data-step="format">
          <p>
            <span className="font-bold">Format information</span> stores the
            error correction level and the mask pattern applied to the data. One
            copy is in the top left, and the other copy is split between the top
            right and bottom left.
          </p>
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
        </div>
        <div ref={setupRegion} data-step="transformations">
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

function getZigzagPoints(matrix, qrWidth) {
  let points = "";
  let start = qrWidth - 1;
  let end = -1;
  let inc = -1;

  for (let x = qrWidth - 1; x > 0; x -= 2) {
    if (x === 6) {
      x -= 1;
    }
    for (let y = start; y !== end; y += inc) {
      if (matrix[y * qrWidth + x] & Module.DATA) {
        points += `${x},${y} `;
      }
      if (matrix[y * qrWidth + x - 1] & Module.DATA) {
        points += `${x - 1},${y} `;
      }
    }
    start += inc * (qrWidth - 1);
    end -= inc * (qrWidth + 1);
    inc *= -1;
  }
  return points;
}

function renderFinder(ctx, finderShape, qrWidth) {
  const margin = 1;
  for (const [x, y] of [
    [margin, margin],
    [margin + qrWidth - 7, margin],
    [margin, margin + qrWidth - 7],
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
}

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

function headerLength(version) {
  return 4 + (version < 10 ? 8 : 16);
}

const NUM_DATA_MODULES = [
  0, 208, 359, 567, 807, 1079, 1383, 1568, 1936, 2336, 2768, 3232, 3728, 4256,
  4651, 5243, 5867, 6523, 7211, 7931, 8683, 9252, 10068, 10916, 11796, 12708,
  13652, 14628, 15371, 16411, 17483, 18587, 19723, 20891, 22091, 23008, 24272,
  25568, 26896, 28256, 29648,
];

const NUM_EC_CODEWORDS = [
  [0, 0, 0, 0],
  [7, 10, 13, 17],
  [10, 16, 22, 28],
  [15, 26, 36, 44],
  [20, 36, 52, 64],
  [26, 48, 72, 88],
  [36, 64, 96, 112],
  [40, 72, 108, 130],
  [48, 88, 132, 156],
  [60, 110, 160, 192],
  [72, 130, 192, 224],
  [80, 150, 224, 264],
  [96, 176, 260, 308],
  [104, 198, 288, 352],
  [120, 216, 320, 384],
  [132, 240, 360, 432],
  [144, 280, 408, 480],
  [168, 308, 448, 532],
  [180, 338, 504, 588],
  [196, 364, 546, 650],
  [224, 416, 600, 700],
  [224, 442, 644, 750],
  [252, 476, 690, 816],
  [270, 504, 750, 900],
  [300, 560, 810, 960],
  [312, 588, 870, 1050],
  [336, 644, 952, 1110],
  [360, 700, 1020, 1200],
  [390, 728, 1050, 1260],
  [420, 784, 1140, 1350],
  [450, 812, 1200, 1440],
  [480, 868, 1290, 1530],
  [510, 924, 1350, 1620],
  [540, 980, 1440, 1710],
  [570, 1036, 1530, 1800],
  [570, 1064, 1590, 1890],
  [600, 1120, 1680, 1980],
  [630, 1204, 1770, 2100],
  [660, 1260, 1860, 2220],
  [720, 1316, 1950, 2310],
  [750, 1372, 2040, 2430],
];
