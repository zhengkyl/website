import { Container, BigTitle, SectionTitle } from "../components/basic";
import Image from "next/image";

export default function Navbar() {
  return (
    <Container>
      <Image
            src="/images/zheng512.png"
            alt="Home"
            width={32}
            height={32}
            layout="fixed"
          />
      <a href="resume">Resume</a>
      <a href="contact">Contact</a>
    </Container>
  )
}