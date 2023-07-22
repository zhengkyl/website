import path from "path";
import fs from "fs";
import graymatter from "gray-matter";
import Link from "next/link";

export const makesDir = path.join(process.cwd(), "posts/makes");

type Frontmatter = {
  slug: string;
  subtitle: string;
  posted: Date;
  edited: Date;
  image?: string;
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

    return {
      slug,
      subtitle: file.data.subtitle,
      posted: new Date(file.data.posted),
      edited: new Date(file.data.edited),
      image: file.data.image,
    } as Frontmatter;
  });

  // sort reverse chronological
  frontmatters.sort((a, b) => (b.posted < a.posted ? -1 : 1));

  return (
    <div>
      <ul>
        {frontmatters.map((matter) => (
          <Link href={`/makes/${matter.slug}`} key={matter.slug}>
            <li className="my-8 hover:underline">
              <div className="flex justify-between items-center">
                <h2 className="">{matter.slug.replaceAll("_", " ")}</h2>
                {/* <div className="text-2xl text-right whitespace-pre">
                  {dateFormat.format(matter.posted)}
                </div> */}
              </div>
              <p className="text-l">{matter.subtitle}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
