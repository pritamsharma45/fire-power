import React, { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { gql } from "@apollo/client";
import ScrollableProducts from "../components/ScrollableProducts";

const MovieDetailCard = ({ movie, videos }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const backdropStyle = {
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
  };
  const openModal = (video) => {
    setModalOpen(true);
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="flex flex-row w-screen bg-black text-white ">
        <div className="w-1/3">
          <div className="ml-20 py-8 px-4 ">
            <img
              className="w-96 h-auto rounded-xl"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
          {/* <div className="w-1/2 h-auto relative">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div> */}
        </div>
        <div className="w-full pr-8">
          <div className="h-full flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-100">
              {movie.title}
            </h1>
            <div className="mb-4">
              <span className="text-gray-400 mb-4 mr-4">
                Release Date: {movie.release_date}
              </span>
              |
              <span className="text-gray-400 mb-4 mx-4">
                Certificate:{movie.adult ? " [A]" : " [R]"}
              </span>
            </div>
            {/* <p className="text-gray-400 mb-4">{movie.release_date}</p> */}
            <button
              className=" text-white w-44 p-2 my-4 bg-gray-800 hover:bg-gray-700 rounded-lg flex flex-row  font-semibold text-sm"
              onClick={() => openModal(videos[0])}
            >
              <span>
                <FaPlayCircle className="mr-2 w-6 h-6 text-pink-500" />
              </span>
              <span>Play Trailer</span>
            </button>
            <p className="text-md mb-6 text-gray-400 w-3/4">{movie.overview}</p>
            <p className="text-green-400 mr-8">Rating: {movie.vote_average}</p>
            {/* <div className="flex justify-between items-center">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold text-sm"
              >
                Visit Website
              </a>
            
            </div> */}
          </div>
        </div>
        {/* <pre>{JSON.stringify(videos, null, 2)}</pre> */}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
            <div className="absolute inset-0 bg-black opacity-75"></div>
            <div className="relative z-10 w-1/2 h-96">
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={closeModal}
              >
                &times;
              </button>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                title="Trailer"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        )}
      </div>
      <div className="mt-0 px-4 py-4 bg-gray-800 overflow-x-scroll whitespace-nowrap">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative inline-block mr-4 cursor-pointer w-52"
            onClick={() => openModal(video)}
          >
            <img
              className="w-48 h-auto  rounded-md"
              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
              alt={video.name}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPlayCircle className="text-gray-400 text-opacity-50 text-2xl opacity-15 hover:text-gray-400" />
            </div>
            <div>
              <p className="w-48 text-gray-400 text-xs mt-2 truncate">
                {video.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieDetailCard;
