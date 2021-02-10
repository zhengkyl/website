import Head from "next/head";
import Image from "next/image";
import { Container, BigTitle, SectionTitle } from "../components/basic";
import BaseLayout from "../components/baseLayout"

export default function Home() {
  return (
    <BaseLayout>
      <main>
        <Container>
        <BigTitle>
          Ahoy!🦜<br/>
          This is Kyle Zheng.
        </BigTitle>
          <Image
            src="/images/main_greenpink.png"
            alt="Picture of Kyle working"
            width={3990}
            height={1710}
            layout="responsive"
          />


          <p>
            I'm studying computer science and math at Purdue University. Also, I'm looking for an internship for Summer 2021.
          </p>
          <SectionTitle>
            Projects
          </SectionTitle>

          Sentivents

          FarmAssist



          Movielo
          Purdue Buildings???

          <SectionTitle>
            Work
          </SectionTitle>
          <h3>
            Purdue Cognition and Learning Lab
          </h3>
          <p>

          </p>
          <SectionTitle>
            Education
          </SectionTitle>
          <h3>
            Purdue University, West Lafayette
          </h3>
          <p>
            B.S. in Computer Science and Math, Minor in Linguistics
          </p>
          <h3>
          Relevant Courses
          </h3>  
          <p>
            Analysis of Algorithms, Systems Programming, Data Structures & Algorithms, Competitive Programming
          </p>
          
          <SectionTitle>
            Interests
          </SectionTitle>
          <p>
            After a long day of programming, I like to wind down with some competitive programming.
          </p>
          <p>
            I like graphing movies and shows I watch. Here's all the anime I've watched.
          </p>
          <p>
            Spotify
          </p>
          <p>
            Discord status/current game
          </p>
        </Container>
      </main>
    </BaseLayout>
  );
};
