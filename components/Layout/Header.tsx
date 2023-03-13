import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import styles from "./header.module.css";
import Profile from "./Profile";
import Cart from "./cart";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { selectCount, selectCartItems } from "../../features/cart/cartSlice";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const count = useAppSelector(selectCount);
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
            {/* <svg
              className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg> */}
          </a>
        </Link>
        <div className="flex-row">
          <div className="block lg:inline-block lg:mt-0 text-red-500  text-5xl font-bold mx-2 mb-1">
            Xxray
          </div>
          <div className="text-white text-xs mx-2">Everything Herbal</div>
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
                <Cart count={count} cartItems={cartItems} />
                {/* <span
                  style={{ backgroundImage: `url(${session.user.image})` }}
                  className={styles.avatar}
                />
                <span className={styles.signedInText}>
                  <small>Signed in as</small>
                  <br />
                  <small>{session.user.email || session.user.name}</small>
                </span>
                <a
                  href={`/api/auth/signout`}
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a> */}
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
