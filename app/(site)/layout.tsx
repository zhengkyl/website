import Header from "@/components/Header";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-16 m-auto max-w-screen-md">
      <Header className="pb-8" />
      <main>{children}</main>
    </div>
  );
}
