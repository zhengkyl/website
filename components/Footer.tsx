import { Container } from "./basic";

export default function Footer() {
  return (
    <Container className="py-8 mt-16">
      <footer className="flex justify-between flex-wrap items-center">
        <div className="flex gap-4">
          <a
            href="https://github.com/zhengkyl"
            className="hover:underline font-bold text-pi highlight p-3"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/zhengkyl/"
            className="hover:underline font-bold text-pi highlight p-3"
          >
            linkedin
          </a>
        </div>
        <p className="flex-grow text-right">
          © 2022 made with <span className="font-bold highlight">{`<3`}</span>{" "}
          by Kyle Zheng
        </p>
      </footer>
    </Container>
  );
}
