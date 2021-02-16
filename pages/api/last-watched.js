import {getLastWatched} from "../../server/movielo"

export default async function(_, res) {
  const response = await getLastWatched()

  //TODO status check
  const results = await response.json()
  const movie = results.data[0]
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.posterPath}`

  return res.status(200).json(
    {
      title:movie.title,
      imageUrl:posterUrl,
      year:movie.year,
    }
  )
}