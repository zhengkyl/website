import { useMemo, useRef, useState } from "preact/hooks";
import noteblockUrl from "../assets/images/noteblock.png?url";

import "../styles/noteblock.css";

const BASE_MIDI = 66;

const MAJOR_OFFSET = [0, 2, 4, 5, 7, 9, 11];
const MINOR_OFFSET = [0, 2, 3, 5, 7, 8, 10];

function buildTriad(
  degree: number,
  root: number,
  offset: number[],
  chordOctave: number,
): number[] {
  const rootPos = (degree - 1) % 7;
  const thirdPos = (degree + 1) % 7;
  const fifthPos = (degree + 3) % 7;
  const base = root + chordOctave * 12;
  return [
    base + offset[rootPos],
    base + offset[thirdPos] + (thirdPos < rootPos ? 12 : 0),
    base + offset[fifthPos] + (fifthPos < rootPos ? 12 : 0),
  ];
}

function parseOnsetLine(line: string): boolean[] {
  const bars = line.split('"').slice(1, -1);
  const onsets: boolean[] = [];
  for (const bar of bars) {
    for (const ch of bar) {
      onsets.push(ch !== " ");
    }
  }
  return onsets;
}

function parseChordLine(
  line: string,
  root: number,
  offset: number[],
  chordOctave: number,
): (number[] | null)[] {
  const bars = line.split("!").slice(1, -1);
  const chords: (number[] | null)[] = [];
  for (const bar of bars) {
    for (const ch of bar) {
      const d = parseInt(ch);
      chords.push(
        d >= 1 && d <= 7 ? buildTriad(d, root, offset, chordOctave) : null,
      );
    }
  }
  return chords;
}

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
  chords: (number[] | null)[];
  onsets: boolean[];
  words: string[][][];
  secPerSlot: number;
} {
  const rawLines = text.split("\n").filter((l) => !l.startsWith("//"));
  while (!rawLines[0]) rawLines.shift();

  const [rootStr, scaleStr, bpmStr, chordOctaveStr] = rawLines[0].split(" ");
  const root = parseInt(rootStr);
  const bpm = parseInt(bpmStr);
  const offset = scaleStr === "major" ? MAJOR_OFFSET : MINOR_OFFSET;
  const secPerSlot = 60 / bpm / 2;
  const chordOctave = chordOctaveStr ? parseInt(chordOctaveStr) : 0;

  const sections = new Map<
    string,
    {
      notes: (number | null)[];
      chords: (number[] | null)[];
      onsets: boolean[];
      words: string[][];
    }
  >();
  const result: (number | null)[] = [];
  const resultChords: (number[] | null)[] = [];
  const resultOnsets: boolean[] = [];
  const resultWords: string[][][] = [];
  let directWords: string[][] = [];

  const flushDirect = () => {
    if (directWords.length > 0) {
      resultWords.push(directWords);
      directWords = [];
    }
  };
  let currentSection: string | null = null;
  let currentNotes: (number | null)[] = [];
  let currentChords: (number[] | null)[] = [];
  let currentOnsets: boolean[] = [];
  let currentWords: string[][] = [];

  const flush = () => {
    if (currentSection == null) return;
    sections.set(currentSection, {
      notes: currentNotes,
      chords: currentChords,
      onsets: currentOnsets,
      words: currentWords,
    });
    currentSection = null;
    currentNotes = [];
    currentChords = [];
    currentOnsets = [];
    currentWords = [];
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

    if (line.startsWith("|")) {
      const notes = parseLine(line, root, offset);
      let chords: (number[] | null)[];
      let onsets: boolean[];

      let j = i + 1;
      const next1 = rawLines[j]?.trim();
      if (next1?.startsWith("!")) {
        chords = parseChordLine(next1, root, offset, chordOctave);
        j++;
        const next2 = rawLines[j]?.trim();
        if (next2?.startsWith('"')) {
          onsets = parseOnsetLine(next2);
          j++;
        } else {
          onsets = new Array(notes.length).fill(false);
        }
      } else if (next1?.startsWith('"')) {
        chords = new Array(notes.length).fill(null);
        onsets = parseOnsetLine(next1);
        j++;
      } else {
        chords = new Array(notes.length).fill(null);
        onsets = new Array(notes.length).fill(false);
      }
      i = j - 1;

      if (currentSection) {
        currentNotes.push(...notes);
        currentChords.push(...chords);
        currentOnsets.push(...onsets);
      } else {
        result.push(...notes);
        resultChords.push(...chords);
        resultOnsets.push(...onsets);
      }
    } else if (line.startsWith(">")) {
      const words = line.slice(1).trim().split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        if (currentSection) currentWords.push(words);
        else directWords.push(words);
      }
    } else {
      const section = sections.get(line)!;
      if (currentSection) {
        currentNotes.push(...section.notes);
        currentChords.push(...section.chords);
        currentOnsets.push(...section.onsets);
      } else {
        result.push(...section.notes);
        resultChords.push(...section.chords);
        resultOnsets.push(...section.onsets);
        if (section.words.length > 0) {
          flushDirect();
          resultWords.push(section.words);
        }
      }
    }
  }

  flush();
  flushDirect();
  return {
    notes: result,
    chords: resultChords,
    onsets: resultOnsets,
    words: resultWords,
    secPerSlot,
  };
}

