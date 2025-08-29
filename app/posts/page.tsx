import type { Metadata } from "next";
import Link from "next/link";
import { getPostDetails } from "./util";

export const metadata: Metadata = {
  title: "posts",
};

export default async function Page() {
  const posts = await getPostDetails();

  return (
    <div>
      <p>Some things I've written.</p>
      <ul>
        {posts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <li className="mb-8 group">
              <h2 className="text-2xl font-bold mt-4 mb-2 font-mono group-hover:(underline text-zinc-400) transition-colors cursor-pointer">
                /{post.slug.replaceAll("_", " ")}
              </h2>
              <div className="flex flex-wrap gap-2 items-center text-stone-500 mt-2">
                <h3 className="font-light italic text-xl pr-1">{post.desc}</h3>
                {post.tags.map((tag) => {
                  return (
                    <div
                      className="border-stone-400 border text-sm px-1 data-[interactive=true]:text-orange data-[high-effort=true]:text-purple"
                      data-interactive={tag === "interactive"}
                      data-high-effort={tag === "high effort"}
                      key={tag}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
