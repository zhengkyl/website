import Head from "next/head";
import { ReactNode } from "react";
import Footer from "../components/Footer";

import "../styles/globals.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
