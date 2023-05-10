import Head from "next/head";
import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Product from "../components/Product";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { selectCartItems, updateCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

const AllProducts = gql`
  query allProductsQuer($first: Int, $after: Int) {
    products(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          description
          allergies
          price
          image
          stockQuantity
          likes {
            hasLiked
          }
        }
      }
    }
  }
`;

const FETCH_CART = gql`
  query Query($userId: String!) {
    cartByUserId(userId: $userId) {
      id
      items
    }
  }
`;

function Home() {
  const { data: session, status } = useSession();
  console.log("Session", session);
  let userId = null;
  if (session) {
    userId = session?.user?.id;
    console.log("Session", session.user);
  }

  const { data, loading, error, fetchMore } = useQuery(AllProducts, {
    variables: { first: 21 },
  });
  const [bottomLoading, setBottomLoading] = useState(false);

  // Handle when product card is clicked
  const dispatch = useDispatch();
  // Fetch cart form server
  const {
    data: cartFromDB,
    loading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery(FETCH_CART, {
    variables: {
      userId: session?.user?.id,
    },
  });
  console.log("Cart items fetched from DB", cartFromDB);
  let cartfromDB = cartFromDB?.cartByUserId?.items;

  useEffect(() => {
    if (cartfromDB !== undefined) {
      dispatch(updateCart(cartfromDB));
    }
  }, [dispatch, cartfromDB]);

  const cartItems = useAppSelector(selectCartItems);
  console.log("Cart items", cartItems);

  if (loading)
    return (
      <p className="text-red-500 container mx-auto max-w-5xl my-5 px-5 min-h-screen">
        Loading...
      </p>
    );
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data?.products.pageInfo;
  console.log("Data", data);

  return (
    <div>
      <Head>
        <title>Xtreme Passion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-4">Xtreme Passion</h1>
          <Link href="/wholesale">
            <button className="bg-blue-600 text-white rounded-lg px-4 h-8">
              Wholesale Agents
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.products.edges.map(({ node }, i) => {
            const inCartBl = cartItems.find((item) => item.id === node.id);
            return (
              <div className="person h-auto" key={node.id}>
                <Product
                  id={node.id}
                  title={node.title}
                  description={node.description}
                  allergies={node.allergies}
                  price={node.price}
                  image={node.image}
                  stockQuantity={node.stockQuantity}
                  hasLiked={node.likes[0]?.hasLiked}
                  userId={userId}
                  inCart={inCartBl}
                />
              </div>
            );
          })}
        </div>
        {/* To render spinner when data is being fetched */}
        {bottomLoading && (
          <p className="flex-center w-6 h-6 border-4 rounded-full animate-spin border-blue-500 border-t-blue-500 border-l-blue-500 border-b-blue-700 border-r-blue-700 border-t-gradient-to-r from-blue-400 to-blue-500 mx-auto my-10"></p>
        )}
        {data?.products.pageInfo.hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              setBottomLoading(true);
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prev, { fetchMoreResult }) => {
                  setBottomLoading(false);

                  fetchMoreResult.products.edges = [
                    ...prev.products.edges,
                    ...fetchMoreResult.products.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            Load more
          </button>
        ) : (
          <p className="my-10 text-center font-medium text-red-600 py-1 bg-red-100 rounded-lg">
            You've reached the end!
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
