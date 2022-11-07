import { useMemo } from "react";
import { getAllPostPaths, getPostData } from "../../lib/server/posts";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";
import BaseLayout from "../../components/BaseLayout";
import { Container } from "../../components/basic";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllPostPaths(),
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.slug as string);
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
      <BaseLayout>
        <Container>
          <h1>{frontmatter.title}</h1>
          <PostContent />
        </Container>
      </BaseLayout>
    </>
  );
};

export default Post;
