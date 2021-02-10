import { css, Global } from '@emotion/react'

const breakpoints = [600, 960, 1200]

//breakpointMediaquery
export const bpMq = breakpoints.map(bp=>`@media (min-width: ${bp}px)`)

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
        background-color: #FCFCFC;
        color:#423d52;
      }
      h1 {
        font-size: 200%;
        color:#0a0a0a
      }
      h2 {
        font-size: 175%;
        color:#111111
      }
      h3 {
        font-size: 150%;
        color:#111111
      }
      h4 {
        font-size: 150%;
        color:#111111
      }
      h5 {
        font-size: 125%;
        color:#111111
      }
      h6 {
        font-size: 125%;
        color:#111111
      }
      ${bpMq[0]} {
        h1 {
          font-size: 250%;
        }
        h2{
          font-size: 
        }
      }
      ${bpMq[1]} {
        h1 {
          font-size: 300%;
        }
      }
      ${bpMq[2]} {
        h1 {
          font-size: 350%;
        }
      }
    `}
  />
)

export default globalStyles