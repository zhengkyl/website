import { getPostSlugs } from "../util";

export function generateMetadata(props: { params: { slug: string } }) {
  return {
    title: `${props.params.slug.replaceAll("_", " ")} | kyle zheng`,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs();
}

export default async function Page({ params }) {
  // Webpack can't load arbitrary dynamic paths, must be limited
  // https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
  const MdxContent = (await import(`/posts/${params.slug}.mdx`)).default;

  return (
    <div>
      <MdxContent />
    </div>
  );
}
