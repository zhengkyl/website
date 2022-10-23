import globalStyles, { theme } from "../styles/global";
import "../styles/globals.css";
import { ThemeProvider } from "@emotion/react";

const App = ({ Component, pageProps }) => (
  <>
    {globalStyles}
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default App;
