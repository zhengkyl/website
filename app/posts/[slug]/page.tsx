import { getPostSlugs } from "../util";

export async function generateMetadata({ params: { slug } }) {
  // destructure triggers unsupported server component error
  const frontmatter = (await import(`/posts/${slug}.mdx`)).frontmatter;
  return {
    title: slug.replaceAll("_", " "),
    openGraph: {
      images: `/posts/${slug}/${frontmatter.image}`,
      description: frontmatter.desc,
    },
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return await Promise.all(
    getPostSlugs().map(async (slug) => {
      return { slug };
    })
  );
}

const dateOptions = {
  month: "short",
  // day: "numeric",
  year: "numeric",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

export default async function Page({ params: { slug } }) {
  // Webpack can't load arbitrary dynamic paths, must have string literal parts
  // https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
  const { default: MdxContent, frontmatter } = await import(
    `/posts/${slug}.mdx`
  );
  return (
    <>
      <div className="font-light italic text-stone-500 text-xl pb-4">
        {dateFormat.format(Date.parse(frontmatter.posted))}
      </div>
      <article className="flex flex-col gap-4">
        <MdxContent />
      </article>
    </>
  );
}
