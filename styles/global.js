import { css, Global,  } from '@emotion/react'

export const theme = {
  colors: {
    title: '#0a0a0a',
    text:'#292333',
    background:'#FCFCFC',
  },
  breakpoints: [600, 960, 1200]
}

export const bpMq = theme.breakpoints.map(bp=>`@media (min-width: ${bp}px)`)

const globalStyles = (
  <Global
    styles={css`
      html, body, div, span, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, code, img, 
      small, strike, strong, sub, sup,  ol, ul, li, fieldset, form, label, table, caption,
      tbody, tfoot, thead, tr, th, td, canvas, footer, header, nav,section,
      {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      html {
        font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif;
        background-color: ${theme.colors.background};
        color:${theme.colors.text};
      }
      h1 {
        font-size: 200%;
        color:${theme.colors.title};
      }
      h2 {
        font-size: 165%;
        color:${theme.colors.title};
      }
      h3 {
        font-size: 150%;
        color:${theme.colors.title};
      }
      h4 {
        font-size: 150%;
        color:${theme.colors.title};
      }
      h5 {
        font-size: 125%;
        color:${theme.colors.title};
      }
      h6 {
        font-size: 125%;
        color:${theme.colors.title};
      }
      ${bpMq[0]} {
        h1 {
          font-size: 250%;
        }
        h2{
          font-size: 215%;
        }
      }
      ${bpMq[1]} {
        h1 {
          font-size: 300%;
        }
        h2{
          font-size: 265%;
        }
      }
      ${bpMq[2]} {
        h1 {
          font-size: 400%;
        }
        h2{
          font-size: 315%;
        }
      }
    `}
  />
)

export default globalStyles