import { ReactNode } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import "@code-hike/mdx/dist/index.css";
import "../styles/global.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="py-16 px-4 max-w-screen-md m-auto min-h-screen flex flex-col justify-between">
        <Nav />
        <main className="flex-1 my-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
