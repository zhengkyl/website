import graymatter from "gray-matter";
import path from "path";
import fs from "fs";
import Link from "next/link";
import { getSlugs, postsDir } from "./config";

type Frontmatter = {
  slug: string;
  subtitle: string;
  posted: Date;
  edited: Date;
  image?: string;
};

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
          <Link href={`/posts/${matter.slug}`} key={matter.slug}>
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
