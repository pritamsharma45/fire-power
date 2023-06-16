import { useEffect, useState } from "react";
import Movie from "../components/movie";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTRkZGQxMTE1NTYzYTUxMTc3NmU4MjY4OGIzN2JjMyIsInN1YiI6IjY0ODg0Y2NiNmY4ZDk1MDExZjIzNzQ0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._j0EeKlTKueFcv135Ph26Bg0cL21HozyAxVrCb2At1I",
          },
        };

        const response = await fetch(
          "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
          options
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-2">
      <h1>Movies</h1>
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <>
            <Movie key={movie.id} movie={movie} />
          </>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
