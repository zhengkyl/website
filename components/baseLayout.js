import Head from "next/head";
import Navbar from "./navbar"
import Footer from "./footer"

export default function BaseLayout({ children }) {
  return (
    <>
      <Head>
        <title>Kyle Zheng</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* realfavicongenerator.net */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />

        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;700&display=swap" rel="stylesheet"/> 
      </Head>
      <Navbar/>
      {children}
      <Footer/>
    </>
  );
}
