import Head from "next/head";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

import "../styles/globals.css";

import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: "./SmileySans-Oblique.ttf.woff2",
  display: "swap",
});

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={myFont.className}>
      <body className="py-12 px-4 max-w-screen-md m-auto min-h-screen flex flex-col justify-between">
        <Nav />
        <main className="flex-1 my-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
