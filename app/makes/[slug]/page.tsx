import { remarkCodeHike } from "@code-hike/mdx";
import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
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
      ];

      return options;
    },
  });

  const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

  return (
    <>
      <div className="mb-4">
        Posted {dateFormat.format(Date.parse(frontmatter.posted))}
        <br />
        {frontmatter.posted !== frontmatter.edited && (
          <>Edited {dateFormat.format(Date.parse(frontmatter.edited))}</>
        )}
      </div>
      <InteractiveArticle code={code} />
    </>
  );
}
