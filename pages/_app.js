import globalStyles from "../styles/global";

const App = ({ Component, pageProps }) => (
  <>
    {globalStyles}
    <Component {...pageProps} />
  </>
);

export default App;
