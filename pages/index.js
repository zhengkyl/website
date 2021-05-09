
import AdaptiveImage from "../components/adaptiveImage";
import {
  Container,
  Chip,
  BigTitle,
  LinkButton,
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
  & > :first-child {
    margin-bottom: 24px;
  }
`;

const infoStyle = css`
  text-align:center;
  & > a{
    margin-bottom:24px;
  }
`
const ResumeButtonStyle = css`
display: block;
font-size:150%;
margin:auto;
  max-width:400px;
`

const ChipContainer = styled.div`
margin-top:8px;
margin-bottom:8px;
`

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
            A computer science student, not a pirate
          </Blurb>

          <AdaptiveImage
            src="/images/main_washed_960.png"
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
            <ChipContainer>
              <Chip>Material UI</Chip>
              <Chip>React</Chip>
              <Chip>Firebase</Chip>
              <Chip>REST API</Chip>
              <Chip>TheMovieDatabase</Chip>
            </ChipContainer>
          <LinkButton href="https://github.com/zhengkyl/movielo">Github</LinkButton>
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
            <LinkButton href="https://github.com/cyu0003/sentivents">Github</LinkButton>

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
            <LinkButton href="https://github.com/richzli/aitp-ccd-2020-jd">Github</LinkButton>
          </InfoCard>
          <InfoCard imageSrc="/images/kgg_splash.png" imageLeft>
            <h3>KGG Website</h3>
            <p>
              Responsive site for Kappa Gamma Gamma gaming community. 
            </p>
            <ChipContainer>
              <Chip>Material UI</Chip>
              <Chip>GatsbyJS</Chip>
            </ChipContainer>
            <LinkButton href="https://github.com/zhengkyl/kgg-website">Github</LinkButton>
            <LinkButton href="https://www.kgg.gg">KGG.GG</LinkButton>
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
              <h3>Linguistics</h3>
              <p>
                Languages are really cool. I'm still trying to learn my first one.
              </p>
              <h3>Data Visualization</h3>
              <p>
                {`I <3 charts and graphs.`}
              </p>
              
            </div>
          </div>
          <SectionTitleWithBar id="resume">Important Things</SectionTitleWithBar>
          <div css={infoStyle}>
            <LinkButton css={ResumeButtonStyle} href="resume.pdf">Resume.pdf</LinkButton>
            <h3>kylezheng73@gmail.com</h3>
          </div>
        </Container>
      </main>
    </BaseLayout>
  );
}
