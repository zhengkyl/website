"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav() {
  const pathname = usePathname();

  const isRoot = pathname === "/";

  const sections = pathname.split("/");
  if (isRoot) sections.pop();

  sections[0] = "kyle zheng";

  let sectionPath = "";

  return (
    <nav
      className={
        "text-5xl font-bold flex flex-wrap gap-x-4 font-serif text-stone-400"
      }
    >
      {sections.map((section, i) => {
        if (i) sectionPath += "/" + section;
        const isLast = i == sections.length - 1;
        return (
          <Link
            key={section}
            href={i ? sectionPath : "/"}
            className={
              "transition duration-500 hover:text-rose-400" +
              (isLast ? " text-rose-600" : "")
            }
          >
            {section.replaceAll("_", " ")}
          </Link>
        );
      })}
    </nav>
  );
}
