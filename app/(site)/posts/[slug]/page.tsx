import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import remarkGfm from "remark-gfm";
import { getSlugs, postsDir } from "../config";
import { InteractiveArticle } from "./client";
import { visit } from "unist-util-visit";

export function generateMetadata(props: { params: { slug: string } }) {
  return {
    title: `${props.params.slug.replaceAll("_", " ")} | kyle zheng`,
  };
}

export const dynamicParams = false;

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
  const filePath = path.join(postsDir, `${params.slug}.mdx`);
  const fileData = fs.readFileSync(filePath, "utf8");
  const { code, frontmatter } = await bundleMDX({
    // Relative urls break when switching pages
    // Rewrite all mdx image src to absolute path
    source: fileData.replaceAll('src="', `src="/posts/${params.slug}/`),
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        // Rewrite all markdown ![]() image src to absolute path
        () => (tree, _file) => {
          visit(tree, "image", (image) => {
            image.url = `/posts/${params.slug}/${image.url}`;
          });
        },
      ];

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
