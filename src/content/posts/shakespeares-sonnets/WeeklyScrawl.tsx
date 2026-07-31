import { useEffect, useRef, useState } from "preact/hooks";
import { Scrawl, ScrawlDefs, UNLINED_INDEX, sonnetDate } from "./Scrawl";

type Day = { wpm: number };

type Props = {
  days: Day[];
  // one url per day, only the chosen ones are ever fetched
  scrawlUrls: string[];
  // day numbers (1-based), roughly one per week
  chosen: number[];
  width: number;
  height: number;
};

const DAYS_PER_WEEK = 7;
// the speed to beat; it is also the axis maximum, so the mark lands on the
// right edge of every week's chart
const RIGHT_HAND_WPM = 21.8;

// one hue per position in the week, so the spectrum restarts every Tuesday
const dayColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-sky-500",
  "bg-blue-600",
  "bg-violet-500",
];

const rangeFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

// each scrawl is a chunk of stroke data, so it only leaves the server once its
// week is nearly on screen
function LazyScrawl({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        fetch(url)
          .then((r) => r.text())
          .then(setData);
      },
      { rootMargin: "400px" },
    );
    observer.observe(rootRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} class="flex-1 min-h-0">
      {data !== null && (
        <Scrawl data={data} width={width} height={height} fitHeight />
      )}
    </div>
  );
}

function Bar({ day, wpm, max, chosen }: {
  day: number;
  wpm: number;
  max: number;
  chosen: boolean;
}) {
  // the track spans the same box as the reference line's layer, so the bar's
  // percentage and the mark share one scale
  return (
    <div class="flex items-center">
      <span
        class={`w-6 shrink-0 pr-1.5 text-right text-[10px] leading-none tabular-nums ${chosen ? "text-stone-700 font-bold" : "text-stone-400"
          }`}
      >
        {day}
      </span>
      <div class="relative flex-1">
        <div
          class={`relative h-8 rounded-r-[4px] ${dayColors[(day - 1) % dayColors.length]} ${chosen ? "" : "bg-opacity-30"}`}
          style={{ width: `${(wpm / max) * 100}%` }}
        >
          <span
            class={`absolute left-full top-1/2 -translate-y-1/2 ml-1.5 text-[10px] leading-none tabular-nums whitespace-nowrap ${chosen ? "text-stone-700 font-bold" : "text-stone-500"
              }`}
          >
            {wpm.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Week({
  days,
  offset,
  max,
  chosen,
  scrawlUrls,
  width,
  height,
}: {
  days: Day[];
  offset: number;
  max: number;
  chosen: number[];
  scrawlUrls: string[];
  width: number;
  height: number;
}) {
  const firstDay = offset + 1;
  const lastDay = offset + days.length;
  const weekNumber = Math.floor(offset / DAYS_PER_WEEK) + 1;
  // a week usually owns exactly one chosen day, but nothing guarantees it
  const picks = chosen.filter((day) => day >= firstDay && day <= lastDay);

  return (
    <div class="grid gap-4 md:grid-cols-[1fr_minmax(0,18rem)] py-3">
      <div>
        <div class="flex items-baseline gap-2 pb-2 text-xs">
          <span class="font-bold">Week {weekNumber}</span>
          <span class="text-stone-500">
            {rangeFormat.format(sonnetDate(firstDay - 1))} –{" "}
            {rangeFormat.format(sonnetDate(lastDay - 1))}
          </span>
        </div>
        <div class="relative">
          {/* same inset as a row's track, so the mark and the bars share a scale */}
          <div class="absolute inset-y-0 left-6 right-0">
            <div
              class="absolute inset-y-0 border-l border-dashed border-orange-500"
              style={{ left: `${(RIGHT_HAND_WPM / max) * 100}%` }}
            />
          </div>
          <div class="relative flex flex-col gap-1">
            {days.map((d, i) => (
              <Bar
                key={offset + i}
                day={offset + i + 1}
                wpm={d.wpm}
                max={max}
                chosen={picks.includes(offset + i + 1)}
              />
            ))}
          </div>
          {/* an empty axis row on later weeks still holds every week's chart to
              the same height, which is what sizes the scrawl beside it */}
          <div class="relative h-4 ml-6">
            {offset === 0 && (
              <span
                class="absolute top-1 -translate-x-full -ml-1.5 text-[9px] leading-none whitespace-nowrap text-orange-600"
                style={{ left: `${(RIGHT_HAND_WPM / max) * 100}%` }}
              >
                {RIGHT_HAND_WPM} right hand
              </span>
            )}
          </div>
        </div>
      </div>
      {/* the chart sets the row's height; the scrawls fit themselves into
          whatever is left over */}
      <div class="md:relative">
        <div class="md:absolute md:inset-0 flex flex-col gap-2">
          {picks.map((day) => (
            <div key={day} class="flex-1 min-h-0 flex flex-col">
              <div class="flex justify-between items-baseline text-xs px-2">
                <span class="font-bold">Sonnet {day}</span>
                <span class="text-stone-500 tabular-nums">
                  {days[day - firstDay].wpm.toFixed(1)} wpm
                </span>
              </div>
              <LazyScrawl
                url={scrawlUrls[day - 1]}
                width={width}
                height={height + (day - 1 >= UNLINED_INDEX ? 100 : 0)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeeklyScrawl({
  days,
  scrawlUrls,
  chosen,
  width,
  height,
}: Props) {
  // full width is the right hand's speed, so every bar reads as a fraction of
  // the hand it is chasing
  const max = RIGHT_HAND_WPM;

  const weeks: number[] = [];
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) weeks.push(i);

  return (
    <div class="w-screen max-w-1024px ml-[calc(50%-min(512px,50vw))] px-4 divide-y divide-stone-200">
      <ScrawlDefs />
      {weeks.map((offset) => (
        <Week
          key={offset}
          days={days.slice(offset, offset + DAYS_PER_WEEK)}
          offset={offset}
          max={max}
          chosen={chosen}
          scrawlUrls={scrawlUrls}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}
