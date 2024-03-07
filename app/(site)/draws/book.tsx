"use client";

import { useState } from "react";

// ideas
// use css sprites for initial page content
// only load high quality for current page

// texture

const toDeg = (d) => (d * 180) / Math.PI;

type Props = {
  pagesDir: string;
  numSheets?: number;
  insetSheets?: boolean;
  className?: string;
  sheetOffsetK?: number;
  spineCurveK?: number;
};

export function Book(props: Props) {
  const {
    numSheets = 5,
    insetSheets = false,
    pagesDir,
    sheetOffsetK = 1 / 150,
    spineCurveK = 0.6,
  } = props;

  // spineCurveK = width of spine half section as ratio of book depth
  // lower bound depends on sheetOffetK, numSheets, offsetX function
  // just try values so that spine halves always meet

  const [flips, setFlips] = useState(0);

  const front = `${pagesDir}/front.jpg`;
  const back = `${pagesDir}/back.jpg`;
  const insideFront = `${pagesDir}/0.jpg`;
  const insideBack = `${pagesDir}/${numSheets * 2 + 1}.jpg`;
  const sheets = Array.from({ length: numSheets }, (_, i) => [
    `${pagesDir}/${i * 2 + 1}.jpg`,
    `${pagesDir}/${i * 2 + 2}.jpg`,
  ]);

  const bookOpen = flips > 0 && flips < sheets.length + 2;

  const applyOffsetUnits = (v) =>
    `calc(${v * sheetOffsetK} * var(--cover-height))`;

  const getSheetTransform = (index) => {
    let rotate = "";
    if (flips > index) {
      rotate = "rotate3d(0, 1, 0, -180deg) ";

      index++; // prev flipped page has same x and z offset
    }

    const xOffset = applyOffsetUnits(getSheetXOffset(index));
    const zOffset = applyOffsetUnits(-Math.abs(index - flips));

    return `translate3d(${xOffset}, 0, ${zOffset}) ${rotate}`;
  };

  // return unitless offset
  const getSheetXOffset = (index) => {
    if (!bookOpen) return 0;
    const pageDiff = Math.max(-3, Math.min(3, index - flips));
    return (Math.sign(pageDiff) * pageDiff * pageDiff) / 5; // just a nice parabola
  };

  const getSpineHalfAngle = (back = false) => {
    const xStart = getSheetXOffset(1); // add 1 to match offset in getSheetTransform
    const xEnd = getSheetXOffset(sheets.length + 1);
    const xDist = xEnd - xStart;
    if (xDist === 0) {
      const halfHeight = (sheets.length + 1) / 2;
      const halfSpine = (sheets.length + 1) * spineCurveK;
      return (back ? 1 : -1) * toDeg(Math.asin(halfHeight / halfSpine));
    }

    const zStart = flips - 1;
    const zEnd = sheets.length + 1 - flips;
    const zDist = zEnd - zStart;
    if (zDist === 0) return 0;

    const spine = (sheets.length + 1) * spineCurveK * 2;
    const dist = Math.sqrt(zDist * zDist + xDist * xDist);

    // angle of isoscoles triangle between spine halves
    // equal to (dist / 2) / (spine / 2)
    const t = Math.acos(dist / spine);

    // angle of right triangle between front/back cover
    // when zDist is negative, this works correctly b/c gives negative complementary angle
    const tt = Math.atan(zDist / xDist);

    return toDeg((back ? -1 : 1) * t + tt);
  };

  const onNext = () => setFlips((page) => page + 1);
  const onPrev = () => setFlips((page) => page - 1);

  return (
    <>
      <div
        className={props.className}
        style={{
          perspective: "2000px",
          transformOrigin: "left center",
          transition: "transform 1s",
          marginInline: "auto",
        }}
      >
        <div className="absolute h-full w-full flex justify-center z-10">
          <div
            className="h-full w-1/2 cursor-pointer"
            onClick={flips ? onPrev : onNext}
          ></div>
          {bookOpen && (
            <div className="h-full w-1/2 cursor-pointer" onClick={onNext}></div>
          )}
        </div>
        <div
          className="relative h-full aspect-[var(--cover-aspect)] mx-auto"
          style={{
            transformOrigin: "inherit",
            transition: "inherit",
            transformStyle: "preserve-3d",
            transform: bookOpen
              ? `rotateX(15deg) translateX(50%)`
              : `rotateX(60deg) translateX(${flips > 0 ? 100 : 0}%)`,
          }}
        >
          <div
            className="absolute h-full w-full"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
              transform: getSheetTransform(0),
            }}
          >
            <div
              className="absolute bg-[var(--cover-color)] rounded-r-[var(--cover-radius)] h-full w-full backface-hidden bg-cover"
              style={{ backgroundImage: `url(${front})` }}
            ></div>
            <div
              className="absolute bg-[var(--cover-color)] rounded-l-[var(--cover-radius)] h-full w-full backface-hidden bg-right bg-no-repeat [background-size:var(--page-height)]"
              style={{
                transform: "rotateY(180deg)",
                backgroundImage: `url(${insideFront})`,
              }}
            ></div>
            <div
              className="absolute bg-[var(--cover-color)] h-full"
              style={{
                width: applyOffsetUnits((sheets.length + 1) * spineCurveK),
                transformOrigin: "inherit",
                transition: "inherit",
                transform: `rotate3d(0, 1, 0, ${
                  180 + getSpineHalfAngle(false)
                }deg)`,
              }}
            ></div>
          </div>
          <div
            className="absolute top-0 bottom-0 my-auto h-[var(--page-height)] aspect-[var(--page-aspect)]"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
            }}
          >
            {sheets.map(([front, back], i) => {
              const sheetIndex = i + 1;
              return (
                <div
                  key={i}
                  className="absolute h-full w-full shadow-2xl rounded-r-[var(--page-radius)]"
                  style={{
                    transition: "inherit",
                    transformOrigin: "inherit",
                    transformStyle: "inherit",
                    transform: getSheetTransform(sheetIndex),
                  }}
                >
                  <div
                    className="absolute backface-hidden h-full w-full rounded-r-[var(--page-radius)] bg-cover"
                    style={{ backgroundImage: `url(${front})` }}
                  ></div>
                  <div
                    className="absolute backface-hidden h-full w-full rounded-l-[var(--page-radius)] bg-cover"
                    style={{
                      transform: "rotateY(180deg)",
                      backgroundImage: `url(${back})`,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div
            className="h-full w-full"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
              transform: `${getSheetTransform(sheets.length + 1)}`,
            }}
          >
            <div
              className="absolute bg-[var(--cover-color)] rounded-r-[var(--page-radius)] h-full w-full backface-hidden bg-left bg-no-repeat [background-size:var(--page-height)]"
              style={{ backgroundImage: `url(${insideBack})` }}
            ></div>
            <div
              className="absolute bg-[var(--cover-color)] rounded-l-[var(--cover-radius)] h-full w-full backface-hidden bg-cover"
              style={{
                transform: "rotateY(180deg)",
                backgroundImage: `url(${back})`,
              }}
            ></div>
            <div
              className="absolute bg-[var(--cover-color)] h-full"
              style={{
                width: applyOffsetUnits((sheets.length + 1) * spineCurveK),
                transformOrigin: "inherit",
                transition: "inherit",
                transform: `rotate3d(0, 1, 0, ${
                  180 + getSpineHalfAngle(true)
                }deg)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
