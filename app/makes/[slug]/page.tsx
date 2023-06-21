import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "path";
import { makesDir, getSlugs } from "../page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSlugs();
}

export default async function Page({
  params,
}: {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
}) {
  const filePath = path.join(makesDir, `${params.slug}.mdx`);
  const fileData = fs.readFileSync(filePath, "utf8");
  const { code, frontmatter } = await bundleMDX({ source: fileData });
  const Component = getMDXComponent(code);
  console.log("page function run");

  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.posted}</h2>
      {frontmatter.posted !== frontmatter.edited && (
        <h2>{frontmatter.edited}</h2>
      )}
      <Component />
    </div>
  );
}
