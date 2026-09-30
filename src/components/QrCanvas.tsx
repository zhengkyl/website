import {
  ByteEncoder,
  ByteMode,
  iterateMostlyDataModules,
  MASKERS,
  Module,
  NUM_DATA_BITS,
  type QrCode,
} from "furious-qr";
import { buildBlueprint } from "furious-qr/extras/blueprint";
import { useRef } from "preact/hooks";

type Props = {
  section: string;
  finderShape: string;
  brap: boolean;
  showZigzag: boolean;
  showBytes: boolean;
  text: string;
  qrCode: QrCode;
};

const margin = 1;

export const PALETTE = ["#ffe7e6", "#f1b858", "#21a0c0", "#6d034e"];

const focusON = "#7f1d1d";
const focusOFF = "#fee2e2";

const fgColor = "#000";
const bgColor = "#fff";
const gray = "#ccc";

// sections that highlight every module with a flag
const HIGHLIGHT: Record<string, number> = {
  alignment: Module.ALIGNMENT,
  timing: Module.TIMING,
  format: Module.FORMAT,
  version: Module.VERSION,
  data: Module.DATA,
};

export function QrCanvas(props: Props) {
  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const showA = useRef(false);

  const prevSection = useRef(props.section);
  let size = 1;

  // refs are null on the first render (and during SSR), and this draws
  // during render, so there's nothing to draw into yet
  if (
    props.qrCode != null &&
    canvasA.current != null &&
    canvasB.current != null
  ) {
    const animate =
      props.section !== prevSection.current || props.section === "finder";

    prevSection.current = props.section;

    // NOTE this isn't pure!!!, but works in prod so idc
    if (animate) showA.current = !showA.current;
    const nextCanvas = (showA.current ? canvasA : canvasB).current!;
    const prevCanvas = (showA.current ? canvasB : canvasA).current!;
    prevCanvas.style.zIndex = "-1";
    nextCanvas.style.zIndex = "1";

    size = props.qrCode.version * 4 + 17 + 2 * margin;
    nextCanvas.width = size;
    nextCanvas.height = size;
    drawQr(nextCanvas.getContext("2d")!, props);

    if (animate) {
      nextCanvas.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        easing: "ease-out",
      });
    }
  }

  return (
    <>
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
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
        style={{
          zIndex: props.showZigzag && props.section === "zigzag" ? 2 : -1,
        }}
      >
        <polyline
          points={
            props.qrCode && props.section === "zigzag"
              ? getZigzagPoints(props.qrCode)
              : ""
          }
          fill="none"
          stroke="#f0f"
          strokeWidth="0.1"
          transform={`translate(${margin + 0.5} ${margin + 0.5})`}
        />
      </svg>
    </>
  );
}

// fill color for a non-finder module, or undefined to leave it blank
type ModuleColor = (module: number, x: number, y: number) => string | undefined;

const ifOn = (color: string) => (module: number) =>
  module & Module.ON ? color : undefined;

const grayIfOn = ifOn(gray);

function drawQr(ctx: CanvasRenderingContext2D, props: Props) {
  const { matrix, version, mask } = props.qrCode;
  const qrWidth = version * 4 + 17;
  const size = qrWidth + 2 * margin;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  let finderColor = gray;
  let color: ModuleColor = grayIfOn;

  const highlight = HIGHLIGHT[props.section];
  if (highlight != null) {
    color = (module) =>
      module & highlight
        ? module & Module.ON
          ? focusON
          : focusOFF
        : grayIfOn(module);
  } else {
    switch (props.section) {
      case "finder":
        if (props.finderShape === "Perfect") {
          ctx.fillStyle = focusOFF;
          ctx.fillRect(margin, margin, 7, 7);
          ctx.fillRect(margin + qrWidth - 7, margin, 7, 7);
          ctx.fillRect(margin, margin + qrWidth - 7, 7, 7);
          finderColor = focusON;
        } else {
          finderColor = fgColor;
          color = ifOn(fgColor);
        }
        break;
      case "no-alignment-timing":
        finderColor = fgColor;
        color = (module, x, y) =>
          module & Module.TIMING ||
          (module & Module.ALIGNMENT &&
            (!props.brap || x < qrWidth - 9 || y < qrWidth - 9))
            ? focusOFF
            : module & Module.ON
              ? fgColor
              : undefined;
        break;
      case "mask":
        color = (module, x, y) =>
          module & Module.DATA
            ? MASKERS[mask](x, y)
              ? focusON
              : focusOFF
            : grayIfOn(module);
        break;
      case "zigzag":
      case "codewords":
      case "breakdown":
      case "encoding":
        // data modules are drawn afterwards
        color = (module) =>
          module & Module.DATA ? undefined : grayIfOn(module);
        break;
      default:
        finderColor = fgColor;
        color = ifOn(fgColor);
    }
  }

  ctx.fillStyle = finderColor;
  renderFinder(ctx, props.finderShape, qrWidth);

  for (let y = 0; y < qrWidth; y++) {
    for (let x = 0; x < qrWidth; x++) {
      const module = matrix[y * qrWidth + x];
      if (module & Module.FINDER) continue;
      const fill = color(module, x, y);
      if (fill == null) continue;
      ctx.fillStyle = fill;
      ctx.fillRect(x + margin, y + margin, 1, 1);
    }
  }

  switch (props.section) {
    case "zigzag":
      drawBytes(ctx, props.qrCode, props.showBytes);
      break;
    case "codewords":
    case "breakdown":
    case "encoding":
      drawEncoding(ctx, props.qrCode, props.section, props.text);
      break;
  }
}

