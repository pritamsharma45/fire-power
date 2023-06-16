import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MovieDetailCard from "../../components/movieDetail";
import { gql, useQuery } from "@apollo/client";
import ScrollableProducts from "../../components/ScrollableProducts";
import ProductSimple from "../../components/ProductSimple";

const FETCH_PROMO_PRODUCTS = gql`
  query AllProducts {
    allProducts {
      id
      title
      price
      mrp
      description
      allergies
      policyType
      image
      stockQuantity
      likes {
        hasLiked
      }
    }
  }
`;

const MovieDetail = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const {
    data: promoData,
    loading: promoLoading,
    error: promoError,
  } = useQuery(FETCH_PROMO_PRODUCTS);
  console.log("PromoData", promoData);

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

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MovieDetailCard movie={movie} videos={videos} />
      <div className=" bg-gradient-to-b from-gray-500 to-gray-400 w-screen ">
        <h1 className="text-white text-2xl py-8 ml-8">You may also like</h1>
        <div className="flex flex-row gap-1 overflow-x-auto px-4 pb-8">
          {promoData?.allProducts?.map((product) => (
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
    </div>
  );
};

export default MovieDetail;
