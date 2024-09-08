import { getPostSlugs } from "../util";

export function generateMetadata(props: { params: { slug: string } }) {
  return {
    title: `${props.params.slug.replaceAll("_", " ")} | kyle zheng`,
    openGraph: {
      images: `/posts/${props.params.slug}/og.jpg`
    }
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

const dateOptions = {
  month: "short",
  // day: "numeric",
  year: "numeric",
} as const;

const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions);

export default async function Page({ params }) {
  // Webpack can't load arbitrary dynamic paths, must have string literal parts
  // https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
  const { default: MdxContent, frontmatter } = await import(
    `/posts/${params.slug}.mdx`
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
