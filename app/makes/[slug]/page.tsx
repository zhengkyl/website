import { remarkCodeHike } from "@code-hike/mdx";
import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import remarkGfm from "remark-gfm";
import { getSlugs, makesDir } from "../page";
import { InteractiveArticle } from "./client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSlugs();
}

const dateOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
} as const;

export default async function Page({
  params,
}: {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
}) {
  const filePath = path.join(makesDir, `${params.slug}.mdx`);
  const fileData = fs.readFileSync(filePath, "utf8");
  const { code, frontmatter } = await bundleMDX({
    source: fileData,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkCodeHike, { theme: "one-dark-pro" }],
        remarkGfm,
      ];

      return options;
    },
  });

  const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

  return (
    <>
      <div className="text-sm text-stone-400 font-semibold">
        {dateFormat.format(Date.parse(frontmatter.posted))}
        {/* {frontmatter.posted !== frontmatter.edited && (
          <div>Edited {dateFormat.format(Date.parse(frontmatter.edited))}</div>
        )} */}
      </div>
      <InteractiveArticle code={code} />
    </>
  );
}
