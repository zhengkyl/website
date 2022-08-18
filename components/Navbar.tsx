import styled from "@emotion/styled";

import { Container } from "./basic";

const NavContainer = styled(Container.withComponent("nav"))`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export default function Navbar() {
  return (
    <NavContainer>
      {/* <Image
        src="/images/zheng512.png"
        alt="Home"
        width={32}
        height={32}
        layout="fixed"
      /> */}
      <div>
        {/* <AnchorLink href="#resume">Resume</AnchorLink>
        <AnchorLink href="#resume">Contact</AnchorLink> */}
      </div>
    </NavContainer>
  );
}
