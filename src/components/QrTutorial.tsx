"use client";

import init, { ECL, generate, Mask, Mode, QrOptions, Version } from "fuqr";
import wasmUrl from 'fuqr/fuqr_bg.wasm?url';
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { PALETTE, QrCanvas } from "./QrCanvas";
import { Sa } from "./mdx";

let globalInitStarted = false;
let globalInitDone = false;

export function QrTutorial() {
  const scrollHighlight = useRef<HTMLDivElement>(null!);
  const [section, setSection] = useState("");

  const [text, setText] = useState("hello there");
  const [version, setVersion] = useState(2);
  const [mask, setMask] = useState(Mask.M0);
  const [ecl, setECL] = useState(ECL.Low);

  const [finderShape, setFinderShape] =
    useState<keyof typeof FinderShapes>("Perfect");
  const [brap, setBrap] = useState(false); // bottom right alignment pattern
  const [showZigzag, setShowZigzag] = useState(true);
  const [showBytes, setShowBytes] = useState(false);

  const [zRot, setZRot] = useState(0);
  const [perspective, setPerspective] = useState(false);
  const [invert, setInvert] = useState(false);
  const [mirror, setMirror] = useState(false);

  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    // we need globals to track init status after unmounting
    // but the first render sets up refs, which we NEED in QrCanvas
    // so we always setInitDone() and do everything on second render

    if (!globalInitStarted) {
      globalInitStarted = true;
      init({module_or_path: wasmUrl}).then(() => {
        setInitDone(true);
        globalInitDone = true;
      });
    } else if (globalInitDone) {
      setInitDone(true);
    }
  }, []);

  const observer = useRef<IntersectionObserver>(null!);
  const regions = useRef<HTMLDivElement[]>([]);

  const setupRegion = useCallback((r: HTMLDivElement | null) => {
    if (r == null) return;
    // gross but no reasonable choice w/ react 19
    if (regions.current.includes(r)) return;
    regions.current.push(r);
  }, []);

  const setupObserver = useCallback((r: HTMLDivElement | null) => {
    if (r == null) observer.current.disconnect();

    if (observer.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-step")!;
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;

            scrollHighlight.current.style.setProperty(
              "--_top",
              `${target.offsetTop!}px`,
            );
            scrollHighlight.current.style.setProperty(
              "--_yScale",
              `${target.offsetHeight / scrollHighlight.current.offsetHeight}`,
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
      },
    );

    regions.current.forEach((e) => observer.current.observe(e));
  }, []);

  const angleRad = (zRot * Math.PI) / 180;
  const scale = perspective
    ? 1
    : 1 / (Math.abs(Math.cos(angleRad)) + Math.abs(Math.sin(angleRad)));

  // todo type from fuqr
  const qrCode = useRef<any>(null!);
  const prevText = useRef(text);

  if (
    initDone &&
    (qrCode.current == null ||
      text !== prevText.current ||
      version !== qrCode.current.version ||
      ecl !== qrCode.current.ecl ||
      mask !== qrCode.current.mask)
  ) {
    try {
      qrCode.current = generate(
        text,
        new QrOptions()
          .mode(Mode.Byte)
          .min_ecl(ecl)
          .strict_ecl(true)
          .min_version(new Version(version))
          .mask(mask),
      );
      prevText.current = text;
      setVersion(qrCode.current.version);
    } catch (e) {
      console.error("Exceeded max capacity, fool");
      return;
    }
  }

  return (
    <div
      // ugly parent max-w instead of child max-w makes padding easier
      className="w-screen max-w-[1536px] ml-[calc(50%-min(768px,50vw))] flex flex-col gap-4 sm:flex-row"
      ref={setupObserver}
    >
      <div className="flex-1 z-10 sticky top-0 sm:top-[calc(max(45vh-min(768px,50vw)/2,0px))] h-full py-4 px-2 mx-2 bg-gradient-to-b from-white from-95%">
        <div
          className="max-w-[30vh] sm:max-w-unset mx-auto relative border"
          style={{
            transform: `${
              perspective
                ? "scale(0.7) perspective(150vmin) rotateX(45deg)"
                : ""
            } rotateZ(${zRot}deg) rotateY(${mirror ? 180 : 0}deg)`,
            filter: `invert(${invert ? 1 : 0})`,
            scale,
            transitionProperty: "transform, scale",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease-out",
          }}
        >
          <QrCanvas
            section={section}
            text={text}
            qrCode={qrCode.current}
            finderShape={finderShape}
            brap={brap}
            showZigzag={showZigzag}
            showBytes={showBytes}
          />
        </div>
        <div
          className={`flex-wrap justify-center gap-x-4 gap-y-2 py-2 transition-opacity text-sm sm:text-base ${
            section === "codewords" ||
            section === "breakdown" ||
            section === "encoding"
              ? "flex"
              : "hidden"
          }`}
        >
          {section !== "codewords" && (
            <div className="flex gap-1 items-center">
              <div
                className="w-5 h-5"
                style={{
                  background: PALETTE[3],
                  filter: `invert(${invert ? 1 : 0})`,
                }}
              ></div>
              Header
            </div>
          )}
          <div className="flex gap-1 items-center">
            <div
              className="w-5 h-5"
              style={{
                background: PALETTE[2],
                filter: `invert(${invert ? 1 : 0})`,
              }}
            ></div>
            Data
          </div>
          {section !== "codewords" && (
            <div className="flex gap-1 items-center">
              <div
                className="w-5 h-5"
                style={{
                  background: PALETTE[0],
                  filter: `invert(${invert ? 1 : 0})`,
                }}
              ></div>
              Unused capacity
            </div>
          )}
          <div className="flex gap-1 items-center">
            <div
              className="w-5 h-5"
              style={{
                background: PALETTE[1],
                filter: `invert(${invert ? 1 : 0})`,
              }}
            ></div>
            Error correction
          </div>
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
              ),
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
          <label className="flex flex-col gap-1 p-2 border my-2">
            <div>Size</div>
            <input
              className="block w-full"
              value={version}
              onChange={(e) => setVersion(e.currentTarget.valueAsNumber)}
              type="range"
              min="1"
              max="40"
            />
          </label>
        </div>
        <div ref={setupRegion} data-step="timing">
          <p>
            <span className="font-bold">Timing patterns</span> are the
            horizontal and vertical belts of alternating black and white pixels.
            These supposedly help with aligning rows and columns while decoding.
          </p>
        </div>
        <div
          ref={setupRegion}
          data-step="no-alignment-timing"
          className="flex flex-col gap-2"
        >
          <p>
            Unlike the finder patterns, the timing patterns and alignment
            patterns are not strictly necessary in practice. A QR code will{" "}
            <span className="font-italic">mostly*</span> scan fine without them.
          </p>
          <p>
            <small className="block">
              *
              <Sa href="https://github.com/zxing/zxing/blob/474f4bb5a0c5ca0f200df4a8cafc1b99c8f24397/core/src/main/java/com/google/zxing/qrcode/detector/AlignmentPatternFinder.java#L30">
                The bottom right alignment pattern does help
              </Sa>
              , especially for larger sizes, while the timing pattern seems to
              be completely useless.
            </small>
            <label className="flex items-center gap-1 w-fit">
              <input
                className="w-5 h-5"
                type="checkbox"
                checked={brap}
                onChange={(e) => setBrap(e.currentTarget.checked)}
              />
              Enable bottom right alignment pattern
            </label>
          </p>
        </div>
        <div ref={setupRegion} data-step="format">
          <p>
            <span className="font-bold">Format information</span> stores the
            error correction level and the mask pattern applied to the data
            (explained below). One copy is in the top left, and the other copy
            is split between the top right and bottom left.
          </p>
        </div>
        <div ref={setupRegion} data-step="version">
          <p>
            Very large QR codes will have a section for{" "}
            <span className="font-bold">version information</span>. Version
            means size, and it ranges from 1–40. One copy is in the top right,
            and the other copy is in the bottom left.
          </p>
          <label className="flex flex-col gap-1 p-2 border my-2">
            <div>Version {version}</div>
            <input
              className="block w-full"
              value={version}
              onChange={(e) => setVersion(e.currentTarget.valueAsNumber)}
              type="range"
              min="1"
              max="40"
            />
          </label>
          <p>
            For smaller codes, size can be accurately calculated just using the
            distance between the finder patterns.
          </p>
        </div>
        <div ref={setupRegion} data-step="data">
          <p>
            The remaining space is for the{" "}
            <span className="font-bold">data</span>.
          </p>
          <input
            className="block border w-full p-2 my-2"
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </div>
        <div
          ref={setupRegion}
          data-step="zigzag"
          className="flex flex-col gap-2"
        >
          <p>
            Perhaps surprisingly, it starts at the bottom right and zigzags up
            and down, from the right to the left.
          </p>
          <label className="flex items-center gap-1 self-start">
            <input
              className="w-5 h-5"
              type="checkbox"
              checked={showZigzag}
              onChange={(e) => setShowZigzag(e.currentTarget.checked)}
            />
            Show zigzag
          </label>
          <p>
            The bits are organized in blocks of 8 (aka bytes), so the last few
            pixels will be unused if the number of data pixels isn't divisible
            by 8.
          </p>
          <label className="flex items-center gap-1 self-start">
            <input
              className="w-5 h-5"
              type="checkbox"
              checked={showBytes}
              onChange={(e) => setShowBytes(e.currentTarget.checked)}
            />
            Show byte boundaries
          </label>
        </div>
        <div ref={setupRegion} data-step="codewords">
          <p>
            There are 4 levels of error correction which allow roughly 7%, 15%,
            25%, or 30% of all the bytes to be recovered. See how increasing the
            error correction also reduces the data capacity.
          </p>
          <div className="w-full flex border my-2">
            {["Low", "Medium", "Quartile", "High"].map((key, i) => (
              <label
                className="flex-1 flex flex-col items-center gap-2 border p-2 cursor-pointer"
                key={key}
              >
                <input
                  type="radio"
                  name="ecl1"
                  value={i}
                  checked={i === ecl}
                  onChange={() => setECL(i)}
                />
                {key}
              </label>
            ))}
          </div>
        </div>
        <div ref={setupRegion} data-step="breakdown">
          <p>
            If you further break down the data, you'll see it starts with a
            header and is padded to fill the unused capacity. You can play
            around with the error correction level, version (size), and input
            text to see how the space is used.
          </p>
          <label className="flex flex-col gap-1 p-2 border my-2">
            <div>Version {version}</div>
            <input
              className="block w-full"
              value={version}
              onChange={(e) => setVersion(e.currentTarget.valueAsNumber)}
              type="range"
              min="1"
              max="40"
            />
          </label>
          <input
            className="block border w-full p-2 my-2"
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <small>
            THIS MAY LOOK VERY WEIRD. After the certain size, the data bytes are
            interleaved so they are spread throughout the space rather than
            placed continguously. Also, the header isn't a multiple of 8 bits,
            so the data isn't byte aligned.
          </small>
        </div>
        <div ref={setupRegion} data-step="encoding">
          <p>
            The data header describes the encoding mode and the character count.
            There are efficient encoding modes for numbers and alphanumeric
            text, but the only relevant mode for URLs is Byte mode*, which just
            means UTF-8.
          </p>
          <small>
            *Alphanumeric mode can encode URLs, but it only supports uppercase
            characters, so no one uses it.
          </small>
        </div>
        <div ref={setupRegion} data-step="mask">
          <p>
            Finally, the <span className="font-bold">mask</span> is one of 8
            patterns XOR-ed with the data to break up undesirable pixel
            arrangements (like the finder pattern shape).
          </p>
          <div className="w-full flex border my-2">
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
        <div
          ref={setupRegion}
          data-step="miscellaneous"
          className="flex flex-col gap-2"
        >
          <div className="font-bold text-lg">Miscellaneous</div>
          <p>
            QR codes can be rotated, mirrored, and the "dark" and "light" pixels
            can be inverted.
          </p>
          <label className="flex flex-col gap-1 p-2 border my-2">
            <div>Rotation {zRot}°</div>
            <input
              className="block w-full"
              value={zRot}
              onChange={(e) => setZRot(e.currentTarget.valueAsNumber)}
              type="range"
              step="15"
              min="-180"
              max="180"
            />
          </label>
          <label className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              type="checkbox"
              checked={perspective}
              onChange={(e) => setPerspective(e.currentTarget.checked)}
            />
            Perspective
          </label>
          <label className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              type="checkbox"
              checked={mirror}
              onChange={(e) => setMirror(e.currentTarget.checked)}
            />
            Mirror
          </label>
          <label className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              type="checkbox"
              checked={invert}
              onChange={(e) => setInvert(e.currentTarget.checked)}
            />
            Invert color
          </label>
        </div>
      </div>
    </div>
  );
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
