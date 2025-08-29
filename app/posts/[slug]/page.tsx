import type { Metadata } from "next";
import { getPostDetails } from "../util";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
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
  const posts = await getPostDetails();
  return posts.map((post) => ({ slug: post.slug }));
}

const dateOptions = {
  month: "short",
  // day: "numeric",
  year: "numeric",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

export default async function Page({ params }) {
  const { slug } = await params;
  // Webpack can't load arbitrary dynamic paths, must have string literal parts
  // https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
  const { default: MdxContent, frontmatter } = await import(
    `/posts/${slug}.mdx`
  );
  return (
    <>
      <h3 className="text-xl font-light italic text-stone-500">
        {frontmatter.desc}
      </h3>
      <div className="text-right text-sm text-stone-500 pb-4">
        <div>Posted {dateFormat.format(Date.parse(frontmatter.posted))}</div>
        {frontmatter.edited && (
          <div>
            Last edited {dateFormat.format(Date.parse(frontmatter.edited))}
          </div>
        )}
      </div>
      <article className="flex flex-col gap-4">
        <MdxContent />
      </article>
    </>
  );
}
