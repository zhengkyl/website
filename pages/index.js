import Head from "next/head";
import Image from "next/image";
import AdaptiveImage from "../components/adaptiveImage"
import {
  Container,
  BigTitle,
  SectionTitle,
  SectionTitleWithBar,
} from "../components/basic";
import BaseLayout from "../components/baseLayout";
import InfoCard from "../components/infoCard";
import { LastPlayed, LastWatched } from "../components/statusCards";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { bpMq } from "../styles/global";
const Blurb = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-weight: 400;
  font-size: 175%;
  ${bpMq[0]} {
    font-size: 200%;
  }
  ${bpMq[1]} {
    font-size: 250%;
  }
  ${bpMq[2]} {
    font-size: 300%;
  }
`;

export default function Home() {
  return (
    <BaseLayout>
      <main>
        <Container>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            {/* <LastPlayed/>
          <LastWatched/> */}
          </div>
          <BigTitle>
            Ahoy there! 🦜
            <br />
            I'm Kyle Zheng.
          </BigTitle>
          <Blurb>
            I'm a computer science student looking for a Summer 2021 internship.
          </Blurb>

          <AdaptiveImage
            src="/images/main_greenpink.png"
            alt="Picture of Kyle working"
            height={400}
            objectPosition="60%"
          />

          <SectionTitleWithBar>Projects</SectionTitleWithBar>

          <InfoCard imageSrc="/images/movielo_splash.png">
            <h3>Movielo</h3>
            <p>
              A movie ranking web app inspired by <em>The Social Network</em> as
              well as a love of charts, rankings, and visualizations.
            </p>
            {/* <Image
            src="/images/movielo_splash.png"
            alt="Movielo project"
            width={400}
            height={300}
            layout="intrinsic"
          /> */}
          </InfoCard>
          <InfoCard imageSrc="/images/sentivents_splash.png" imageLeft>
            <h3>Sentivents</h3>
            <p>
              Mood tracking for the stressed Zoomer. Uses the open source
              DeepMoji model to gain nuanced insight into emotional state as
              represented by emojis.
            </p>
            {/* <Image
            src="/images/sentivents_splash.png"
            alt="Sentivents project"
            width={400}
            height={300}
            layout="intrinsic"
          /> */}
          </InfoCard>
          <InfoCard imageSrc="/images/farmassist_splash.png">
            <h3>FarmAssist</h3>
            <p>
              Web dashboard for combine harvesters. Data playback allows speed
              and yield metric analysis. 1st in Computing Day John Deere
              Challenge.
            </p>
          </InfoCard>
          <SectionTitleWithBar>Experience</SectionTitleWithBar>
          <h3>Purdue Cognition and Learning Lab</h3>
          <h4>Web Programmer</h4>

          <SectionTitleWithBar>Education</SectionTitleWithBar>
          <h3>Purdue University</h3>
          <p>B.S. in Computer Science and Math, Minor in Linguistics</p>
          <h6>Relevant Courses</h6>
          <p>
            Analysis of Algorithms, Systems Programming, Data Structures &
            Algorithms, Competitive Programming
          </p>

          <SectionTitleWithBar>Interests</SectionTitleWithBar>
          <p>
            After a long day of programming, I like to wind down with some
            competitive programming.
          </p>
          <p>
            I like graphing movies and shows I watch. Here's all the anime I've
            watched.
          </p>
          <p>Spotify</p>
          <p>Discord status/current game</p>
        </Container>
      </main>
    </BaseLayout>
  );
}
