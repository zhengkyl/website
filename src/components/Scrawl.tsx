import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CloseIcon, PauseIcon, PlayIcon } from "./icons/controls";

interface AbsPoint {
  x: number;
  y: number;
  t: number;
  strokeStart: boolean;
}

type Props = {
  data: string;
  width: number;
  height: number;
  text?: string;
};

function parseScrawl(data: string): AbsPoint[] {
  const points: AbsPoint[] = [];
  let gx = 0,
    gy = 0,
    gt = 0;

  for (const rawLine of data.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let isFirstInStroke = true;

    for (const seg of line.split(";")) {
      const parts = seg.split(",");
      if (parts.length !== 3) continue;
      const dx = parseInt(parts[0], 10);
      const dy = parseInt(parts[1], 10);
      const dt = parseInt(parts[2], 10);
      gx += dx;
      gy += dy;
      gt += dt;
      points.push({ x: gx, y: gy, t: gt, strokeStart: isFirstInStroke });
      isFirstInStroke = false;
    }
  }

  return points;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// jagged outline in objectBoundingBox units (0..1) for an svg clipPath
function makeTornPath(seed: number): string {
  const rand = mulberry32(seed);
  const STEPS = 12; // tear points per edge
  const AMP = 0.015; // inward tear depth as a fraction of the edge
  type Pt = [number, number];
  const edges: ((t: number, j: number) => Pt)[] = [
    (t, j) => [t, j], // top, left to right
    (t, j) => [1 - j, t], // right, top to bottom
    (t, j) => [1 - t, 1 - j], // bottom, right to left
    (t, j) => [j, 1 - t], // left, bottom to top
  ];
  const pts: Pt[] = [];
  for (const edge of edges) {
    for (let i = 0; i < STEPS; i++) {
      const t = i === 0 ? 0 : (i + (rand() - 0.5) * 0.6) / STEPS;
      pts.push(edge(t, rand() * AMP));
    }
  }
  return `M${pts.map(([x, y]) => `${x.toFixed(4)} ${y.toFixed(4)}`).join("L")}Z`;
}

const TORN_PATHS = [1, 2, 3, 4].map((seed) => makeTornPath(seed));

const tornClipId = (variant: number) => `scrawl-torn-${variant}`;
const paperFilterId = (variant: number) => `scrawl-paper-${variant}`;

// shared defs for every Scrawl on the page; must be rendered exactly once
// alongside them (ScrawlGallery does)
export function ScrawlDefs() {
  return (
    <svg class="absolute size-0" aria-hidden="true">
      <defs>
        {TORN_PATHS.map((d, variant) => (
          <clipPath
            key={variant}
            id={tornClipId(variant)}
            clipPathUnits="objectBoundingBox"
          >
            <path d={d} />
          </clipPath>
        ))}
        {TORN_PATHS.map((_, variant) => (
          <filter key={variant} id={paperFilterId(variant)}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed={variant + 1}
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lighting-color="#ffe7ba"
              surfaceScale="1"
              result="paper"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feComposite in="paper" in2="SourceAlpha" operator="in" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

function drawUpTo(
  ctx: CanvasRenderingContext2D,
  points: AbsPoint[],
  t: number,
  offset: { dx: number; dy: number },
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.translate(offset.dx, offset.dy);
  ctx.strokeStyle = "#210c00";
  ctx.fillStyle = "#210c00";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  let strokeX = 0,
    strokeY = 0;
  let isSinglePoint = false;

  let nextUndrawnIndex = points.length;
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (pt.t > t) {
      nextUndrawnIndex = i;
      break;
    }
    if (pt.strokeStart) {
      if (isSinglePoint) {
        ctx.arc(strokeX, strokeY, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
      } else {
        ctx.stroke();
        ctx.beginPath();
      }
      ctx.moveTo(pt.x, pt.y);
      strokeX = pt.x;
      strokeY = pt.y;
      isSinglePoint = true;
    } else {
      ctx.lineTo(pt.x, pt.y);
      isSinglePoint = false;
    }
  }

  if (isSinglePoint) {
    const nextPt = points[nextUndrawnIndex];
    if (!nextPt || nextPt.strokeStart) {
      ctx.arc(strokeX, strokeY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.stroke();
  }
  ctx.restore();
}

export function Scrawl({ data, width, height, text }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const points = useMemo(() => parseScrawl(data), [data]);
  const totalTime = points.at(-1)?.t ?? 0;

  // size the canvas tight against the ink's bounding box, plus padding
  const PAD = 40;
  const { canvasWidth, canvasHeight, offset } = useMemo(() => {
    if (points.length === 0) {
      return {
        canvasWidth: width,
        canvasHeight: height,
        offset: { dx: 0, dy: 0 },
      };
    }
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const pt of points) {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    }
    return {
      canvasWidth: maxX - minX + PAD * 2,
      canvasHeight: maxY - minY + PAD * 2,
      offset: { dx: PAD - minX, dy: PAD - minY },
    };
  }, [points]);

  // display the parchment at the same scale as the full recording surface,
  // shrinking only if the padded ink box outgrows the slot
  const scale = Math.min(1, width / canvasWidth, height / canvasHeight);
  const widthPct = (canvasWidth / width) * scale * 100;

  const variant = data.length % TORN_PATHS.length;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    drawUpTo(ctx, points, totalTime, offset);
    currentTimeRef.current = totalTime;
    inputRef.current!.value = "1";

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      cancelAnimationFrame(animRef.current);
      setIsPlaying(false);
      return;
    }

    if (currentTimeRef.current >= totalTime) {
      currentTimeRef.current = 0;
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const startWallTime = performance.now();
    const startScrawlTime = currentTimeRef.current;
    setIsPlaying(true);

    const loop = (now: number) => {
      let t = startScrawlTime + (now - startWallTime);
      const done = t >= totalTime;
      if (done) t = totalTime;

      currentTimeRef.current = t;
      if (inputRef.current) inputRef.current.value = String(t / totalTime);
      drawUpTo(ctx, points, t, offset);

      if (done) {
        setIsPlaying(false);
        return;
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  };

  const handleScrub = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (isPlaying) {
      cancelAnimationFrame(animRef.current);
      setIsPlaying(false);
    }
    const t = parseFloat(target.value) * totalTime;
    currentTimeRef.current = t;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    drawUpTo(ctx, points, t, offset);
  };

  return (
    <div>
      <div
        class="flex items-center justify-center"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <div
          class="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          style={{ width: `${widthPct}%` }}
        >
          <div
            class="absolute inset-0 bg-[#ffe7ba]"
            style={{
              clipPath: `url(#${tornClipId(variant)})`,
              filter: `url(#${paperFilterId(variant)})`,
            }}
          />
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            class="relative block w-full h-auto shadow-[inset_0_0_32px_rgba(146,103,40,0.18)]"
            style={{ clipPath: `url(#${tornClipId(variant)})` }}
          />
        </div>
      </div>
      <div
        class="flex items-center gap-2 p-2 pt-0 cursor-default"
        onClick={(e) => e.stopImmediatePropagation()}
      >
        <button onClick={handlePlay}>
          {isPlaying ? (
            <PauseIcon class="size-4" />
          ) : (
            <PlayIcon class="size-4" />
          )}
        </button>
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="1"
          step="0.001"
          defaultValue="1"
          onInput={handleScrub}
          class="flex-1 min-w-0"
        />
      </div>
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDuration(ms: number): string {
  // nearest 10s
  const s = Math.round(ms / 10000) * 10;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m === 0) return `~${rem}s`;
  if (rem === 0) return `~${m}m`;
  return `~${m}m ${rem}s`;
}

function formatWpm(text: string, ms: number) {
  return (
    Math.round((text.replace(/\s/g, "").length / 5 / (ms / 60000)) * 10) / 10
  );
}

type Sonnet = { scrawlUrl: string; text: string };

const HIGHLIGHTED_SONNETS = [18, 29, 42] as const;

type ScrawlContextValue = {
  sonnets: Sonnet[];
  width: number;
  height: number;
  loaded: boolean[];
  durations: (number | null)[];
  dataRef: { current: string[] };
  setActiveIndex: (i: number | null) => void;
  notifyLoaded: (i: number, data: string, duration: number) => void;
};

const ScrawlContext = createContext<ScrawlContextValue>(null as any);

function ScrawlGridSection({
  sonnets,
  offset,
}: {
  sonnets: Sonnet[];
  offset: number;
}) {
  const {
    loaded,
    durations,
    dataRef,
    setActiveIndex,
    notifyLoaded,
    width,
    height,
  } = useContext(ScrawlContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const localI = Number((entry.target as HTMLElement).dataset.index);
          const globalI = offset + localI;
          if (dataRef.current[globalI]) continue;
          observer.unobserve(entry.target);

          fetch(sonnets[localI].scrawlUrl)
            .then((r) => r.text())
            .then((data) => {
              const duration = parseScrawl(data).at(-1)?.t ?? 0;
              notifyLoaded(globalI, data, duration);
            });
        }
      },
      { rootMargin: "400px" },
    );

    for (const el of containerRef.current!.children) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      class="w-screen max-w-1536px ml-[calc(50%-min(768px,50vw))] grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
    >
      {sonnets.map((sonnet, localI) => {
        const globalI = offset + localI;
        const highlighted = (HIGHLIGHTED_SONNETS as readonly number[]).includes(
          globalI + 1,
        );
        return (
          <div
            key={sonnet.scrawlUrl}
            data-index={localI}
            onClick={() => setActiveIndex(globalI)}
            class={`@hover:shadow-[0_0_4px_0px_rgba(0,0,0,0.2)] cursor-pointer${highlighted ? " bg-orange-100/50" : ""}`}
          >
            <div class="p-4 pb-0">
              <div class="text-xs leading-none text-gray-500">
                {dateFormat.format(new Date(2026, 2, 17 + globalI))}
              </div>
              <div class="flex justify-between items-baseline">
                <div class="font-bold">Sonnet {globalI + 1}</div>
                {durations[globalI] != null && (
                  <span class="text-xs text-gray-500">
                    {formatWpm(sonnet.text, durations[globalI]!)} wpm
                  </span>
                )}
              </div>
            </div>
            {loaded[globalI] ? (
              <Scrawl
                data={dataRef.current[globalI]}
                width={width}
                height={height + (globalI >= 28 ? 100 : 0)}
              />
            ) : (
              <div style={{ aspectRatio: `${width}/${height}` }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ScrawlGallery({
  sonnets,
  width,
  height,
}: {
  sonnets: Sonnet[];
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    sonnets.map(() => false),
  );
  const [durations, setDurations] = useState<(number | null)[]>(() =>
    sonnets.map(() => null),
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dataRef = useRef<string[]>(new Array(sonnets.length).fill(""));
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (activeIndex !== null) {
      dialogRef.current!.showModal();
    } else {
      dialogRef.current!.close();
    }
  }, [activeIndex]);

  const notifyLoaded = (i: number, data: string, duration: number) => {
    dataRef.current[i] = data;
    setDurations((prev) => {
      const next = [...prev];
      next[i] = duration;
      return next;
    });
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  return (
    <ScrawlContext.Provider
      value={{
        sonnets,
        width,
        height,
        loaded,
        durations,
        dataRef,
        setActiveIndex,
        notifyLoaded,
      }}
    >
      <ScrawlDefs />
      <dialog
        ref={dialogRef}
        onClose={() => setActiveIndex(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setActiveIndex(null);
        }}
        class="max-w-screen-xl w-full backdrop:bg-black/50"
      >
        {activeIndex !== null && (
          <div class="p-4">
            <div class="pl-2 flex justify-between items-baseline">
              <div>
                <div class="text-xs leading-none text-gray-500">
                  {dateFormat.format(new Date(2026, 2, 17 + activeIndex))}
                </div>
                <h2 class="font-bold">Sonnet {activeIndex + 1}</h2>
              </div>
              <button onClick={() => setActiveIndex(null)} class="p-2">
                <CloseIcon class="size-4" />
              </button>
            </div>
            <div class="grid md:grid-cols-2">
              <Scrawl
                data={dataRef.current[activeIndex]}
                width={width}
                height={height + (activeIndex >= 28 ? 100 : 0)}
                text={sonnets[activeIndex].text}
              />
              <pre class="text-xs/6 font-serif whitespace-pre-wrap tab-4 mx-auto">
                {sonnets[activeIndex].text}
              </pre>
              <div class="flex justify-center gap-2 text-sm text-gray-500">
                <div>{formatDuration(durations[activeIndex]!)}</div>
                <div>
                  {durations[activeIndex] != null &&
                    formatWpm(
                      sonnets[activeIndex].text,
                      durations[activeIndex]!,
                    )}{" "}
                  wpm
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
      <ScrawlGridSection sonnets={sonnets.slice(0, 28)} offset={0} />
      <p class="my-4">At this point I stopped using lined "paper".</p>
      <ScrawlGridSection sonnets={sonnets.slice(28)} offset={28} />
    </ScrawlContext.Provider>
  );
}
