import { css, Global } from "@emotion/react";

export const theme = {
  colors: {
    title: "#0a0a0a",
    text: "#292333",
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
      html,
      body,
      div,
      span,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      blockquote,
      pre,
      a,
      code,
      img,
      small,
      strike,
      strong,
      sub,
      sup,
      ol,
      ul,
      li,
      fieldset,
      form,
      label,
      table,
      caption,
      tbody,
      tfoot,
      thead,
      tr,
      th,
      td,
      canvas,
      footer,
      header,
      nav,
      section {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      small {
        font-size:75%;
      }
      html {
        font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica,
          Arial, sans-serif;
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        scroll-behavior: smooth;
      }
      h1 {
        font-size: 250%;
        color: ${theme.colors.title};
      }
      h2 {
        font-size: 225%;
        color: ${theme.colors.title};
      }
      h3 {
        font-size: 175%;
        color: ${theme.colors.title};
      }
      h4 {
        font-size: 175%;
        color: ${theme.colors.title};
        font-weight: 600;
      }
      h5 {
        font-size: 150%;
        color: ${theme.colors.title};
      }
      h6 {
        font-size: 150%;
        color: ${theme.colors.title};
        font-weight: 600;
      }
      ${bpMq[0]} {
        html {
          font-size:110%;
        }
        h1 {
          font-size: 300%;
        }
        h2 {
          font-size: 275%;
        }
        h3 {
          font-size: 200%;
        }
        h4 {
          font-size: 200%;
        }
        h5 {
          font-size: 175%;
        }
        h6 {
          font-size: 175%;
        }
      }
      ${bpMq[1]} {
        html {
          font-size:120%;
        }
        h1 {
          font-size: 400%;
        }
        h2 {
          font-size: 350%;
        }
        h3 {
          font-size: 250%;
        }
        h4 {
          font-size: 250%;
        }
        h5 {
          font-size: 200%;
        }
        h6 {
          font-size: 200%;
        }
      }  
    `}
  />
);

export default globalStyles;
