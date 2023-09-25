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
      className={`font-playfair text-5xl leading-tight font-black text-stone-500`}
    >
      {sections.map((section, i) => {
        if (i) sectionPath += "/" + section;
        const isLast = i == sections.length - 1;
        return (
          <Link
            key={section}
            href={i ? sectionPath : "/"}
            className={
              "block transition duration-500 @hover-text-rose-400" +
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
