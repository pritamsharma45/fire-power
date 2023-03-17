import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import Profile from "./Profile";
import Cart from "./cart";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import {  selectCartItems } from "../../features/cart/cartSlice";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const cartItems = useAppSelector(selectCartItems);

  const loading = status === "loading";
  return (
    <header className="text-gray-600 body-font">
      <div className="flex items-center justify-between bg-gray-800 p-2">
        <Link href="/">
          <a className="w-32 flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <Image
              src="/xxray-icon.png"
              alt="logo"
              width={50}
              height={50}
              className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
            />
          </a>
        </Link>
        <div className="flex-row ">
          <div className=" w-72 mt-0 text-red-500  text-5xl font-bold mx-1 mb-1">
           Fire Power
          </div>
          <div className="text-white text-xs mx-2">Everything Herbal - Natural testerone boosters</div>
        </div>

        <nav className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center mr-10">
          <div className="flex flex-1 flex-row justify-center  text-green-600 mr-10">
            <Link href="/">
              <a
                className={`mx-10 block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white ${
                  router.pathname === "/" ? "text-green-50" : ""
                }`}
              >
                Home
              </a>
            </Link>

            <Link href="/about">
              <a
                className={`block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white mr-10 ${
                  router.pathname === "/about" ? "text-green-50" : ""
                }`}
              >
                Contact Us
              </a>
            </Link>
          </div>
        </nav>
        {!session && (
          <div className="w-56">
          <span className="text-xs text-gray-400">You are not signed in!</span>
        </div>
        )}
        <div className="w-42 mt-2 mr-2">
          <p>
            {!session && (
              <>
                <div className="">
                  <a
                    href={`/api/auth/signin`}
                    className="bg-blue-600 rounded-sm text-white px-4 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      signIn();
                    }}
                  >
                    Login
                  </a>
                </div>
              </>
            )}
            {session?.user && (
              <>
                <Cart cartItems={cartItems} />
              </>
            )}
          </p>
        </div>

        {session?.user && (
          <div>
            <Profile user={session.user} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
