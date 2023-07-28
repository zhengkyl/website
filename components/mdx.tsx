import { useEffect, useRef, useState } from "react";

export function P({ children }) {
  if (typeof children !== "string" && children.type === "img") {
    return <>{children}</>;
  }

  return <p className="my-4">{children}</p>;
}

export function A(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a className="hover:underline" href={url} target="_blank">
      {text.replace("https://", "")}
    </a>
  );
}

export function BlockLink(props) {
  return (
    <div className="rounded border p-4 my-4">
      {props.title && <p className="font-bold">{props.title}</p>}
      <A {...props} />
    </div>
  );
}

export function Img(props) {
  return <img alt="" {...props} border="~ rounded" />;
}

function newBoard(width, height) {
  return Array.from(Array(width), () => Array(height).fill(false));
}

function randomize(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      board[i][j] = Math.random() > 0.9 ? true : false;
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

export function Gol({ width, height }) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const requestFrame = useRef<number>();
  const prevTime = useRef(0);
  const spawning = useRef(false);
  const color = useRef("#fda4af22");

  const [playing, setPlaying] = useState(true);

  const cells = useRef(nextBoard(randomize(newBoard(width, height))));

  const iterate = () => {
    const ctx = canvasRef.current.getContext("2d");

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
    return () => cancelAnimationFrame(requestFrame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spawn = (e) => {
    if (!spawning.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const xFrac = (e.clientX - rect.left) / canvasRef.current.clientWidth;
    const yFrac = (e.clientY - rect.top) / canvasRef.current.clientHeight;

    if (xFrac >= 1 || yFrac >= 1) return;

    const x = Math.floor(xFrac * width);
    const y = Math.floor(yFrac * height);

    if (cells.current[x][y]) return;
    cells.current[x][y] = true;

    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = color.current;
    ctx.fillRect(x, y, 1, 1);
  };

  return (
    <>
      <div bg="stone-50" m="y-4" p="x-4 y-2" border="~ rounded">
        <p font="bold">Background Controls</p>
        <div className="leading-4 flex flex-wrap gap-2">
          <button
            className="btn-outline"
            border="~ rounded"
            p="2"
            hover
            onClick={() => {
              if (playing) {
                cancelAnimationFrame(requestFrame.current);
              } else {
                requestFrame.current = requestAnimationFrame(frame);
              }
              setPlaying(!playing);
            }}
          >
            <div
              className={playing ? "i-ph:pause-fill" : "i-ph:play-fill"}
            ></div>
          </button>
          <input
            type="color"
            defaultValue="#fda4af"
            onChange={(e) => {
              color.current = `${e.target.value}22`;
            }}
            border="~ rounded"
            p="2"
            h="45px"
            w="45px"
          />
          <button
            border="~ rounded"
            p="2"
            disabled={playing}
            onClick={() => {
              iterate();
            }}
          >
            <div className="i-ph:arrow-arc-right-bold" mr="1"></div>
            <span>Step</span>
          </button>
          <button
            border="~ rounded"
            p="2"
            onClick={() => (cells.current = newBoard(width, height))}
          >
            <div className="i-ph:trash-bold" mr="1"></div>
            <span>Clear</span>
          </button>
          <button
            border="~ rounded"
            p="2"
            onClick={() => (cells.current = randomize(newBoard(width, height)))}
          >
            <div className="i-ph:shuffle-angular-bold" mr="1"></div>
            Random
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute w-screen top-0 left-0 -z-50"
        style={{ imageRendering: "crisp-edges" }}
        onMouseDown={(e) => {
          spawning.current = true;
          spawn(e);
        }}
        onMouseUp={() => (spawning.current = false)}
        onMouseLeave={() => (spawning.current = false)}
        onMouseMove={spawn}
      ></canvas>
    </>
  );
}
