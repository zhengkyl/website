import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-end gap-4 flex-wrap">
      <a
        href="https://github.com/zhengkyl"
        className="font-playfair font-black text-rose-600 @hover-text-rose-400 transition"
        target="_blank"
      >
        github
      </a>
      <a
        href="https://www.linkedin.com/in/zhengkyl/"
        className="font-playfair font-black text-rose-600 @hover-text-rose-400 transition"
        target="_blank"
      >
        linkedin
      </a>
      <Link
        href="./resume.pdf"
        className="font-playfair font-black text-rose-600 @hover-text-rose-400 transition"
        target="_blank"
      >
        resume
      </Link>{" "}
    </footer>
  );
}
