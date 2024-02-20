"use client";

import { useState } from "react";

// ideas
// use css sprites for initial page content
// only load high quality for current page

export function Book(props) {
  const [page, setPage] = useState(0);

  const [pages, setPages] = useState([
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
  ]);

  const getTranslate = (index) =>
    `translate3d(${index - page * 10}px, 0, ${-Math.abs(index - page) * 10}px)`;

  return (
    <>
      <button onClick={() => setPage((page) => page - 1)}>Prev</button>
      {page}
      <button onClick={() => setPage((page) => page + 1)}>Next</button>
      <div
        {...props}
        style={{
          transformOrigin: "left center",
          perspective: "2000px",
          transformStyle: "preserve-3d",
          transition: "transform 1s",
          // transform: "rotate3d(0, 1, 0, -45deg)",
        }}
        className="h-[400px] aspect-[13.5/21] relative"
      >
        <div
          className="bg-red-700 rounded-r-lg h-full w-full absolute"
          style={{
            transformOrigin: "inherit",
            transition: "inherit",
            transform:
              page > 0
                ? `${getTranslate(0)} rotate3d(0, 1, 0, -180deg)`
                : getTranslate(0),
          }}
        ></div>
        <div
          className="absolute top-0 bottom-0 my-auto h-[380px] aspect-[13.5/21]"
          style={{
            transformOrigin: "inherit",
            perspective: "inherit",
            transformStyle: "inherit",
            transition: "inherit",
          }}
        >
          {pages.map(([front, back], i) => {
            return (
              <div
                key={i}
                className="bg-stone-50 rounded-r-lg w-full h-full absolute"
                style={{
                  transition: "inherit",
                  transformOrigin: "inherit",
                  transform:
                    page > i + 1
                      ? `${getTranslate(i + 1)} rotate3d(0, 1, 0, -180deg)`
                      : getTranslate(i + 1),
                }}
              >
                <img src={front} className="absolute backface-hidden" />
                <img
                  src={back}
                  className="absolute backface-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="bg-red-600 rounded-r-lg h-full w-full"
          style={{
            transformOrigin: "inherit",
            transition: "inherit",
            transform: getTranslate(pages.length + 1),
          }}
        ></div>
      </div>
    </>
  );
}
