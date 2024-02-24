"use client";

import { useState } from "react";

// ideas
// use css sprites for initial page content
// only load high quality for current page

// TODO
// scan images
// clamp/scale/ breakpoint
// figure out ui
// texture covers
// write text
// link from home
const toDeg = (d) => (d * 180) / Math.PI;

type Props = {
  pagesDir: string;
  numSheets?: number;
  insetPages?: boolean;
  className?: string;
};

export function Book(props: Props) {
  const { numSheets = 5, insetPages = false, pagesDir } = props;

  const [flips, setFlips] = useState(0);

  const insideFront = `${pagesDir}/0.jpg`;
  const insideBack = `${pagesDir}/${numSheets}.jpg`;
  const sheets = Array.from({ length: numSheets }, (_, i) => [
    `${pagesDir}/${i * 2 + 1}.jpg`,
    `${pagesDir}/${i * 2 + 2}.jpg`,
  ]);

  const bookOpen = flips > 0 && flips < sheets.length + 2;

  const getSheetTransform = (index) => {
    let rotate = "";
    if (flips > index) {
      rotate = "rotate3d(0, 1, 0, -180deg) ";

      index++; // prev flipped page has same x and z offset
    }

    const xOffset = `${getSheetXOffset(index) / 5}svh`;

    return `translate3d(${xOffset}, 0, ${
      -Math.abs(index - flips) / 5
    }svh) ${rotate}`;
  };

  // return unitless offset
  const getSheetXOffset = (index) => {
    if (!bookOpen) return 0;
    const pageDiff = Math.max(-2, Math.min(2, index - flips));
    return Math.sign(pageDiff) * pageDiff * pageDiff; // just a nice parabola
  };

  // units = 1/5 svh
  const getSpineHalfAngle = (back = false) => {
    const xStart = getSheetXOffset(1); // add 1 to match offset in getSheetTransform
    const xEnd = getSheetXOffset(sheets.length + 1);
    const xDist = xEnd - xStart;
    if (xDist === 0) {
      const halfHeight = (sheets.length + 1) / 2;
      const halfSpine = sheets.length + 1; // arbitrary value that matches width
      return (back ? 1 : -1) * toDeg(Math.asin(halfHeight / halfSpine));
    }

    const zStart = flips - 1;
    const zEnd = sheets.length + 1 - flips;
    const zDist = zEnd - zStart;
    if (zDist === 0) return 0;

    const spine = (sheets.length + 1) * 2;
    const dist = Math.sqrt(zDist * zDist + xDist * xDist);

    // angle of isoscoles triangle between spine halves
    // equal to (dist / 2) / (spine / 2)
    const t = Math.acos(dist / spine);

    // angle of right triangle between front/back cover
    // when zDist is negative, this works correctly b/c gives negative complementary angle
    const tt = Math.atan(zDist / xDist);

    return toDeg((back ? -1 : 1) * t + tt);
  };

  const [range, setRange] = useState(0);
  const [rangeZ, setRangeZ] = useState(0);

  return (
    <>
      <button onClick={() => setFlips((page) => page - 1)}>prev</button>
      <button onClick={() => setFlips((page) => page + 1)}>next</button>
      <input
        className="w-full"
        type="range"
        min={-360}
        max={360}
        value={range}
        onChange={(e) => setRange(e.target.value)}
      />
      <input
        className="w-full"
        type="range"
        min={-360}
        max={360}
        value={rangeZ}
        onChange={(e) => setRangeZ(e.target.value)}
      />
      <div
        className={props.className}
        style={{
          perspective: "100svh",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          transition: "transform 1s",
          width: 0,
          marginInline: "auto",
        }}
      >
        <div
          className="h-full aspect-[7/11] relative"
          style={{
            transformOrigin: "inherit",
            transition: "inherit",
            transformStyle: "inherit",
            transform: bookOpen
              ? `rotateX(${range}deg) rotateZ(${rangeZ}deg)`
              : `rotateX(${range}deg) rotateZ(${rangeZ}deg) translateX(${
                  flips > 0 ? 50 : -50
                }%)`,
          }}
        >
          <div
            className="bg-red-700 rounded-r-[5.5%_3.5%] h-full w-full absolute"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
              transform: getSheetTransform(0),
            }}
          >
            <img
              className="rounded-l-[5.45%_3.45%] absolute top-0 bottom-0 my-auto h-[98%] aspect-[69/109] backface-hidden"
              style={{
                transform: "rotateY(180deg)",
              }}
              src={insideFront}
            ></img>
            <div
              className="bg-red-700 absolute h-full"
              style={{
                width: `${(sheets.length + 1) / 5}svh`,

                transformOrigin: "inherit",
                // transformStyle: "inherit",
                transition: "inherit",
                transform: `rotate3d(0, 1, 0, ${
                  180 + getSpineHalfAngle(false)
                }deg)`,
                //   sheet > 0
                //     ? `${getTranslate(0)} rotate3d(0, 1, 0, -180deg)`
                //     : getTranslate(0),
              }}
            ></div>
          </div>
          <div
            className="absolute top-0 bottom-0 my-auto h-[98%] aspect-[69/109]"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
            }}
          >
            {sheets.map(([front, back], i) => {
              return (
                <div
                  key={i}
                  className="w-full h-full absolute shadow-2xl"
                  style={{
                    transition: "inherit",
                    transformOrigin: "inherit",
                    transformStyle: "inherit",
                    transform: getSheetTransform(i + 1),
                  }}
                >
                  <img
                    src={front}
                    className="absolute backface-hidden h-full rounded-r-[5.45%_3.45%]"
                  />
                  <img
                    src={back}
                    className="absolute backface-hidden h-full rounded-l-[5.45%_3.45%]"
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div
            className="bg-red-700 rounded-r-[5.5%_3.5%] h-full w-full"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
              transform: getSheetTransform(sheets.length + 1),
            }}
          >
            <img
              className="rounded-r-[5.45%_3.45%] absolute top-0 bottom-0 my-auto h-[98%] aspect-[69/109] backface-hidden"
              src={insideBack}
            ></img>
            <div
              className="bg-red-700 absolute h-full"
              style={{
                width: `${(sheets.length + 1) / 5}svh`,

                transformOrigin: "inherit",
                // transformStyle: "inherit",
                transition: "inherit",
                transform: `rotate3d(0, 1, 0, ${
                  180 + getSpineHalfAngle(true)
                }deg)`,
                //   sheet > 0
                //     ? `${getTranslate(0)} rotate3d(0, 1, 0, -180deg)`
                //     : getTranslate(0),
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
