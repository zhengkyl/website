import { Book } from "./book";

export default function Page() {
  return (
    <div>
      <div>
        <p>
          I started drawing in December 2021. I had New Year Resolutions on my
          mind, and I put my pen to paper right there and then because important
          things should be done sooner rather than later.
        </p>
        <p>
          I was (and still am) awed by speed sketch artists on TikTok, street
          portrait artists in New York, and of course Kim Jung Gi. Drawing fast,
          without sketching, and with permanent ink— that's a thrill I can't get
          enough of.
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <Book />
      </div>
    </div>
  );
}
