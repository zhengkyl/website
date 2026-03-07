import { useRef, useState } from "preact/hooks";
import noteblockUrl from "../assets/images/noteblock.png?url";
import songText from "../assets/sounds/creeper-but-psycho.txt?raw";
import harpUrl from "../assets/sounds/harp.ogg?url";

const BASE_MIDI = 66;

const MAJOR_OFFSET = [0, 2, 4, 5, 7, 9, 11];
const MINOR_OFFSET = [0, 2, 3, 5, 7, 8, 10];

function parseLine(line: string, root: number, offset: number[]) {
  const bars = line.split("|").slice(1, -1);
  const notes: (number | null)[] = [];
  for (const bar of bars) {
    for (const ch of bar) {
      const d = parseInt(ch);
      let note = null;
      if (d >= 1 && d <= 7) {
        note = root + offset[d - 1];
      } else if (ch >= "a" && ch <= "g") {
        note = root + offset[ch.charCodeAt(0) - 97] - 12;
      } else if (ch >= "A" && ch <= "G") {
        note = root + offset[ch.charCodeAt(0) - 65] + 12;
      }
      notes.push(note);
    }
  }
  return notes;
}

function parseSong(text: string): {
  notes: (number | null)[];
  secPerSlot: number;
} {
  const rawLines = text.split("\n").filter((l) => !l.startsWith("//"));
  while (!rawLines[0]) rawLines.shift();

  const [rootStr, scaleStr, bpmStr] = rawLines[0].split(" ");
  const root = parseInt(rootStr);
  const bpm = parseInt(bpmStr);
  const offset = scaleStr === "major" ? MAJOR_OFFSET : MINOR_OFFSET;
  const secPerSlot = 60 / bpm / 2;

  const sections = new Map<string, (number | null)[]>();
  const result: (number | null)[] = [];
  let currentSection: string | null = null;
  let currentNotes: (number | null)[] = [];

  const flush = () => {
    if (currentSection == null) return;
    sections.set(currentSection, currentNotes);
    currentSection = null;
    currentNotes = [];
  };

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flush();
      continue;
    }

    if (line.startsWith(":")) {
      flush();
      currentSection = line.slice(1);
      continue;
    }

    const notes = line.startsWith("|")
      ? parseLine(line, root, offset)
      : sections.get(line)!;

    if (currentSection) {
      currentNotes.push(...notes);
    } else {
      result.push(...notes);
    }
  }

  return { notes: result, secPerSlot };
}

const CUBE_COLORS = [
  "#94C100", "#59E800", "#1FFC00", "#00FC21", "#00E958",
  "#00C68D", "#009ABC", "#0068E0", "#0037F6", "#020AFE",
  "#2D00F9", "#5B00E7", "#8600CC", "#AE00A9", "#CF0083",
  "#E8005A", "#F70033", "#FE000F", "#FC1E00", "#F34100",
  "#E26500", "#CC8600", "#B2A500", "#95C000", "#77D700",
];

function Cube({
  showTop,
  showBottom,
}: {
  showTop?: boolean;
  showBottom?: boolean;
}) {
  const face = {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: `url(${noteblockUrl})`,
    backgroundSize: "100% 100%",
    imageRendering: "pixelated" as const,
  };
  return (
    <div
      style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
    >
      <div style={{ ...face, transform: "translateZ(2vh)" }} />
      <div style={{ ...face, transform: "rotateY(-90deg) translateZ(2vh)" }} />
      {showTop && (
        <div style={{ ...face, transform: "rotateX(90deg) translateZ(2vh)" }} />
      )}
      {showBottom && (
        <div
          style={{ ...face, transform: "rotateX(-90deg) translateZ(2vh)" }}
        />
      )}
    </div>
  );
}

let scheduledNodes: AudioBufferSourceNode[] = [];

function scheduleFrom(
  ctx: AudioContext,
  buffer: AudioBuffer,
  notes: (number | null)[],
  secPerSlot: number,
  fromSlot: number,
): number {
  for (const n of scheduledNodes)
    try {
      n.stop();
    } catch {}
  scheduledNodes = [];
  const t0 = ctx.currentTime + 0.05;
  for (let i = fromSlot; i < notes.length; i++) {
    const midi = notes[i];
    if (midi == null) continue;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.detune.value = (midi - BASE_MIDI) * 100;
    src.connect(ctx.destination);
    src.start(t0 + (i - fromSlot) * secPerSlot);
    scheduledNodes.push(src);
  }
  return t0 - fromSlot * secPerSlot;
}

let cachedBuffer: AudioBuffer | null = null;
let cachedSong: { notes: (number | null)[]; secPerSlot: number } | null = null;
let activeCtx: AudioContext | null = null;

