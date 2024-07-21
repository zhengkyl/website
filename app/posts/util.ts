import fs from "fs";

export function getPostSlugs() {
  const fileNames = fs.readdirSync("posts");

  return fileNames.map((fileName) => {
    const [_, slug] = fileName.match(/(.+)\.mdx$/)!;
    return slug;
  });
}

export async function getPostDetails() {

  const details = await Promise.all(
    getPostSlugs().map(async (slug) => {
      const { frontmatter } = await import(`posts/${slug}.mdx`);

      return {
        slug,
        subtitle: frontmatter.subtitle,
        posted: new Date(frontmatter.posted),
      };
    })
  );

  // sort reverse chronological
  details.sort((a, b) => (b.posted < a.posted ? -1 : 1));
  return details;
}
