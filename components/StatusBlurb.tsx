"use client";

import useSWR from "swr";

import fetcher from "../utils/fetcher";

const getJoinSymbol = (index: number, length: number) => {
  if (length < 2 || index >= length - 1) return "";

  if (length === 2 && index === 0) return " and ";

  return ", ";
};

const impressions = [
  [
    [
      "It was not a movie he would recommend.",
      "It was a movie worth watching.",
    ],
    ["It was an unexpectedly fun movie.", "It was an unexpected gem."],
  ],
  [
    [
      "It fell short of expectations.",
      "As expected, it was a movie worth watching.",
    ],
    ["It was a fun movie.", "It lived up to the hype and more."],
  ],
];

const getMovieImpression = (fun_before, fun_during, fun_after) => {
  return impressions[+fun_before][+fun_during][+fun_after];
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
      <span className="inline-block whitespace-pre-wrap" key={artist.link}>
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
    fun_before: boolean;
    fun_during: boolean;
    fun_after: boolean;
  };
  punctuation?: string;
}
const InlineMovie = ({ movie }: MovieProps) => (
  <span>
    <a
      className="hover:underline italic font-bold"
      href={movie.link}
      target="_blank"
    >
      {movie.title}
    </a>
    {". "}
    <span className="inline-block">
      {getMovieImpression(movie.fun_before, movie.fun_during, movie.fun_after)}
    </span>
  </span>
);

const StatusBlurb = ({ movieData }) => {
  const { data: songData } = useSWR("/api/lastPlayed", fetcher);
  const { data: likeData } = useSWR("/api/lastLiked", fetcher);

  const movie = movieData;

  const song = songData ?? {
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
    playing: false,
  };
  const like = likeData ?? {
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:gap-3 text-3xl leading-10">
        <div>
          <h1 className="whitespace-nowrap font-bold highlight text-3xl leading-10">
            Kyle Zheng
          </h1>
        </div>
        <div className="flex flex-col gap-16 font-medium">
          <p>
            {`${song.playing ? "is" : "was"}`} listening to{" "}
            <InlineSong song={song} punctuation="," /> and he really likes{" "}
            <InlineSong song={like} punctuation="." />
          </p>
          <p>
            recently watched <InlineMovie movie={movie} />
          </p>
          <p>needs to update this website but got distracted.</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-16 sm:gap-3 text-3xl leading-10">
        {/* Take up row space when flex row, display:none on mobile */}
        <span className="whitespace-nowrap hidden sm:block sm:invisible font-bold">
          Kyle Zheng
        </span>
      </div>
    </>
  );
};

export default StatusBlurb;