const CUBE_COLORS = [
  "#94C100",
  "#59E800",
  "#1FFC00",
  "#00FC21",
  "#00E958",
  "#00C68D",
  "#009ABC",
  "#0068E0",
  "#0037F6",
  "#020AFE",
  "#2D00F9",
  "#5B00E7",
  "#8600CC",
  "#AE00A9",
  "#CF0083",
  "#E8005A",
  "#F70033",
  "#FE000F",
  "#FC1E00",
  "#F34100",
  "#E26500",
  "#CC8600",
  "#B2A500",
  "#95C000",
  "#77D700",
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

function scheduleNote(
  ctx: AudioContext,
  buffer: AudioBuffer,
  midi: number,
  destination: AudioNode,
  t: number,
) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.detune.value = (midi - BASE_MIDI) * 100;
  src.connect(destination);
  src.start(t);
  scheduledNodes.push(src);
}

function scheduleFrom(
  ctx: AudioContext,
  buffer: AudioBuffer,
  notes: (number | null)[],
  chords: (number[] | null)[],
  secPerSlot: number,
  fromSlot: number,
): number {
  for (const n of scheduledNodes)
    try {
      n.stop();
    } catch {}
  scheduledNodes = [];
  const chordGain = ctx.createGain();
  chordGain.gain.value = 0.4;
  chordGain.connect(ctx.destination);
  const t0 = ctx.currentTime + 0.05;
  for (let i = fromSlot; i < notes.length; i++) {
    const t = t0 + (i - fromSlot) * secPerSlot;
    const midi = notes[i];
    if (midi != null) scheduleNote(ctx, buffer, midi, ctx.destination, t);
    const chord = chords[i];
    if (chord != null) {
      for (const note of chord) scheduleNote(ctx, buffer, note, chordGain, t);
    }
  }
  return t0 - fromSlot * secPerSlot;
}

const cachedBuffers = new Map<string, AudioBuffer>();
let activeCtx: AudioContext | null = null;

