import fs from "fs";

function getPostSlugs() {
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

      // Skip posts without posted frontmatter
      if (!frontmatter?.posted) {
        return null;
      }

      return {
        slug,
        posted: new Date(frontmatter.posted),
        desc: frontmatter.desc,
        image: frontmatter.image,
        tags: frontmatter.tags.split(","),
      };
    })
  );

  // Filter out null entries and sort reverse chronological
  const validDetails = details.filter((d) => d != null);
  validDetails.sort((a, b) => (b.posted < a.posted ? -1 : 1));
  return validDetails;
}
