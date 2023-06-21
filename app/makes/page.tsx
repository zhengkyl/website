import path from "path";
import fs from "fs";
import graymatter from "gray-matter";
import { generateStaticParams } from "./[slug]/page";
import Link from "next/link";

export const makesDir = path.join(process.cwd(), "posts/makes");

type Frontmatter = {
  slug: string;
  title: string;
  summary: string;
  posted: string;
  edited: string;
};

export function getSlugs() {
  const filesDir = path.join(process.cwd(), "posts/makes");
  const fileNames = fs.readdirSync(filesDir);
  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/);
    return { slug };
  });
}

export default async function Page() {
  const frontmatters = getSlugs().map(({ slug }) => {
    const filePath = path.join(makesDir, `${slug}.mdx`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const file = graymatter(fileData);
    return { slug, ...file.data } as Frontmatter;
  });

  // sort reverse chronological
  frontmatters.sort((a, b) => Date.parse(b.posted) - Date.parse(a.posted));

  return (
    <div>
      <ul>
        {frontmatters.map((matter) => (
          <Link href={`/makes/${matter.slug}`}>
            <li className="my-4 hover:underline">
              <div className="flex justify-between items-center">
                <h2 className="">{matter.slug}</h2>
                <small className="">{matter.posted}</small>
              </div>
              <p className="text-2xl">{matter.title}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
