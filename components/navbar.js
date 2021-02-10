import { Container, BigTitle, SectionTitle } from "../components/basic";
import Image from "next/image";
import { jsx } from "@emotion/react";
import styled from '@emotion/styled'

const NavContainer = styled(Container.withComponent("nav"))`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
`

const AnchorLink = styled.a`
  color:${props=>props.theme.colors.title};
  font-size:125%;
  font-weight:600;
  padding:8px;
  &:last-child {
    margin-right:-8px;
  }
`

export default function Navbar() {
  return (
    <NavContainer>
      <Image
        src="/images/zheng512.png"
        alt="Home"
        width={32}
        height={32}
        layout="fixed"
      />
      <div>
        <AnchorLink href="resume">Resume</AnchorLink>
        <AnchorLink href="contact">Contact</AnchorLink>
      </div>
    </NavContainer>
  );
}
