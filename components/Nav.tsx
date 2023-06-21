"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav() {
  const pathname = usePathname();

  const sections = pathname.split("/");
  const current = sections.pop();
  sections.shift();

  let sectionPath = "";

  const isRoot = current === "";

  return (
    <nav
      className={"text-3xl font-semibold" + (isRoot ? "" : " text-slate-400")}
    >
      <Link
        href="/"
        className={"whitespace-pre transition hover:text-slate-600"}
      >
        kylezhe<small>.</small>ng
      </Link>
      <span className="cursor-default text-slate-200 mx-3">/</span>
      {sections.map((section) => {
        sectionPath += "/" + section;
        return (
          <span key={section} className="inline-block">
            <Link
              href={sectionPath}
              className="whitespace-pre transition hover:text-slate-600"
            >
              {section}
            </Link>
            <span className="cursor-default text-slate-200 mx-3">/</span>
          </span>
        );
      })}
      {!isRoot && (
        <>
          <Link
            href={pathname}
            className="whitespace-pre text-slate-800 transition hover:text-slate-600"
          >
            {current}
          </Link>
        </>
      )}
    </nav>
  );
}
