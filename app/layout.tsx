import { ReactNode } from "react";
import Header from "../components/Header";

import "../styles/global.css";

export const metadata = {
  title: "Kyle Zheng",
  description: "A decent programmer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
        />
      </head>
      <body className="py-16 px-4 max-w-screen-sm m-auto">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
