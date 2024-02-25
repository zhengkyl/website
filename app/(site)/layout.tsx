import Header from "@/components/Header";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header className="pt-16 pb-8 px-4 max-w-screen-sm m-auto" />
      <main className="px-4 max-w-screen-sm m-auto">{children}</main>
    </>
  );
}
