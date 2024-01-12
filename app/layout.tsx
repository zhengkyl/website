import { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "@code-hike/mdx/dist/index.css";
import "../styles/global.css";

export const metadata = {
  title: "Kyle Zheng",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="py-16 px-4 max-w-screen-sm m-auto">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
