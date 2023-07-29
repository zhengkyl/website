"use client";

import { Gol } from "@/components/Gol";
import { getMDXComponent } from "mdx-bundler/client";
import { P, A, Img, BlockLink } from "@/components/mdx";

export function InteractiveArticle({ code }) {
  const Component = getMDXComponent(code);

  return <Component components={{ p: P, a: A, img: Img, BlockLink, Gol }} />;
}
