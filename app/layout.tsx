import { ReactNode } from "react";

import "../styles/global.css";

export const metadata = {
  title: "kyle zheng",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
