import globalStyles, { theme } from "../styles/global";
import "../styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { ParallaxProvider } from "react-scroll-parallax";
const App = ({ Component, pageProps }) => (
  <>
    {globalStyles}
    <ThemeProvider theme={theme}>
      <ParallaxProvider>
        <Component {...pageProps} />
      </ParallaxProvider>
    </ThemeProvider>
  </>
);

export default App;
