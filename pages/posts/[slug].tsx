import { useMemo } from "react";
import { getAllPostPaths, getPostData } from "../../lib/posts";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllPostPaths(),
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.slug);
  return {
    props: {
      ...postData,
    },
  };
};

const Post = ({ code, frontmatter }) => {
  const PostContent = useMemo(() => getMDXComponent(code), [code]);

  return (
    <>
      <p>Post title</p>
      <PostContent />
    </>
  );
};

export default Post;