function forEachDataModule(
  { matrix, version }: QrCode,
  callback: (x: number, y: number) => void,
) {
  const qrWidth = version * 4 + 17;
  iterateMostlyDataModules(qrWidth, (x, y) => {
    if (matrix[y * qrWidth + x] & Module.DATA) callback(x, y);
  });
}

// colors each byte in placement order, remainder bits are black
function drawBytes(
  ctx: CanvasRenderingContext2D,
  qrCode: QrCode,
  showBytes: boolean,
) {
  const numBits = (NUM_DATA_BITS[qrCode.version] >> 3) * 8;
  const colors = showBytes ? PALETTE : [focusOFF];

  let i = 0;
  forEachDataModule(qrCode, (x, y) => {
    ctx.fillStyle = i < numBits ? colors[(i >> 3) % colors.length] : "black";
    ctx.fillRect(x + margin, y + margin, 1, 1);
    i++;
  });
}

// colors each bit by what it encodes: header, content, padding, ec, remainder
function drawEncoding(
  ctx: CanvasRenderingContext2D,
  qrCode: QrCode,
  section: string,
  text: string,
) {
  const { version, ecl, mask } = qrCode;
  const qrWidth = version * 4 + 17;
  const blueprint = buildBlueprint(version, ecl, mask);

  const headerEnd = 4 + ByteMode.cciLen(version);
  const contentEnd = new ByteEncoder(text).bitLen(version);

  const [header, content, padding, ec, remainder] =
    section === "codewords"
      ? [PALETTE[2], PALETTE[2], PALETTE[2], PALETTE[1], "black"]
      : [PALETTE[3], PALETTE[2], PALETTE[0], PALETTE[1], "black"];

  let i = 0;
  forEachDataModule(qrCode, (x, y) => {
    // (block << 8 | offset) + 1, or 0 for remainder bits
    const key = blueprint.matrix[y * qrWidth + x] >>> 8;
    if (key === 0) {
      ctx.fillStyle = remainder;
    } else {
      const block = (key - 1) >> 8;
      const offset = (key - 1) & 0xff;
      // group 2 blocks hold one extra message byte
      const g2Before = Math.max(0, block - blueprint.g1Blocks);
      const messageLen =
        blueprint.messagePerG1 + (block >= blueprint.g1Blocks ? 1 : 0);
      if (offset >= messageLen) {
        ctx.fillStyle = ec;
      } else {
        const blockStart = block * blueprint.messagePerG1 + g2Before;
        const bit = (blockStart + offset) * 8 + (i % 8);
        ctx.fillStyle =
          bit < headerEnd ? header : bit < contentEnd ? content : padding;
      }
    }
    ctx.fillRect(x + margin, y + margin, 1, 1);
    i++;
  });
}

function getZigzagPoints(qrCode: QrCode) {
  let points = "";
  forEachDataModule(qrCode, (x, y) => {
    points += `${x},${y} `;
  });
  return points;
}

function renderFinder(
  ctx: CanvasRenderingContext2D,
  finderShape: string,
  qrWidth: number,
) {
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
