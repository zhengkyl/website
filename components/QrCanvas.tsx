import { useRef } from "react";

type Props = {
  section: string;
  finderShape: string;
  brap: boolean;
  showZigzag: boolean;
  showBytes: boolean;
  text: string;
  qrCode: any;
};

const margin = 1;

export const PALETTE = ["#ffe7e6", "#f1b858", "#21a0c0", "#6d034e"];

export function QrCanvas(props: Props) {
  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);
  const showA = useRef(false);

  const prevSection = useRef(props.section);
  let size = 1;

  if (props.qrCode != null) {
    const animate =
      props.section !== prevSection.current || props.section === "finder";

    prevSection.current = props.section;

    // NOTE this isn't pure!!!, but works in prod so idc
    if (animate) showA.current = !showA.current;
    const nextCanvas = (showA.current ? canvasA : canvasB).current!;
    const prevCanvas = (showA.current ? canvasB : canvasA).current!;
    prevCanvas.style.zIndex = "-1";
    nextCanvas.style.zIndex = "1";

    const { matrix, version, ecl, mask } = props.qrCode;
    const ctx = nextCanvas.getContext("2d")!;
    const qrWidth = version * 4 + 17;

    size = qrWidth + 2 * margin;
    ctx.canvas.width = size;
    ctx.canvas.height = size;

    const focusON = "#7f1d1d";
    const focusOFF = "#fee2e2";

    const fgColor = "#000";
    const bgColor = "#fff";
    const gray = "#ccc";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    switch (props.section) {
      case "finder":
        if (props.finderShape === "Perfect") {
          ctx.fillStyle = focusOFF;
          ctx.fillRect(margin, margin, 7, 7);
          ctx.fillRect(margin + qrWidth - 7, margin, 7, 7);
          ctx.fillRect(margin, margin + qrWidth - 7, 7, 7);
          ctx.fillStyle = focusON;
          renderFinder(ctx, props.finderShape, qrWidth);
          ctx.fillStyle = gray;
        } else {
          ctx.fillStyle = fgColor;
          renderFinder(ctx, props.finderShape, qrWidth);
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
        renderFinder(ctx, props.finderShape, qrWidth);
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
        renderFinder(ctx, props.finderShape, qrWidth);
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
        renderFinder(ctx, props.finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.TIMING) {
              ctx.fillStyle = focusOFF;
            } else if (
              module & Module.ALIGNMENT &&
              (!props.brap || x < qrWidth - 9 || y < qrWidth - 9)
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
      case "format":
        ctx.fillStyle = gray;
        renderFinder(ctx, props.finderShape, qrWidth);
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
        renderFinder(ctx, props.finderShape, qrWidth);
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
      case "data":
        ctx.fillStyle = gray;
        renderFinder(ctx, props.finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.DATA) {
              ctx.fillStyle = module & Module.ON ? focusON : focusOFF;
            } else {
              if (!(module & Module.ON)) continue;
              ctx.fillStyle = gray;
            }
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }
        break;
      case "zigzag": {
        ctx.fillStyle = gray;
        renderFinder(ctx, props.finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.DATA) continue;
            if (!(module & Module.ON)) continue;
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }

        const eccEnd = (NUM_DATA_MODULES[version] >> 3) * 8;

        let i = 0;
        let start = qrWidth - 1;
        let end = -1;
        let inc = -1;

        const colors = props.showBytes ? PALETTE : [focusOFF];
        const endColor = "black";
        ctx.fillStyle = colors[0];
        for (let x = qrWidth - 1; x > 0; x -= 2) {
          if (x === 6) {
            x -= 1;
          }
          for (let y = start; y !== end; y += inc) {
            if (matrix[y * qrWidth + x] & Module.DATA) {
              if (i % 8 === 0) {
                ctx.fillStyle =
                  i < eccEnd
                    ? colors[Math.floor(i / 8) % colors.length]
                    : endColor;
              }
              ctx.fillRect(x + margin, y + margin, 1, 1);
              i++;
            }
            if (matrix[y * qrWidth + x - 1] & Module.DATA) {
              if (i % 8 === 0) {
                ctx.fillStyle =
                  i < eccEnd
                    ? colors[Math.floor(i / 8) % colors.length]
                    : endColor;
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
      }
      case "codewords":
      // INTENTIONAL FALL THROUGH
      case "breakdown":
      // INTENTIONAL FALL THROUGH
      case "encoding":
        ctx.fillStyle = gray;
        renderFinder(ctx, props.finderShape, qrWidth);
        for (let y = 0; y < qrWidth; y++) {
          for (let x = 0; x < qrWidth; x++) {
            const module = matrix[y * qrWidth + x];
            if (module & Module.FINDER) continue;
            if (module & Module.DATA) continue;
            if (!(module & Module.ON)) continue;
            ctx.fillRect(x + margin, y + margin, 1, 1);
          }
        }

        const headerEnd = headerLength(version);
        const eccEnd = (NUM_DATA_MODULES[version] >> 3) * 8;
        const paddingEnd = eccEnd - NUM_EC_CODEWORDS[version][ecl] * 8;

        const bytes = new TextEncoder().encode(props.text).length;
        const dataEnd = headerEnd + bytes * 8;

        let i = 0;
        let start = qrWidth - 1;
        let end = -1;
        let inc = -1;

        const colors =
          props.section === "codewords"
            ? [PALETTE[2], PALETTE[2], PALETTE[2], PALETTE[1], "black"]
            : [PALETTE[3], PALETTE[2], PALETTE[0], PALETTE[1], "black"];
        ctx.fillStyle = colors[0];
        for (let x = qrWidth - 1; x > 0; x -= 2) {
          if (x === 6) {
            x -= 1;
          }
          for (let y = start; y !== end; y += inc) {
            if (matrix[y * qrWidth + x] & Module.DATA) {
              if (i === headerEnd) {
                ctx.fillStyle = colors[1];
              }
              if (i === dataEnd) {
                ctx.fillStyle = colors[2];
              } else if (i === paddingEnd) {
                ctx.fillStyle = colors[3];
              } else if (i === eccEnd) {
                ctx.fillStyle = colors[4];
              }
              ctx.fillRect(x + margin, y + margin, 1, 1);
              i++;
            }
            if (matrix[y * qrWidth + x - 1] & Module.DATA) {
              if (i === headerEnd) {
                ctx.fillStyle = colors[1];
              }
              if (i === dataEnd) {
                ctx.fillStyle = colors[2];
              } else if (i === paddingEnd) {
                ctx.fillStyle = colors[3];
              } else if (i === eccEnd) {
                ctx.fillStyle = colors[4];
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
      case "mask":
        ctx.fillStyle = gray;
        renderFinder(ctx, props.finderShape, qrWidth);
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
      default:
        ctx.fillStyle = fgColor;
        renderFinder(ctx, props.finderShape, qrWidth);
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
              ? getZigzagPoints(
                  props.qrCode.matrix,
                  props.qrCode.version * 4 + 17
                )
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

function renderFinder(ctx, finderShape, qrWidth) {
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
