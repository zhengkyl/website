import { getCollection } from "astro:content";

/** Posts with a `posted` date; drafts without one are excluded everywhere. */
export async function getPostedPosts() {
  return (await getCollection("posts")).filter((post) => post.data.posted);
}
