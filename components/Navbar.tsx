import { Container } from "./basic";

export default function Navbar() {
  // Negative margin matches height of Navbar, Container xy padding +

  return (
    <>
      {/* <div className="sticky top-0 h-[4.25rem] sm:h-[6.25rem] bg-gradient-to-b from-white via-[#ff00fff9]"></div> */}
      <Container classNames="sticky top-0 mb-[-4.25rem] sm:mb-[-6.25rem]">
        <span className="text-3xl whitespace-nowrap font-bold">Kyle Zheng</span>
      </Container>
    </>
  );
}
