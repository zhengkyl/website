import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-between flex-wrap items-center">
      <div className="flex gap-4">
        <a
          href="https://github.com/zhengkyl"
          className="hover:underline"
          target="_blank"
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/zhengkyl/"
          className="hover:underline"
          target="_blank"
        >
          linkedin
        </a>
        <Link href="./resume.pdf" className="hover:underline" target="_blank">
          resume
        </Link>{" "}
      </div>
      <div className="flex-grow text-right">
        <Link
          href="./images/broccoli.jpg"
          className="hover:underline"
          target="_blank"
        >
          made with 🥦
        </Link>
      </div>
    </footer>
  );
}
