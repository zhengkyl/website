import Link from "next/link";
import { getPostDetails } from "./util";

export const metadata = {
  title: "posts",
};

export default async function Page() {
  const posts = await getPostDetails();

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <li className="mb-8 group">
              <h2 className="text-2xl font-bold mt-4 mb-2 font-mono group-hover:(underline text-zinc-400) transition-colors cursor-pointer">
                /{post.slug.replaceAll("_", " ")}
              </h2>
              <h3 className="font-light italic text-stone-500 text-xl mt-2">
                {post.desc}
              </h3>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
