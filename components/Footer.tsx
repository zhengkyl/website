import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-end gap-4 flex-wrap">
      <a
        href="https://github.com/zhengkyl"
        className="@hover-underline font-semibold text-rose-600"
        target="_blank"
      >
        github
      </a>
      <a
        href="https://www.linkedin.com/in/zhengkyl/"
        className="@hover-underline font-semibold text-rose-600"
        target="_blank"
      >
        linkedin
      </a>
      <a
        href="./resume.pdf"
        className="@hover-underline font-semibold text-rose-600"
        target="_blank"
      >
        resume
      </a>{" "}
    </footer>
  );
}
