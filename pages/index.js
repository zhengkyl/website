import Head from "next/head";
import Image from "next/image";
import { Container, BigTitle, SectionTitle } from "../components/basic";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Kyle Zheng</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <BigTitle>
          Ahoy!🦜<br/>
          You've found Kyle Zheng
        </BigTitle>
        <Container>
          <Image
            src="/images/main_greenpink.png"
            alt="Picture of Kyle working"
            width={3990}
            height={1710}
            layout="responsive"
          />
        </Container>
        <Container>
          <SectionTitle>
            Projects
          </SectionTitle>
          <SectionTitle>
            Work
          </SectionTitle>
          <SectionTitle>
            Education
          </SectionTitle>
          <p>
            B.S. in Computer Science, Math, Minor in Linguistics
          </p>
          <h3>
          Relevant Courses
          </h3>  
          <p>
            Analysis of Algorithms, Systems Programming, Data Structures & Algorithms, Competitive Programming
          </p>
          I'm studying computer science and math.

        </Container>
      </main>

      <footer></footer>
    </div>
  );
};
