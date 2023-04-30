import Link from "next/link";
import { Container } from "./basic";

export default function Footer() {
  return (
    <Container className="py-8 mt-16">
      <footer className="flex justify-between flex-wrap items-center">
        <div className="flex gap-4">
          <a
            href="https://github.com/zhengkyl"
            className="hover:underline font-bold text-rose-200 highlight p-3"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/zhengkyl/"
            className="hover:underline font-bold text-rose-200 highlight p-3"
          >
            linkedin
          </a>
        </div>
        <p className="flex-grow text-right">
          made with{" "}
          <Link href="./images/broccoli.jpg" target="_blank">
            🥦
          </Link>{" "}
          •{" "}
          <a href="https://github.com/zhengkyl/website" target="_blank">
            open source
          </a>{" "}
          •{" "}
          <Link href="./resume.pdf" target="_blank">
            hire me
          </Link>
        </p>
      </footer>
    </Container>
  );
}
