import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MovieDetailCard from "../../components/movieDetail";
import { gql, useQuery } from "@apollo/client";
import ScrollableProducts from "../../components/ScrollableProducts";
import ProductSimple from "../../components/ProductSimple";
import { useSession } from "next-auth/react";
import { LoginPopupModal } from "../movies";
import { TIME_OUT_IN_MINUTES } from "../../utils/helper";


const FETCH_PROMO_PRODUCTS = gql`
  query Query {
    promoProducts {
      product {
        title
        stockQuantity
        price
        mrp
        image
        description
        id
      }
    }
  }
`;

const MovieDetail = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const {
    data: promoData,
    loading: promoLoading,
    error: promoError,
  } = useQuery(FETCH_PROMO_PRODUCTS);
  console.log("PromoData", promoData);

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
  }, []);


  useEffect(() => {
    if (session?.user) {
      setIsModalOpen(false);
      return;
    };
    // Check if the expiration time is saved in localStorage
    const movieExpirationTime = localStorage.getItem("movieExpirationTime");

    if (!movieExpirationTime) {
      // If there's no expiration time in localStorage, set the default timeout to 5000 milliseconds (5 seconds)
      setTimeout(() => {
        setIsModalOpen(true);
      }, TIME_OUT_IN_MINUTES * 60 * 1000);
    } else {
      // Calculate the remaining time until expiration
      const remainingTime = parseInt(movieExpirationTime) - Date.now();

      // Check if remainingTime is positive (not expired)
      if (remainingTime > 0) {
        setTimeout(() => {
          setIsModalOpen(true);
        }, remainingTime);
      } else {
        // If it's already expired, open the modal immediately
        setIsModalOpen(true);
      }
    }
  }, []);


  useEffect(() => {
    const fetchMovie = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTRkZGQxMTE1NTYzYTUxMTc3NmU4MjY4OGIzN2JjMyIsInN1YiI6IjY0ODg0Y2NiNmY4ZDk1MDExZjIzNzQ0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._j0EeKlTKueFcv135Ph26Bg0cL21HozyAxVrCb2At1I",
        },
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,

          options
        );
        const data = await response.json();
        setVideos(data.results);

        const response2 = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          options
        );
        const data2 = await response2.json();
        setMovie(data2);
      } catch (error) {
        console.error(error);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const onLoginBtnClick = () => {
    setIsModalOpen(false);
    router.push("/api/auth/signin");
    localStorage.removeItem("movieExpirationTime");
  }
  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MovieDetailCard movie={movie} videos={videos} />
      <div className=" bg-gradient-to-b from-gray-500 to-gray-400 w-screen ">
        <h1 className="text-white text-2xl py-8 ml-8">You may also like</h1>
        <div className="flex flex-row gap-1 overflow-x-auto px-4 pb-8">
          {promoData?.promoProducts?.map(({ product }) => (
            <ProductSimple
              key={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              mrp={product.mrp}
              image={product.image}
              id={product.id}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </div>
      </div>

      {/* <h1>{movie.title}</h1> */}
      {/* <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      /> */}
      {/* <p>{movie.release_date}</p>
      <p>{movie.overview}</p>
      <pre>{JSON.stringify(movie, null, 2)}</pre> */}
      {isModalOpen && (
        <LoginPopupModal onLoginclick={onLoginBtnClick} />
      )}
    </div>
  );
};

export default MovieDetail;
