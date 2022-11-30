import Link from "next/link";

import BaseLayout from "../components/BaseLayout";
import { Container, SplitAlign } from "../components/basic";
import StatusBlurb from "../components/StatusBlurb";
import Wordle from "../components/Wordle";
import { getLatestReviewAndMovie } from "../lib/server/movielo";

export async function getServerSideProps() {
  const movieData = await getLatestReviewAndMovie();
  return {
    props: { movieData },
  };
}

export default function Home({ movieData }) {
  return (
    <BaseLayout>
      <Container className="mt-32">
        <StatusBlurb movieData={movieData} />
      </Container>
      <Container>
        <div className="flex justify-evenly mt-32">
          <Link href="/posts">
            <a className="text-2xl p-4 font-bold text-rose-200 highlight hover:underline">
              /posts
            </a>
          </Link>
          <Link href="/projects">
            <a className="text-2xl p-4 font-bold text-rose-200 highlight hover:underline">
              /projects
            </a>
          </Link>
        </div>

        <h2 className="mt-32">Experience</h2>
        <hr />

        <SplitAlign className="mt-16">
          <h3>Purdue University</h3>
          <span className="font-bold">May 2023</span>
        </SplitAlign>
        <h4 className="highlight">B.S. Computer Science and Math</h4>

        <SplitAlign className="mt-16">
          <h3>Purdue Cognition and Learning Lab</h3>
          <span className="font-bold">May 2020 - Present</span>
        </SplitAlign>
        <h4 className="highlight">Web Programmer</h4>
        <p className="leading-loose">
          I help psychology researchers create online psychology experiments. I
          inherited a cl*sterfuck of aged and poorly documented custom web apps,
          websites, and services, and rebuilt it into a modern experience for
          users and developers. I put effort into documentation and
          maintainability, so these tools can be passed on to future programmers
          and researchers.
        </p>

        <SplitAlign className="mt-16">
          <h3>Tulip</h3>
          <span className="font-bold">May 2022 - Aug 2022</span>
        </SplitAlign>
        <h4 className="highlight">Software Engineer Intern</h4>
        <p className="leading-loose">
          I worked on improving the core product, a web-based low/no-code editor
          for frontline operations. Apart from enhancing features and
          accessibility of existing UI, I owned adding editable rich text to the
          editor. This involved a creating a custom WYSIWYG editing interface
          and updating the internal text format, all while integrating with the
          existing multilingual text features.
        </p>
        <br />

        <SplitAlign className="mt-16">
          <h3>LifeOmic</h3>
          <span className="font-bold">May 2021 - Aug 2021</span>
        </SplitAlign>
        <h4 className="highlight">Software Engineer Intern</h4>

        <p className="leading-loose">
          I worked on creating the frontend for a new transactions management
          and spending history feature. I tested and gave feedback on the
          emerging API and prototyped data visualizations for spending
          breakdowns.
        </p>

        <h2 className="mt-32">Remember my name?</h2>
        <hr />
        <Wordle words={["KYLE", "ZHENG"]} />
      </Container>
    </BaseLayout>
  );
}
