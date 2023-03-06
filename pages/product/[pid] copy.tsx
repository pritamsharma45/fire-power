import React from "react";
import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ProductDetail from "../../components/ProductDetail";
import { Suspense } from "react";

const SingleProduct = gql`
  query Query($id: Int!) {
    product(id: $id) {
      id
      description
      image
      price
      title
      stockQuantity
    }
  }
`;

function ProductCard() {
  const router = useRouter();
  const { pid } = router.query;
  console.log(pid);
  const { data, loading, error } = useQuery(SingleProduct, {
    variables: { id: Number(pid) },
  });

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
        {/* <title>Product</title> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        {/* <div>
          <h1 className="text-4xl font-bold mb-4">Product</h1>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.product && (
            <div className="person">
              <ProductDetail
                id={data.product.id}
                title={data.product.title}
                description={data.product.description}
                price={data.product.price}
                image={data.product.image}
                stockQuantity={data.product.stockQuantity}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
