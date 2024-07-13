import graymatter from "gray-matter";
import path from "path";
import fs from "fs";

export const postsDir = path.join(process.cwd(), "posts");
export function getSlugs() {
  let fileNames = fs.readdirSync(postsDir);

  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/);
    return { slug };
  });
}

export function getPostDetails() {
  const frontmatters = getSlugs().map(({ slug }) => {
    const filePath = path.join(postsDir, `${slug}.mdx`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const file = graymatter(fileData);

    return {
      slug,
      subtitle: file.data.subtitle as string,
      posted: new Date(file.data.posted),
      image: file.data.image,
    };
  });

  // sort reverse chronological
  frontmatters.sort((a, b) => (b.posted < a.posted ? -1 : 1));

  return frontmatters;
}
