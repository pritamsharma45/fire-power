import React from "react";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import ProductDetail from "../../components/ProductDetail";

const SingleProduct = gql`
  query Query($id: Int!) {
    product(id: $id) {
      id
      description
      allergies
      policyType
      image
      price
      mrp
      title
      stockQuantity
      likes {
        hasLiked
      }
      extraImages {
        image
        description
      }
    }
  }
`;
const Fetch_User_CART = gql`
  query Query($userId: String!) {
    cartByUserId(userId: $userId) {
      items
    }
  }
`;

function ProductCard() {
  // user session
  const { data: session } = useSession();
  const router = useRouter();
  const { pid } = router.query;
  console.log(pid);

  const { data, loading, error } = useQuery(SingleProduct, {
    variables: { id: Number(pid) },
  });

  console.log("Single Product in pid.tsx", data);
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(Fetch_User_CART, {
    variables: { userId: session?.user?.id },
  });

  const inCartBl = cartData?.cartByUserId?.items?.some(
    (item) => item.id === Number(pid)
  );
  console.log("inCartBl", inCartBl);

  if (loading)
    return (
      <p className="text-red-500 container mx-auto max-w-5xl my-5 px-5">
        Loading...
      </p>
    );
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      <Head>
        <title>{data?.product.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        {data?.product && (
          <div>
            <ProductDetail
              id={data.product.id}
              title={data.product.title}
              description={data.product.description}
              allergies={data.product.allergies}
              policyType={data.product.policyType}
              price={data.product.price}
              mrp={data.product.mrp}
              image={data.product.image}
              stockQuantity={data.product.stockQuantity}
              isLiked={data.product.likes[0]?.hasLiked}
              inCart={inCartBl}
              extraImages={data.product.extraImages}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
