"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header(props) {
  const pathname = usePathname();

  const section = pathname.slice(1);

  return (
    <nav {...props}>
      <h1 className="text-2xl font-bold font-mono">
        <Link
          href="/"
          className="hover:text-zinc-400 transition-colors cursor-pointer"
        >
          kyle zheng
        </Link>{" "}
        {section}
      </h1>
    </nav>
  );
}
