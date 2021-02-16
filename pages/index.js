import Head from "next/head";
import Image from "next/image";
import { Container, BigTitle, SectionTitle } from "../components/basic";
import BaseLayout from "../components/baseLayout"
import LastPlayed from "../components/lastPlayed"
import styled from '@emotion/styled'

const Blurb = styled.h2`
  color:${props=>props.theme.colors.text};
  font-weight:400;
`

export default function Home() {
  return (
    <BaseLayout>
      <main>
        <Container>
          <LastPlayed/>
        <BigTitle>
          Ahoy! I'm Kyle Zheng.🦜
        </BigTitle>
          <Blurb>
            I'm a computer science student looking for a Summer 2021 internship.
          </Blurb>
          <Image
            src="/images/main_greenpink.png"
            alt="Picture of Kyle working"
            width={3990}
            height={1710}
            layout="responsive"
          />
          <SectionTitle>
            Projects
          </SectionTitle>
          <div>
            Sentivents
            <p>
            Collaborated on a mood tracker app based on the open source DeepMoji sentiment analysis model. 
            I worked on transforming and presenting emoji sentiment data using React Native chart libraries. Used breakdowns of positive, neutral, and negative sentiment to estimate and graph relative mood.

            </p>
          </div>

          

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
