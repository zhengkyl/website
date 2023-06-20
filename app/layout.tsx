import Head from "next/head";
import { ReactNode } from "react";
import Footer from "../components/Footer";

import "../styles/globals.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="p-8 max-w-screen-lg m-auto min-h-screen flex flex-col justify-between">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
