import Head from "next/head";
import { ReactNode } from "react";

import Footer from "./Footer";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Kyle Zheng</title>
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
      </Head>
      {children}
      <Footer />
    </>
  );
}
