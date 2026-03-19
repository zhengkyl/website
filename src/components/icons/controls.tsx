import type { HTMLAttributes } from "preact";

export function PlayIcon(props: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 4v16L19 12Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(props: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 4h4v16h-4ZM14 4h4v16h-4Z" fill="currentColor" />
    </svg>
  );
}
