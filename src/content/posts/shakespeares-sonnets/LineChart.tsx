import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { sonnetDate } from "./Scrawl";

type Props = {
  title: string;
  values: number[];
  // y axis runs 0..max, one gridline every step
  max: number;
  step: number;
  // how the tooltip reads a value; a function would not survive the island
  // boundary, so the choice crosses as a string
  format: "wpm" | "duration";
  // a horizontal line to chase, drawn in the same scale as the data
  reference?: { value: number; label: string };
};

function formatValue(value: number, format: Props["format"]) {
  if (format === "wpm") return `${value.toFixed(1)} wpm`;
  const seconds = Math.round(value * 60);
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

const PLOT_HEIGHT = 190;
const PAD = { top: 10, right: 14, bottom: 20, left: 34 };

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short" });
const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function LineChart({
  title,
  values,
  max,
  step,
  format,
  reference,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // the svg is drawn at its real pixel size, so labels stay 11px on a phone
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(wrapRef.current!);
    return () => observer.disconnect();
  }, []);

  const height = PLOT_HEIGHT + PAD.top + PAD.bottom;
  const plotWidth = Math.max(0, width - PAD.left - PAD.right);

  const x = (i: number) => PAD.left + (i / (values.length - 1)) * plotWidth;
  const y = (v: number) => PAD.top + (1 - v / max) * PLOT_HEIGHT;

  const path = useMemo(() => {
    if (!plotWidth) return "";
    return values
      .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join("");
  }, [values, plotWidth, max]);

  const yTicks: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) yTicks.push(v);

  // one tick per month, so the axis reads as calendar time rather than day count
  const xTicks = useMemo(
    () =>
      values
        .map((_, i) => i)
        .filter((i) => i > 0 && sonnetDate(i).getDate() === 1),
    [values.length],
  );

  const pick = (event: PointerEvent) => {
    if (!plotWidth) return;
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const ratio = (event.clientX - rect.left - PAD.left) / plotWidth;
    const i = Math.round(ratio * (values.length - 1));
    setActive(Math.min(values.length - 1, Math.max(0, i)));
  };

  return (
    <div class="my-6">
      <div class="text-sm font-bold pb-1">{title}</div>
      <div ref={wrapRef} class="relative">
        {width > 0 && (
          <svg
            width={width}
            height={height}
            class="block touch-pan-y"
            onPointerMove={pick}
            onPointerDown={pick}
            onPointerLeave={() => setActive(null)}
          >
            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={y(v)}
                  y2={y(v)}
                  class="stroke-stone-200"
                  stroke-width={1}
                />
                <text
                  x={PAD.left - 6}
                  y={y(v)}
                  text-anchor="end"
                  dominant-baseline="middle"
                  class="fill-stone-500 text-[11px] tabular-nums"
                >
                  {v}
                </text>
              </g>
            ))}

            {xTicks.map((i) => (
              <text
                key={i}
                x={x(i)}
                y={height - 6}
                text-anchor="middle"
                class="fill-stone-500 text-[11px]"
              >
                {monthFormat.format(sonnetDate(i))}
              </text>
            ))}

            {reference && (
              <g>
                <line
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={y(reference.value)}
                  y2={y(reference.value)}
                  class="stroke-orange-500"
                  stroke-width={1}
                  stroke-dasharray="4 3"
                />
                <text
                  x={width - PAD.right}
                  y={y(reference.value) - 5}
                  text-anchor="end"
                  class="fill-orange-600 text-[10px]"
                >
                  {reference.label}
                </text>
              </g>
            )}

            <path
              d={path}
              fill="none"
              class="stroke-sky-600"
              stroke-width={2}
              stroke-linejoin="round"
              stroke-linecap="round"
            />

            {active !== null && (
              <g>
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={PAD.top}
                  y2={PAD.top + PLOT_HEIGHT}
                  class="stroke-stone-400"
                  stroke-width={1}
                />
                {/* the ring keeps the dot legible wherever the line sits */}
                <circle
                  cx={x(active)}
                  cy={y(values[active])}
                  r={5}
                  class="fill-sky-600 stroke-white"
                  stroke-width={2}
                />
              </g>
            )}
          </svg>
        )}
        {!width && <div style={{ height }} />}

        {active !== null && (
          <div
            class="absolute top-0 -translate-x-1/2 pointer-events-none rounded bg-white px-2 py-1 text-[11px] leading-tight shadow ring-1 ring-stone-200 whitespace-nowrap"
            style={{
              left: `${Math.min(width - 50, Math.max(50, x(active)))}px`,
            }}
          >
            <div class="font-bold tabular-nums">
              {formatValue(values[active], format)}
            </div>
            <div class="text-stone-500 tabular-nums">
              Sonnet {active + 1} · {dayFormat.format(sonnetDate(active))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
