import { css, Global } from "@emotion/react";

export const theme = {
  colors: {
    title: "#2b030d",
    text: "#5c4848",
    background: "#FCFCFC",
  },
  standard: {
    contentWidth: 960,
    contentSpacing: 24,
  },
  breakpoints: [600, 960],
};
export const bpMq = theme.breakpoints.map(
  (bp) => `@media (min-width: ${bp}px)`
);

const globalStyles = (
  <Global
    styles={css`
      // a {
      //   color: inherit;
      //   text-decoration: none;
      // }
      // small {
      //   font-size: 75%;
      // }
      // html {
      //   font-family: "Inconsolata", monospace;
      //   line-height: 1.4;
      //   background-color: ${theme.colors.background};
      //   color: ${theme.colors.text};
      //   scroll-behavior: smooth;
      // }
      // h1 {
      //   line-height: normal;
      //   font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica,
      //     Arial, sans-serif;
      //   font-size: 250%;
      //   color: ${theme.colors.title};
      // }
      // h2 {
      //   font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica,
      //     Arial, sans-serif;
      //   line-height: normal;
      //   font-size: 225%;
      //   color: ${theme.colors.title};
      // }
      // h3 {
      //   line-height: normal;
      //   font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica,
      //     Arial, sans-serif;
      //   font-size: 175%;
      //   color: ${theme.colors.title};
      // }
      // h4 {
      //   line-height: normal;
      //   font-size: 175%;
      //   font-weight: 600;
      // }
      // h5 {
      //   line-height: normal;
      //   font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica,
      //     Arial, sans-serif;
      //   font-size: 150%;
      //   color: ${theme.colors.title};
      // }
      // h6 {
      //   line-height: normal;
      //   font-size: 150%;
      //   font-weight: 600;
      // }
      // ${bpMq[0]} {
      //   html {
      //     font-size: 110%;
      //   }
      //   h1 {
      //     font-size: 300%;
      //   }
      //   h2 {
      //     font-size: 275%;
      //   }
      //   h3 {
      //     font-size: 200%;
      //   }
      //   h4 {
      //     font-size: 200%;
      //   }
      //   h5 {
      //     font-size: 175%;
      //   }
      //   h6 {
      //     font-size: 175%;
      //   }
      // }
      // ${bpMq[1]} {
      //   html {
      //     font-size: 120%;
      //   }
      //   h1 {
      //     font-size: 400%;
      //   }
      //   h2 {
      //     font-size: 350%;
      //   }
      //   h3 {
      //     font-size: 250%;
      //   }
      //   h4 {
      //     font-size: 250%;
      //   }
      //   h5 {
      //     font-size: 200%;
      //   }
      //   h6 {
      //     font-size: 200%;
      //   }
      }
    `}
  />
);

export default globalStyles;
