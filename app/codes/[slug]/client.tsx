"use client";

import { Gol } from "@/components/Gol";
import { getMDXComponent } from "mdx-bundler/client";
import { P, A, Img, Card, Link, Code, H2 } from "@/components/mdx";

export function InteractiveArticle({ code }) {
  const Component = getMDXComponent(code);

  return (
    <article>
      <Component
        components={{
          p: P,
          a: A,
          img: Img,
          code: Code,
          Card,
          Link,
          Gol,
          h2: H2,
        }}
      />
    </article>
  );
}
