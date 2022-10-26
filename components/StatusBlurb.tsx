import useSWR from "swr";

import fetcher from "../utils/fetcher";

const getJoinSymbol = (index: number, length: number) => {
  if (length < 2 || index >= length - 1) return "";

  if (length === 2 && index === 0) return " and ";

  return ", ";
};

interface SongProps {
  song: {
    title: string;
    link: string;
    artists: { name: string; link: string }[];
  };
  punctuation?: string;
}
// Punctation like '.' or ',' needs to be inside inline-block span or it will wrap separately
const InlineSong = ({ song, punctuation }: SongProps) => (
  <span>
    <span className="inline-block">
      "
      <a className="hover:underline font-bold" href={song.link}>
        {song.title}
      </a>
      "
    </span>{" "}
    by{" "}
    {song.artists.map((artist, i) => (
      <span className="inline-block" key={artist.link}>
        <a
          className="hover:underline font-bold"
          href={artist.link}
          target="_blank"
        >
          {artist.name}
        </a>
        {getJoinSymbol(i, song.artists.length)}
        {i === song.artists.length - 1 && punctuation}
      </span>
    ))}
  </span>
);

interface MovieProps {
  movie: {
    title: string;
    link: string;
  };
  punctuation?: string;
}
const InlineMovie = ({ movie, punctuation }: MovieProps) => (
  <span className="inline-block">
    <a className="hover:underline italic font-bold" href={movie.link}>
      {movie.title}
    </a>
    {punctuation ?? ""}
  </span>
);

export const StatusBlurb = () => {
  const { data: movieData } = useSWR("/api/lastWatched", fetcher);
  const { data: songData } = useSWR("/api/lastPlayed", fetcher);
  const { data: likeData } = useSWR("/api/lastLiked", fetcher);

  const movie = movieData ?? {
    imageUrl: "/images/zheng512.png",
    link: "",
    year: "2022",
    title: "nothing",
  };
  const song = songData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
    playing: false,
  };
  const like = likeData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-16 sm:gap-3 text-3xl leading-10">
        <div
          className="h-auto self-start sticky top-0 pt-32 -mt-32 mb-[-4rem] sm:mb-[-6.5rem] w-full sm:w-auto"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,0) 100%)",
          }}
        >
          <h1 className="whitespace-nowrap font-bold highlight text-3xl leading-10">
            Kyle Zheng
          </h1>
        </div>
        <div className="flex flex-col gap-16 font-medium">
          <p className="snap-start">
            {`${song.playing ? "is" : "was"}`} listening to{" "}
            <InlineSong song={song} punctuation="," /> and he really likes{" "}
            <InlineSong song={like} punctuation="." />
          </p>
          <p className="snap-start snap-always">
            recently watched <InlineMovie movie={movie} punctuation="." /> It
            was fun and definitely worth watching.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-16 sm:gap-3 text-3xl leading-10">
        {/* Take up row space when flex row, display:none on mobile */}
        <span className="whitespace-nowrap hidden sm:block sm:invisible font-bold">
          Kyle Zheng
        </span>
        <div className="font-medium">
          <p className="snap-start snap-always">
            develops web apps, because the web is{" "}
            <span className="font-bold">cross-platform,</span>{" "}
            <span className="font-bold">accessible,</span> and{" "}
            <span className="font-bold">more performant than ever.</span>
          </p>
        </div>
      </div>
    </>
  );
};
