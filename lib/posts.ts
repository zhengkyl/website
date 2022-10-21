import fs from "fs";
import { bundleMDX } from "mdx-bundler";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

export const getAllPostPaths = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    return {
      params: { slug },
    };
  });
};

export const getPostData = async (slug: string) => {
  const postPath = path.join(postsDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(postPath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdxOptions: {
    // }
  });

  return { code, frontmatter };
};
