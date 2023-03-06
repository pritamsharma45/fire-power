import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Product from "../components/Product";
import { Suspense } from "react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { selectCount, selectCartItems } from "../features/cart/cartSlice";

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
          price
          image
          stockQuantity
        }
      }
    }
  }
`;

function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllProducts, {
    variables: { first: 20 },
  });
  const [bottomLoading, setBottomLoading] = useState(false);
  // console.log(data);
  const cartItems = useAppSelector(selectCartItems);
  console.log("Cart items", cartItems);
  // Handle when product card is clicked

  if (loading)
    return (
      <p className="text-red-500 container mx-auto max-w-5xl my-5 px-5">
        Loading...
      </p>
    );
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data?.products.pageInfo;

  return (
    <div>
      <Head>
        <title>People</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div>
          <h1 className="text-4xl font-bold mb-4">Products</h1>
        </div>
      
        {/* <pre>{JSON.stringify(cartItems,null,2)}</pre> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.products.edges.map(({ node }, i) => (
            <div className="person h-auto w-70">
              <Product
                id={node.id}
                title={node.title}
                description={node.description}
                price={node.price}
                image={node.image}
                stockQuantity={node.stockQuantity}
              />
            </div>
          ))}
        </div>
        {/* To render spinner when data is being fetched */}
        {bottomLoading && (
          <p className="flex-center w-6 h-6 border-4 rounded-full animate-spin border-blue-500 border-t-blue-500 border-l-blue-500 border-b-blue-700 border-r-blue-700 border-t-gradient-to-r from-blue-400 to-blue-500 mx-auto my-10"></p>
        )}
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              setBottomLoading(true);
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prev, { fetchMoreResult }) => {
                  setBottomLoading(false);
                  // console.log("More", fetchMoreResult);
                  // console.log("Prev", prev);
                  // if (!fetchMoreResult) return prev;

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
          <p className="my-10 text-center font-medium">
            You've reached the end!
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
