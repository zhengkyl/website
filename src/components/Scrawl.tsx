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

function drawUpTo(
  ctx: CanvasRenderingContext2D,
  points: AbsPoint[],
  t: number,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
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
}

export function Scrawl({ data, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const points = useMemo(() => parseScrawl(data), [data]);
  const totalTime = points.at(-1)?.t ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    drawUpTo(ctx, points, totalTime);
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
      drawUpTo(ctx, points, t);

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
    drawUpTo(ctx, points, t);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
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

const HIGHLIGHTED_SONNETS = [18, 29] as const;

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
      class="w-screen max-w-1536px ml-[calc(50%-min(768px,50vw))] grid sm:grid-cols-2 lg:grid-cols-4 p-4"
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
                    {Math.round(
                      (sonnet.text.replace(/\s/g, "").length /
                        5 /
                        (durations[globalI]! / 60000)) *
                        10,
                    ) / 10}{" "}
                    wpm
                  </span>
                )}
              </div>
            </div>
            {loaded[globalI] ? (
              <Scrawl
                data={dataRef.current[globalI]}
                width={width}
                height={height + (globalI >= 28 ? 50 : 0)}
              />
            ) : (
              <div
                class="bg-gray-100"
                style={{ aspectRatio: `${width}/${height}` }}
              />
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
                height={height + (activeIndex >= 28 ? 50 : 0)}
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
