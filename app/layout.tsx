import Head from "next/head";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

import "../styles/globals.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="py-12 px-6 max-w-screen-md m-auto min-h-screen flex flex-col justify-between">
        <Nav />
        <main className="flex-1 my-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
