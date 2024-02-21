"use client";

import { useState } from "react";

// ideas
// use css sprites for initial page content
// only load high quality for current page

export function Book(props) {
  const [page, setPage] = useState(0);

  const [pages, setPages] = useState([
    ["/images/1.jpg", "/images/2.jpg"],
    ["/images/3.jpg", "/images/4.jpg"],
    ["/images/5.jpg", "/images/5.jpg"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
    ["/images/4floss.gif", "/images/4floss.gif"],
  ]);

  const getTranslate = (index) => {
    // index == page && index == page - 1 are same
    if (index < page) index++;

    let xOffset;
    if (page === 0) {
      xOffset = `-50%`;
    } else if (page === pages.length + 2) {
      xOffset = `50%`;
    } else {
      const pageDiff = Math.max(-2, Math.min(2, index - page));
      xOffset = `${(Math.sign(pageDiff) * pageDiff * pageDiff) / 5}svh`;
    }

    // return `translate3d(0, 0, ${-Math.abs(index - page) * 10}px)`;
    return `translate3d(${xOffset}, 0, ${-Math.abs(index - page) / 5}svh)`;
  };

  return (
    <>
      <div className="mb-32">
        <button onClick={() => setPage((page) => (page > 0 ? page - 1 : page))}>
          Prev
        </button>
        {page}
        <button
          onClick={() =>
            setPage((page) => (page < pages.length + 2 ? page + 1 : page))
          }
        >
          Next
        </button>
      </div>
      <div
        {...props}
        style={{
          perspective: "100svh",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          transition: "transform 1s",
          width: 0,
          height: 0,
        }}
      >
        <div
          className="h-[50svh] aspect-[2/3] relative"
          style={{
            transformOrigin: "inherit",
            transition: "inherit",
            transformStyle: "inherit",
            transform: "rotateX(60deg)",
          }}
        >
          <div
            className="bg-red-700 rounded-r-lg h-full w-full absolute"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
              transform:
                page > 0
                  ? `${getTranslate(0)} rotate3d(0, 1, 0, -180deg)`
                  : getTranslate(0),
            }}
          >
            <div
              className="bg-blue-700 rounded-l-lg absolute top-0 bottom-0 my-auto h-[98%] aspect-[2/3] backface-hidden"
              style={{
                transform: "rotateY(180deg)",
              }}
            ></div>
          </div>
          <div
            className="absolute top-0 bottom-0 my-auto h-[98%] aspect-[2/3]"
            style={{
              transformOrigin: "inherit",
              transformStyle: "inherit",
              transition: "inherit",
            }}
          >
            {pages.map(([front, back], i) => {
              return (
                <div
                  key={i}
                  className="rounded-r-lg w-full h-full absolute shadow-2xl"
                  style={{
                    transition: "inherit",
                    transformOrigin: "inherit",
                    transformStyle: "inherit",
                    transform:
                      page > i + 1
                        ? `${getTranslate(i + 1)} rotate3d(0, 1, 0, -180deg)`
                        : getTranslate(i + 1),
                  }}
                >
                  {/* <div className="bg-red-500 h-full w-full absolute backface-hidden"></div>
                <div
                  className="bg-blue-500 h-full w-full absolute backface-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                  }}
                ></div> */}
                  <img
                    src={front}
                    className="absolute backface-hidden h-full"
                  />
                  <img
                    src={back}
                    className="absolute backface-hidden h-full"
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
              transformStyle: "inherit",
              transition: "inherit",
              transform:
                page > pages.length + 1
                  ? `${getTranslate(
                      pages.length + 1
                    )} rotate3d(0, 1, 0, -180deg)`
                  : getTranslate(pages.length + 1),
            }}
          >
            <div
              className="bg-blue-700 rounded-r-lg absolute top-0 bottom-0 my-auto h-[98%] aspect-[2/3] backface-hidden"
              style={{}}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
