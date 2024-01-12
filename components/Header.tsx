"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const params = useParams();

  const [title, setTitle] = useState("");
  useEffect(() => {
    setTitle(window.location.hash.substring(1));
  }, [params]);

  return (
    <nav className="text-xl flex justify-between">
      <h1 className="text-2xl font-bold">
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
