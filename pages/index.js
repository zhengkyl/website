import Head from "next/head";
import Image from "next/image";
import AdaptiveImage from "../components/adaptiveImage";
import {
  Container,
  BigTitle,
  SectionTitle,
  SectionTitleWithBar,
  SplitAlign,
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

const StatusContainer = styled.div`
  // margin-left: 16px;
  // margin-right: 16px;
`;

const interestStyle = css`
  ${bpMq[0]} {
    display: flex;
    & > :first-child {
      min-width: 250px;
      margin-right: 32px;
    }
  }
  & > div {
    margin-top: 24px;
  }
`;

export default function Home() {
  return (
    <BaseLayout>
      <main>
        <Container>
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
          </InfoCard>
          <InfoCard imageSrc="/images/sentivents_splash.png" imageLeft>
            <h3>Sentivents</h3>
            <p>
              Mood tracking for the stressed Zoomer. Uses the open source
              DeepMoji model to gain nuanced insight into emotional state as
              represented by emojis.
            </p>
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
          <SplitAlign>
            <h4>Web Programmer</h4>
            <span>
              <b>
                <em>May 2020-Present</em>
              </b>
            </span>
          </SplitAlign>
          <p>
            At the PCLLAB, I collaborate with psychology researchers to develop
            custom online experiments.
          </p>
          <br />
          <p>
            I frequently create reusable experiment plugins and components using
            various Javascript libraries for experiment frontends, and I mostly
            rely upon MongoDB, NGINX, Node.js and a custom data interface to
            host and maintain experiment data.
          </p>
          <br />
          <p>
            Other tasks include setting up websites and creating documentation
            to maintain knowledge of lab programming procedures.
          </p>

          <SectionTitleWithBar>Education</SectionTitleWithBar>
          <SplitAlign>
            <h3>Purdue University</h3>
            <span>
              <b>
                <em>May 2023</em>
              </b>
            </span>
          </SplitAlign>
          <p>Bachelor of Science in Computer Science and Math</p>
          <p>Minor in Linguistics</p>

          <h6>Relevant Courses</h6>
          <p>
            Analysis of Algorithms, Systems Programming, Data Structures &
            Algorithms, Competitive Programming
          </p>

          <SectionTitleWithBar>Interests</SectionTitleWithBar>

          <small>
            Here you can see the song and movie I've listened to/watched most
            recently. Implemented using the Spotify and Movielo API.
          </small>
          <div css={interestStyle}>
            <StatusContainer>
              <LastPlayed />
              <LastWatched />
            </StatusContainer>
            <div>
              <h3>Competitive Programming</h3>
              <p>
                After a long day of programming, I like to relax with some
                competitve programming.
              </p>
              <h3>Watching Movies</h3>
              <p>
                This isn't really a hobby, but I obviously do it pretty often.
              </p>
            </div>
          </div>
        </Container>
      </main>
    </BaseLayout>
  );
}
