import { Redis } from "@upstash/redis";
import { ReportView } from "./view";

export const revalidate = 60;

const redis = Redis.fromEnv();

const suffix = {
  0: "th",
  1: "st",
  2: "nd",
  3: "rd",
  4: "th",
  5: "th",
  6: "th",
  7: "th",
  8: "th",
  9: "th",
};

export default async function Page() {
  const views = (await redis.get<number>(["pageviews", "qr"].join(":"))) ?? 0;

  return (
    <div className="bg-[url(/images/4floss.gif)] bg-repeat bg-[length:30%_30%] h-screen w-screen">
      <div>you are the {`${views}${suffix[views % 10]}`} visitor</div>
      <ReportView />
    </div>
  );
}
