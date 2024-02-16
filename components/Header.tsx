"use client";

import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <nav className="text-xl flex justify-between">
      <h1 className="text-2xl font-black mt-4 mb-2 font-mono">
        <Link
          href="/"
          className="hover:text-zinc-400 transition-colors cursor-pointer"
        >
          kyle zheng
        </Link>
      </h1>
    </nav>
  );
}
