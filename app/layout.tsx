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
      <head></head>
      <body>{children}</body>
    </html>
  );
}
