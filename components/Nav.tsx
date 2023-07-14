"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav() {
  const pathname = usePathname();

  const sections = pathname.split("/");
  sections.shift();

  let sectionPath = "";

  const isRoot = pathname === "/";

  return (
    <nav
      className={
        "text-3xl font-bold flex flex-wrap gap-x-2" +
        (isRoot ? "" : " text-stone-400")
      }
    >
      <Link href="/" className={"transition hover:text-stone-600"}>
        kyle zheng
      </Link>
      {sections.map((section, i) => {
        sectionPath += "/" + section;
        const isLast = i == sections.length - 1;
        return (
          <Link
            key={section}
            href={sectionPath}
            className={
              "transition hover:text-stone-600" +
              (isLast ? " text-stone-800" : "")
            }
          >
            {section.replaceAll("_", " ")}
          </Link>
        );
      })}
    </nav>
  );
}
