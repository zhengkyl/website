import Image from "next/image";
import useSWR from "swr";

import styled from "@emotion/styled";

import { theme } from "../styles/global";
import fetcher from "../utils/fetcher";

const Card = styled.div`
  display: flex;
`;

const Relative = styled.div`
  position: relative;
`;

const MediaLink = styled.a`
  display: block;
  font-size: 120%;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const TitleText = styled.div`
  color: ${theme.colors.title};
  font-weight: 700;
`;

type StatusCardProps = {
  imgSrc: string;
  imgAlt: string;
  mediaUrl: string;
  mediaText: string;
  mediaSubtext?: string;
  imgWidth: number;
  imgHeight: number;
};

export default function StatusCard({
  imgSrc,
  imgAlt,
  mediaText,
  mediaUrl,
  mediaSubtext,
  imgWidth,
  imgHeight,
}: StatusCardProps) {
  return (
    <Card>
      <Relative>
        <Image
          src={imgSrc}
          alt={imgAlt}
          layout="fixed"
          height={imgHeight}
          width={imgWidth}
          // css={coverStyle}
        />
      </Relative>
      <div>
        <MediaLink href={mediaUrl}>{mediaText}</MediaLink>
        <span>{mediaSubtext}</span>
      </div>
    </Card>
  );
}

export function StatusBlock() {
  const { data: songData } = useSWR("/api/lastPlayed", fetcher);
  const { data: movieData } = useSWR("/api/lastWatched", fetcher);
  const movie = movieData ?? {
    imageUrl: "/images/zheng512.png",
    year: "2021",
    title: "Nothing watched",
  };
  const song = songData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    title: "Nothing playing",
    artist: "Kyle Zheng",
    playing: false,
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div>
        <TitleText>{song.playing ? "Now Playing" : "Last Played"}</TitleText>
        <StatusCard
          imgSrc={song.imageUrl}
          imgAlt="Song Album Cover"
          imgHeight={165}
          imgWidth={110}
          mediaUrl={song.link}
          mediaText={song.title}
          mediaSubtext={song.artist}
        />
      </div>
      <div>
        <div>
          <TitleText>Last Watched</TitleText>
          <StatusCard
            imgSrc={movie.imageUrl}
            imgAlt="Movie Poster"
            imgHeight={64}
            imgWidth={64}
            mediaUrl={movie.link}
            mediaText={movie.title}
            mediaSubtext={movie.year}
          />
        </div>
        <div>
          <TitleText>Latest Earworm</TitleText>
          <StatusCard
            imgSrc={movie.imageUrl}
            imgAlt="Movie Poster"
            imgHeight={64}
            imgWidth={64}
            mediaUrl={movie.link}
            mediaText={movie.title}
            mediaSubtext={movie.year}
          />
        </div>
      </div>
    </div>
  );
}