export function Noteblocks() {
  const [playState, setPlayState] = useState<"idle" | "playing" | "paused">(
    "idle",
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const scrubberRef = useRef<HTMLInputElement>(null);
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastSlotRef = useRef(-1);

  const stop = () => {
    clearTimeout(timeoutRef.current!);
    cancelAnimationFrame(rafRef.current!);
    scheduledNodes = [];
    activeCtx?.close();
    activeCtx = null;
    scrubberRef.current!.value = "0";
    lastSlotRef.current = -1;
    setPlayState("idle");
  };

  const tick = () => {
    const { notes, secPerSlot } = cachedSong!;
    const elapsed = activeCtx!.currentTime - startTimeRef.current;
    const slot = Math.floor(elapsed / secPerSlot);

    if (slot !== lastSlotRef.current) {
      lastSlotRef.current = slot;
      if (slot >= 0 && slot < notes.length) {
        const midi = notes[slot];
        if (midi !== null) {
          const idx = BASE_MIDI + 12 - midi;
          if (idx >= 0 && idx <= 24) {
            const el = cubeRefs.current[idx];
            if (el) {
              el.classList.remove("nb-bounce");
              void el.offsetWidth;
              el.classList.add("nb-bounce");

              const noteEl = document.createElement("span");
              noteEl.textContent = "♪";
              noteEl.style.cssText = `
                position:fixed;
                right:4.5vh;
                top:calc(${idx * 4}vh + 1vh);
                color:${CUBE_COLORS[idx]};
                font-size:1.5vh;
                line-height:1;
                pointer-events:none;
                z-index:9999;
                animation:nb-note 0.8s ease-out forwards;
              `;
              document.body.appendChild(noteEl);
              noteEl.addEventListener("animationend", () => noteEl.remove());
            }
          }
        }
      }
    }

    const total = notes.length * secPerSlot;
    const p = Math.min(Math.max(elapsed / total, 0), 1);
    scrubberRef.current!.value = String(p);
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    activeCtx!.suspend();
    clearTimeout(timeoutRef.current!);
    cancelAnimationFrame(rafRef.current!);
    setPlayState("paused");
  };

  const resume = () => {
    const total = cachedSong!.notes.length * cachedSong!.secPerSlot;
    const remaining = total - (activeCtx!.currentTime - startTimeRef.current);
    activeCtx!.resume();
    timeoutRef.current = setTimeout(stop, remaining * 1000 + 500);
    rafRef.current = requestAnimationFrame(tick);
    setPlayState("playing");
  };

  const handleClick = async () => {
    if (playState === "playing") {
      pause();
      return;
    }
    if (playState === "paused") {
      resume();
      return;
    }

    setPlayState("playing");
    activeCtx = new AudioContext();
    const ctx = activeCtx;

    try {
      if (!cachedSong) cachedSong = parseSong(songText);
      if (!cachedBuffer) {
        const res = await fetch(harpUrl);
        cachedBuffer = await ctx.decodeAudioData(await res.arrayBuffer());
      }
      startTimeRef.current = scheduleFrom(
        ctx,
        cachedBuffer,
        cachedSong.notes,
        cachedSong.secPerSlot,
        0,
      );
      const duration = cachedSong.notes.length * cachedSong.secPerSlot;
      timeoutRef.current = setTimeout(stop, duration * 1000 + 500);
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      stop();
    }
  };

  return (
    <>
      <style>{`
        @keyframes nb-bounce {
          0%   { transform: translateX(0) scale(1); }
          30%  { transform: translateX(-15%) scale(1.15); }
          100% { transform: translateX(0) scale(1); }
        }
        .nb-bounce { animation: nb-bounce 0.25s ease-out; }
        @keyframes nb-note {
          0%   { opacity: 1; transform: translate(0, 0); }
          100% { opacity: 0; transform: translate(-4vh, -1vh); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          perspective: "1500px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "4vh",
            transformStyle: "preserve-3d",
            transform: playState === "idle" ? "translateX(100%)" : "translateX(0)",
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              ref={(el) => { cubeRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top: `${i * 4}vh`,
                left: 0,
                width: "4vh",
                height: "4vh",
                transformStyle: "preserve-3d",
              }}
            >
              <Cube showBottom={i < 12} showTop={i > 12} />
            </div>
          ))}
        </div>
      </div>
      <div class="flex gap-2">
        <button
          onClick={handleClick}
          aria-label={
            { idle: "Play", playing: "Pause", paused: "Resume" }[playState]
          }
        >
          <svg viewBox="0 0 24 24" class="size-4">
            {playState === "playing" ? (
              <path fill="currentColor" d="M4 0h6v24h-6zM14 0h6v24h-6z" />
            ) : (
              <path fill="currentColor" d="M4 0L24 12L4 24z" />
            )}
          </svg>
        </button>
        <input
          class="flex-1"
          type="range"
          ref={scrubberRef}
          min="0"
          max="1"
          step="0.001"
          defaultValue="0"
          onPointerDown={() => {
            lastSlotRef.current = -1;
            if (playState === "playing") {
              cancelAnimationFrame(rafRef.current!);
              for (const n of scheduledNodes)
                try {
                  n.stop();
                } catch {}
              scheduledNodes = [];
              clearTimeout(timeoutRef.current!);
            }
          }}
          onChange={(e) => {
            const fraction = parseFloat(e.currentTarget.value);
            if (playState === "idle") return;
            const { notes, secPerSlot } = cachedSong!;
            const fromSlot = Math.floor(fraction * notes.length);
            startTimeRef.current = scheduleFrom(
              activeCtx!,
              cachedBuffer!,
              notes,
              secPerSlot,
              fromSlot,
            );
            if (playState === "playing") {
              const remaining = (1 - fraction) * notes.length * secPerSlot;
              timeoutRef.current = setTimeout(stop, remaining * 1000 + 500);
              rafRef.current = requestAnimationFrame(tick);
            }
          }}
        />
      </div>
    </>
  );
}
