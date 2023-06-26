const getJoinSymbol = (index: number, length: number) => {
  if (length < 2 || index >= length - 1) return "";

  if (length === 2 && index === 0) return " and ";

  return ", ";
};

interface SongProps {
  title: string;
  link: string;
  artists: { name: string; link: string }[];
}
// Punctation like '.' or ',' needs to be inside inline-block span or it will wrap separately
export default function Song(song: SongProps) {
  return (
    <span>
      <span className="inline-block">
        "
        <a
          className="hover:underline font-bold"
          href={song.link}
          target="_blank"
        >
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
        </span>
      ))}
    </span>
  );
}