export function Noteblocks({
  songText,
  harpUrl,
}: {
  songText: string;
  harpUrl: string;
}) {
  const song = useMemo(() => parseSong(songText), []);

  const [playState, setPlayState] = useState<"idle" | "playing" | "paused">(
    "idle",
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const scrubberRef = useRef<HTMLInputElement>(null);
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastSlotRef = useRef(-1);
  const particlesRef = useRef<Set<HTMLElement>>(new Set());
  const wordIndexRef = useRef(-1);
  const wordElsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const stop = () => {
    clearTimeout(startDelayRef.current!);
    clearTimeout(timeoutRef.current!);
    cancelAnimationFrame(rafRef.current!);
    scheduledNodes = [];
    activeCtx?.close();
    activeCtx = null;
    scrubberRef.current!.value = "0";
    lastSlotRef.current = -1;
    for (const el of particlesRef.current) el.remove();
    particlesRef.current.clear();
    wordElsRef.current[wordIndexRef.current]?.classList.remove("nb-active");
    wordIndexRef.current = -1;
    setPlayState("idle");
  };

  const animateMidi = (midi: number) => {
    const idx = BASE_MIDI + 12 - midi;
    const el = idx >= 0 && idx <= 24 ? cubeRefs.current[idx] : null;
    if (!el) return;
    el.classList.remove("nb-bounce");
    void el.offsetWidth;
    el.classList.add("nb-bounce");
    const noteEl = document.createElement("span");
    noteEl.textContent = "♪";
    noteEl.style.cssText = `position:fixed;right:4.5vh;top:calc(${idx * 4}vh + 1vh);color:${CUBE_COLORS[idx]};font-size:1.5vh;line-height:1;pointer-events:none;z-index:9999;animation:nb-note 0.8s ease-out forwards`;
    particlesRef.current.add(noteEl);
    document.body.appendChild(noteEl);
    noteEl.addEventListener("animationend", () => {
      particlesRef.current.delete(noteEl);
      noteEl.remove();
    });
  };

  const tick = () => {
    const { notes, chords, onsets, secPerSlot } = song;
    const elapsed = activeCtx!.currentTime - startTimeRef.current;
    const slot = Math.floor(elapsed / secPerSlot);

    if (slot !== lastSlotRef.current) {
      lastSlotRef.current = slot;
      if (slot >= 0 && slot < notes.length) {
        const midi = notes[slot];
        if (midi !== null) animateMidi(midi);
        const chord = chords[slot];
        if (chord !== null) {
          for (const note of chord) animateMidi(note);
        }
        if (onsets[slot]) {
          const prev = wordIndexRef.current;
          const next = prev + 1;
          if (prev >= 0)
            wordElsRef.current[prev]?.classList.remove("nb-active");
          wordElsRef.current[next]?.classList.add("nb-active");
          wordIndexRef.current = next;
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
    const total = song.notes.length * song.secPerSlot;
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
      if (!cachedBuffers.has(harpUrl)) {
        const res = await fetch(harpUrl);
        cachedBuffers.set(
          harpUrl,
          await ctx.decodeAudioData(await res.arrayBuffer()),
        );
      }
      const cachedBuffer = cachedBuffers.get(harpUrl)!;
      startDelayRef.current = setTimeout(() => {
        const fraction = parseFloat(scrubberRef.current!.value);
        const fromSlot = Math.floor(fraction * song.notes.length);
        lastSlotRef.current = fromSlot - 1;
        startTimeRef.current = scheduleFrom(
          ctx,
          cachedBuffer!,
          song.notes,
          song.chords,
          song.secPerSlot,
          fromSlot,
        );
        const remaining = (1 - fraction) * song.notes.length * song.secPerSlot;
        timeoutRef.current = setTimeout(stop, remaining * 1000 + 500);
        rafRef.current = requestAnimationFrame(tick);
      }, 400);
    } catch {
      stop();
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          perspective: "1500px",
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
            transform:
              playState === "idle" ? "translateX(150%)" : "translateX(0)",
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                cubeRefs.current[i] = el;
              }}
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
            const { notes, chords, onsets, secPerSlot } = song;
            const fromSlot = Math.floor(fraction * notes.length);
            lastSlotRef.current = fromSlot - 1;
            const newWordIdx =
              onsets.slice(0, fromSlot).filter(Boolean).length - 1;
            wordElsRef.current[wordIndexRef.current]?.classList.remove(
              "nb-active",
            );
            if (newWordIdx >= 0)
              wordElsRef.current[newWordIdx]?.classList.add("nb-active");
            wordIndexRef.current = newWordIdx;
            if (playState === "idle") return;
            startTimeRef.current = scheduleFrom(
              activeCtx!,
              cachedBuffers.get(harpUrl)!,
              notes,
              chords,
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
      {song.words.length > 0 &&
        (() => {
          let flatIdx = 0;
          return song.words.map((section, si) => (
            <p key={si}>
              {section.flatMap((line, li) => [
                ...(li > 0 ? [<br key={`br${li}`} />] : []),
                ...line.map((word) => {
                  const i = flatIdx++;
                  return (
                    <span
                      key={i}
                      ref={(el) => {
                        wordElsRef.current[i] = el;
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }),
              ])}
            </p>
          ));
        })()}
    </>
  );
}
