import path from "path";
import fs from "fs";

export const published = [
  "ssh_game_of_life",
  "vite-plugin-wasm-pack_bug",
];

export const postsDir = path.join(process.cwd(), "posts");
export function getSlugs() {
  let fileNames = fs.readdirSync(postsDir);

  if (process.env.NODE_ENV === "production") {
    fileNames = fileNames.filter((name) => published.includes(name));
  }

  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/);
    return { slug };
  });
}
