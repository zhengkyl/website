import { css } from "@emotion/react";
import styled from "@emotion/styled";

import BaseLayout from "../components/BaseLayout";
import {
  BigTitle,
  Chip,
  Container,
  LinkButton,
  SectionTitleWithBar,
  SplitAlign,
} from "../components/basic";
import InfoCard from "../components/InfoCard";
import { StatusBlock } from "../components/StatusCard";
import Wordle from "../components/wordle";
import { bpMq } from "../styles/global";

const StatusContainer = styled.div`
  & > :first-child {
    margin-bottom: 24px;
  }
`;

const ChipContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const infoStyle = css`
  text-align: center;
  & > a {
    margin-bottom: 24px;
  }
`;
const resumeButtonStyle = css`
  display: block;
  font-size: 150%;
  margin: auto;
  max-width: 400px;
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

const MediaBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Home() {
  return (
    <BaseLayout>
      <main>
        <Container>
          <BigTitle>Hello, 芥兰, 👋🥦</BigTitle>
          <br />
          <br />
          <small>
            Here you can see the song and movie I've listened to/watched most
            recently. Implemented using the Spotify and Movielo API.
          </small>
          <StatusBlock />

          <SectionTitleWithBar>Projects</SectionTitleWithBar>

          <InfoCard imageSrc="/images/movielo_splash.png">
            <h3>Movielo</h3>
            <p>
              A movie ranking web app inspired by <em>The Social Network</em> as
              well as a love of charts, rankings, and visualizations.
            </p>
            <ChipContainer>
              <Chip>Material UI</Chip>
              <Chip>React</Chip>
              <Chip>Firebase</Chip>
              <Chip>REST API</Chip>
              <Chip>TheMovieDatabase</Chip>
            </ChipContainer>
            <LinkButton href="https://github.com/zhengkyl/movielo">
              Github
            </LinkButton>
          </InfoCard>
          <InfoCard imageSrc="/images/sentivents_splash.png" imageLeft>
            <h3>Sentivents</h3>
            <p>
              Mood tracking app for the stressed Zoomer. Uses the open source
              DeepMoji model to gain nuanced insight into emotional state as
              represented by emojis.
            </p>
            <ChipContainer>
              <Chip>React Native</Chip>
              <Chip>react-native-chart-kit</Chip>
              <Chip>pyTorch</Chip>
              <Chip>BoilerMake8</Chip>
            </ChipContainer>
            <LinkButton href="https://github.com/cyu0003/sentivents">
              Github
            </LinkButton>
          </InfoCard>
          <InfoCard imageSrc="/images/farmassist_splash.png">
            <h3>FarmAssist</h3>
            <p>
              Web dashboard for combine harvesters. Data playback allows speed
              and yield metric analysis. 1st in Computing Day John Deere
              Challenge.
            </p>
            <ChipContainer>
              <Chip>Leaflet.js</Chip>
              <Chip>Chart.js</Chip>
              <Chip>pyTorch</Chip>
              <Chip>BoilerMake8</Chip>
            </ChipContainer>
            <LinkButton href="https://github.com/richzli/aitp-ccd-2020-jd">
              Github
            </LinkButton>
          </InfoCard>
          <SectionTitleWithBar>Experience</SectionTitleWithBar>
          <SplitAlign>
            <h3>Purdue University</h3>
            <span>
              <b>
                <em>May 2023</em>
              </b>
            </span>
          </SplitAlign>
          <p>Bachelor of Science in Computer Science and Math</p>
          <br />
          <br />
          <br />
          <h3>Tulip</h3>
          <SplitAlign>
            <h4>Software Engineer Intern</h4>
            <span>
              <b>
                <em>May 2022 - Aug 2022</em>
              </b>
            </span>
          </SplitAlign>

          <p>
            As part of the App team, I worked on improving the core product, a
            low/no-code platform to create manufacturing and frontline
            operations software. I worked on enhancing the app editor. I owned
            adding rich text functionality to existing text, which invovled
            creating the user interface for rich text editing and integrating
            and updating existing logic to deal with multilingual rich text.
          </p>
          <br />

          <h3>LifeOmic</h3>
          <SplitAlign>
            <h4>Software Engineer Intern</h4>
            <span>
              <b>
                <em>May 2021 - Aug 2021</em>
              </b>
            </span>
          </SplitAlign>

          <p>
            I worked with a few members of the Wellness Product team to
            implement a new transactions management and history feature. As I
            worked on creating the necessary front-end interfaces (React), I was
            able to test and influence the emerging API. After continous
            iteration cycles with feedback from the team, I ultimately presented
            the working interface to company shareholders.
            <br />
            <br />
            With my remaining time, I was also able to prototype ideas such as
            data visualizations based on the transactions and share them with
            the team as potential future features.
          </p>

          <h3>Purdue Cognition and Learning Lab</h3>
          <SplitAlign>
            <h4>Web Programmer</h4>
            <span>
              <b>
                <em>May 2020 - Present</em>
              </b>
            </span>
          </SplitAlign>
          <p>
            Here I help researchers create bespoke experiments that are run in
            the browser (jsPsych).
            <br />
            <br />
            All the gathered data is stored in a MongoDB database and made
            available through a custom experiment management web application
            (Angular, Express). This evolving project continues to grow as I add
            new features to make it easier to manage experiments.
            <br />
            <br />
            Besides experiments, I also handle the various websites and
            documentation needed for the lab (MkDocs, docusaurus).
          </p>

          <SectionTitleWithBar>Remember my name?</SectionTitleWithBar>
          <Wordle words={["KYLE", "ZHENG"]} />
        </Container>
      </main>
    </BaseLayout>
  );
}
