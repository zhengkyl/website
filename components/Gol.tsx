"use client"
import { useRef, useState, useEffect } from "react";
import { Play, Pause, Trash2, Shuffle } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

function newBoard(width, height) {
  return Array.from(Array(width), () => Array(height).fill(false));
}

function randomize(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      board[i][j] = Math.random() > 0.8 ? true : false;
    }
  }
  return board;
}

function nextBoard(prevBoard) {
  const width = prevBoard.length;
  const height = prevBoard[0].length;
  const board = newBoard(width, height);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let neighbors = 0;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx == 0 && dy == 0) continue;

          const nx = (i + dx + width) % width;
          const ny = (j + dy + height) % height;

          if (prevBoard[nx][ny]) {
            neighbors++;
          }
        }
      }

      if (neighbors == 3) {
        board[i][j] = true;
      } else if (prevBoard[i][j] && neighbors == 2) {
        board[i][j] = true;
      }
    }
  }

  return board;
}

function Button(props) {
  const { className, ...rest } = props;
  return <button className={`border p-2 ${className}`} {...rest} />;
}

export function Gol({ width, height, children }) {
  const bigScreen = useMediaQuery("(min-width: 1024px)");
  const [showControls, setShowControls] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestFrame = useRef<number>();
  const prevTime = useRef(0);
  const spawning = useRef(false);
  const color = useRef("#fda4af80");

  const [playing, setPlaying] = useState(true);

  const cells = useRef(nextBoard(randomize(newBoard(width, height))));

  const iterate = () => {
    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.fillStyle = color.current;
    for (let i = 0; i < cells.current.length; i++) {
      for (let j = 0; j < cells.current[0].length; j++) {
        if (cells.current[i][j]) {
          ctx.fillRect(i, j, 1, 1);
        } else {
          ctx.clearRect(i, j, 1, 1);
        }
      }
    }
    cells.current = nextBoard(cells.current);
  };

  const frame = (time) => {
    const elapsed = time - prevTime.current;
    if (elapsed >= 200) {
      prevTime.current = time;
      iterate();
    }
    requestFrame.current = requestAnimationFrame(frame);
  };

  useEffect(() => {
    requestFrame.current = requestAnimationFrame(frame);
    setShowControls(true)
    return () => cancelAnimationFrame(requestFrame.current!);
  }, []);

  const spawn = (e) => {
    if (!spawning.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();

    const xFrac = (e.clientX - rect.left) / canvasRef.current!.clientWidth;
    const yFrac = (e.clientY - rect.top) / canvasRef.current!.clientHeight;

    if (xFrac >= 1 || yFrac >= 1) return;

    const x = Math.floor(xFrac * width);
    const y = Math.floor(yFrac * height);

    if (cells.current[x][y]) return;
    cells.current[x][y] = true;

    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = color.current;
    ctx.fillRect(x, y, 1, 1);
  };

  return (
    <>
      {bigScreen && showControls && (
        <div className="fixed z-10 top-4 left-4 flex flex-col gap-2 bg-stone-50 p-2 border shadow-2xl">
          <Button
            title={playing ? "Pause background" : "Unpause background"}
            className="px-2"
            onClick={() => {
              if (playing) {
                cancelAnimationFrame(requestFrame.current!);
              } else {
                requestFrame.current = requestAnimationFrame(frame);
              }
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause /> : <Play viewBox="0 0 22 24" />}
          </Button>
          <input
            className="p-2 w-10 h-10 border bg-transparent cursor-pointer"
            title="Change cell color"
            type="color"
            defaultValue="#fda4af"
            onChange={(e) => {
              color.current = `${e.target.value}80`;
            }}
          />

          <Button
            title="Clear cells"
            className="px-2"
            onClick={() => {
              cells.current = newBoard(width, height);
              if (!playing) iterate();
            }}
          >
            <Trash2 />
          </Button>
          <Button
            title="Randomize cells"
            className="px-2"
            onClick={() => {
              cells.current = randomize(newBoard(width, height));
              if (!playing) iterate();
            }}
          >
            <Shuffle />
          </Button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute w-screen top-0 left-0 opacity-25 pixelated"
        onMouseDown={(e) => {
          spawning.current = true;
          spawn(e);
        }}
        onMouseUp={() => (spawning.current = false)}
        onMouseLeave={() => (spawning.current = false)}
        onMouseMove={spawn}
      ></canvas>
      <div className="z-10 flex flex-col gap-4">
        {children}
      </div>
    </>
  );
}
