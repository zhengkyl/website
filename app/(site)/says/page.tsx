import path from "path";
import fs from "fs";
import graymatter from "gray-matter";
import Link from "next/link";

type Frontmatter = {
  slug: string;
  subtitle: string;
  posted: Date;
  edited: Date;
  image?: string;
};

const published = ["workshops_are_hard.mdx"];
const postsDir = path.join(process.cwd(), "posts");
function getSlugs() {
  let fileNames = fs.readdirSync(postsDir);

  if (process.env.NODE_ENV === "production") {
    fileNames = fileNames.filter((name) => published.includes(name));
  }

  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/);
    return { slug };
  });
}

export default async function Page() {
  const frontmatters = getSlugs().map(({ slug }) => {
    const filePath = path.join(postsDir, `${slug}.mdx`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const file = graymatter(fileData);

    return {
      slug,
      subtitle: file.data.subtitle,
      posted: new Date(file.data.posted),
      image: file.data.image,
    } as Frontmatter;
  });

  // sort reverse chronological
  frontmatters.sort((a, b) => (b.posted < a.posted ? -1 : 1));

  return (
    <div>
      <ul>
        {frontmatters.map((matter) => (
          <Link href={`/says/${matter.slug}`} key={matter.slug}>
            <li className="mb-8">
              <h2 className="font-black text-3xl text-stone-500 @hover-text-rose-400 transition duration-500">
                /{matter.slug.replaceAll("_", " ")}
              </h2>
              <h3 className="font-light italic text-stone-500 text-xl mt-2">
                {matter.subtitle}
              </h3>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
