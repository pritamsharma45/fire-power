import { useEffect, useState } from "react";
import Movie from "../components/movie";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { TIME_OUT_IN_MINUTES } from "../utils/helper";

const MOVIE_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY;

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setIsModalOpen(false);
      return;
    };
    // Check if the expiration time is saved in localStorage
    const movieExpirationTime = localStorage.getItem("movieExpirationTime");
    // If it's not in localStorage or it has expired, open the modal

    if (!movieExpirationTime) {
      const newmovieExpirationTime = Date.now() + TIME_OUT_IN_MINUTES * 60 * 1000;
      localStorage.setItem("movieExpirationTime", newmovieExpirationTime.toString());
    } else {
      // Remove this part if you do not want to see the popup again on refresh
      if (Date.now() > parseInt(movieExpirationTime)) {
        setIsModalOpen(true);
      }
    }
  }, [session]);


  useEffect(() => {
    if (session?.user) {
      setIsModalOpen(false);
      return;
    };
    // Check if the expiration time is saved in localStorage
    const movieExpirationTime = localStorage.getItem("movieExpirationTime");

    if (!movieExpirationTime && !session?.user) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, TIME_OUT_IN_MINUTES * 60 * 1000);
    } else {
      // Calculate the remaining time until expiration
      const remainingTime = parseInt(movieExpirationTime) - Date.now();

      // Check if remainingTime is positive (not expired)
      if (remainingTime > 0 && !session?.user) {
        setTimeout(() => {
          setIsModalOpen(true);
        }, remainingTime);
      } else {
        // If it's already expired, open the modal immediately
        setIsModalOpen(true);
      }
    }
  }, [session]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              `Bearer ${MOVIE_API_KEY}`,
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

  const handleMovieClick = (movie) => {
    console.log("movie", movie);
    // goto route /movie/[movieId]
    router.push(`/movie/${movie.id}`);
  };
  const onLoginBtnClick = () => {
    setIsModalOpen(false);
    router.push("/api/auth/signin");
    localStorage.removeItem("movieExpirationTime");
  }

  return (
    <>
      <div className="pl-8 p-4  bg-gray-700">
        <div className=" grid grid-cols-4 gap-4">
          {movies.map((movie) => (
            <>
              <Movie
                key={movie.id}
                movie={movie}
                movieClicked={handleMovieClick}
              />
            </>
          ))}

          {/* {<pre>{JSON.stringify(movies, null, 2)}</pre>} */}
        </div>
      </div>
      {isModalOpen && (
        <LoginPopupModal onLoginclick={onLoginBtnClick} />
      )}
    </>
  );
};


export const LoginPopupModal = ({ onLoginclick }) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full  p-4 overflow-x-hidden overflow-y-auto md:inset-0 flex justify-center ">
        <div className="relative  bg-gray-600 rounded-lg shadow dark:bg-gray-700 w-2/3 h-2/3 mt-10 opacity-90">

          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-white dark:text-white">
              Please consider login to continue
            </h3>
            {/* <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button> */}
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button type="button" onClick={onLoginclick} className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default MoviesPage;
