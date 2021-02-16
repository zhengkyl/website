import useSWR from "swr";
import Image from "next/image";
import styled from "@emotion/styled"
import { css, jsx } from '@emotion/react'
async function fetcher(...args) {
  const response = await fetch(...args);
  return response.json();
}
const PlayCard = styled.div`
  display:flex;
  flex-direction:row;
`
const infoStyle = css`
  display:flex;
  flex-direction:column;
  justify-content:center;
  margin-left:8px;
`
const coverStyle= css`
  border-radius:2px;
`
const linkStyle=css`
  font-weight:600;
  &:hover {
    text-decoration:underline;
  }
`
export default function LastPlayed() {
  const { data, error } = useSWR("/api/last-played", fetcher);
  const song = data
    ? data
    : {
        imageUrl: "/images/zheng512.png",
        link: "kylezhe.ng",
        title: "Nothing playing",
        artist: "Kyle Zheng",
        playing: false,
      };
  return (
    <>
      <h5>{song.playing ? "Now Playing" : "Last Played"}</h5>
      <PlayCard>
        <Image
          src={song.imageUrl}
          alt="Song Album Cover"
          width={48}
          height={48}
          layout="fixed"
          css={coverStyle}
        />
        <div css={infoStyle}>
          <a css={linkStyle}href={song.link}>{song.title}</a>
          <span>{song.artist}</span>
        </div>
      </PlayCard>
    </>
  );
}
