import Image from "next/image";
import runsImg from "../../../public/images/runs.jpg";

export const metadata = {
  title: "runs | kyle zheng"
}

export default function Page() {
  return (
    <>
      <p className="my-4">
        This is me after finishing the 2022 Purdue Boilermaker Half Marathon.
      </p>
      <Image
        src={runsImg}
        alt="Me after finishing the 2022 Purdue Boilermaker Half Marathon"
      />
      <p className="my-4">
        I was really slow back then, but now I'm much slower.
      </p>
    </>
  );
}
