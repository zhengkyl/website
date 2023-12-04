"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    <nav className={`font-playfair text-5xl leading-tight font-black`}>
      <h1>
        <AnimatePresence initial={false}>
          {sections.map((section, i) => {
            if (i) sectionPath += "/" + section;
            const isLast = i == sections.length - 1;
            return (
              <motion.div
                key={section}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{
                  x: -500,
                  opacity: 0,
                  height: 0,
                  transition: { delay: (sections.length - i - 1) * 0.1 },
                }}
              >
                <Link
                  href={i ? sectionPath : "/"}
                  className={
                    "block transition duration-500 @hover-text-rose-600" +
                    (isLast ? " text-rose-600" : "")
                  }
                >
                  {section.replaceAll("_", " ")}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </h1>
    </nav>
  );
}
