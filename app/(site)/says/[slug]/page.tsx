import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import remarkGfm from "remark-gfm";
import { InteractiveArticle } from "./client";

export const dynamicParams = false;

const published = ["ssh_game_of_life.mdx"];
const codesDir = path.join(process.cwd(), "posts");
function getSlugs() {
  let fileNames = fs.readdirSync(codesDir);

  if (process.env.NODE_ENV === "production") {
    fileNames = fileNames.filter((name) => published.includes(name));
  }

  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/);
    return { slug };
  });
}

export async function generateStaticParams() {
  return getSlugs();
}

const dateOptions = {
  month: "short",
  // day: "numeric",
  year: "numeric",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

export default async function Page({
  params,
}: {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
}) {
  const filePath = path.join(codesDir, `${params.slug}.mdx`);
  const fileData = fs.readFileSync(filePath, "utf8");
  const { code, frontmatter } = await bundleMDX({
    source: fileData,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];

      return options;
    },
  });

  return (
    <>
      <div className="font-light italic text-stone-500 text-xl">
        {dateFormat.format(Date.parse(frontmatter.posted))}
      </div>
      <InteractiveArticle code={code} />
    </>
  );
}
