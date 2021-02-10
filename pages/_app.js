import globalStyles, { theme } from "../styles/global";
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
