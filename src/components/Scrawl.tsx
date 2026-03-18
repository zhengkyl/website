import { useEffect, useMemo, useRef, useState } from "preact/hooks";

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

  for (const pt of points) {
    if (pt.t > t) break;
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
    ctx.arc(strokeX, strokeY, 1, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

export default function Scrawl({ data, width, height }: Props) {
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 0",
        }}
      >
        <button onClick={handlePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="1"
          step="0.001"
          defaultValue="1"
          onInput={handleScrub}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}
