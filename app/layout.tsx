import { ReactNode } from "react";
import Header from "@/components/Header";

import "./styles.css";

export const metadata = {
  title:{
    default: "kyle zheng",
    template: "%s | kyle zheng",
  }
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="px-4 py-16 m-auto max-w-screen-md">
          <Header className="pb-8 z-10 relative" />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
