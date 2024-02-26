"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header(props) {
  const pathname = usePathname();

  const sections = pathname === "/" ? [] : pathname.slice(1).split("/");

  return (
    <nav {...props}>
      <h1 className="text-2xl font-bold font-mono">
        <Link
          href="/"
          className="hover:text-zinc-400 transition-colors cursor-pointer"
        >
          kyle zheng
        </Link>
        {sections.map((section, i) => (
          <React.Fragment key={section}>
            {" "}
            <Link
              href={`/${sections.slice(0, i + 1).join("/")}`}
              className="hover:text-zinc-400 transition-colors cursor-pointer"
            >
              {section.replaceAll("_", " ")}
            </Link>
          </React.Fragment>
        ))}
      </h1>
    </nav>
  );
}
