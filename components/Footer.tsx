import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-end gap-4 flex-wrap">
      <a
        href="https://github.com/zhengkyl"
        className="@hover-underline"
        target="_blank"
      >
        github
      </a>
      <a
        href="https://www.linkedin.com/in/zhengkyl/"
        className="@hover-underline"
        target="_blank"
      >
        linkedin
      </a>
      <Link href="./resume.pdf" className="@hover-underline" target="_blank">
        resume
      </Link>{" "}
    </footer>
  );
}
