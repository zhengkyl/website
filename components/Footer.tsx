import styled from "@emotion/styled";

import { Container } from "./basic";

const FooterContainer = styled(Container.withComponent("footer"))`
  margin-top: 64px;
  text-align: center;
  & :last-child {
    margin-top: 16px;
    display: block;
  }
`;
const SocialLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
  padding: 8px;
  margin-left: 16px;
  margin-right: 16px;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <SocialLink href="https://github.com/zhengkyl">Github</SocialLink>
      <SocialLink href="https://www.linkedin.com/in/zhengkyl/">
        LinkedIn
      </SocialLink>
      <small>{`Made with <3 by Kyle Zheng`}</small>
    </FooterContainer>
  );
}
