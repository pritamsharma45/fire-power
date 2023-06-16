import React from "react";

const MovieCard = ({ movie, movieClicked }) => {
  return (
    <div
      className="p-2 bg-gray-800 rounded-lg shadow-lg w-72 cursor-pointer"
      onClick={() => {
        movieClicked(movie);
      }}
    >
      <img
        className=" w-full rounded-lg"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="py-2  ">
        <div className="font-bold text-gray-200 text-md">{movie.title}</div>
        <p className="text-gray-200 text-sm">{movie.release_date}</p>
      </div>
    </div>
  );
};

export default MovieCard;
