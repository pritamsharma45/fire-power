import React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Profile from "./Profile";
import Cart from "./cart";
import { useAppSelector } from "../../hooks/hooks";
import { selectCartItems } from "../../features/cart/cartSlice";
import { useRouter } from "next/router";

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const router = useRouter();
  const { data: session, status } = useSession();

  const cartItems = useAppSelector(selectCartItems);

  const loading = status === "loading";
  return (
    <header className="text-gray-600 body-font">
      <div className="flex flex-row  items-center justify-between bg-gray-800 p-2">
        <div className="flex items-center">
          <Link href="/">
            <a className="w-10 flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <Image
                src="/xxray-icon.png"
                alt="logo"
                width={50}
                height={50}
                className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
              />
            </a>
          </Link>
          <div className="md:flex md:flex-col md:items-start md:ml-4">
            <div className="md:text-5xl md:font-bold text-red-500 mx-2 mb-1">
              Fire Power
            </div>
            <div className="text-white text-xs mx-2">
              Everything Herbal - Natural testosterone boosters
            </div>
          </div>
        </div>

        <nav className="md:flex md:flex-row md:items-center mr-10 hidden">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center text-green-600 mr-10">
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
        {/* Hamburger menu */}
        <div className="md:hidden" onClick={handleToggleSidebar}>
          <svg
            className="w-6 h-6 fill-current text-gray-500 cursor-pointer"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            />
          </svg>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed z-10 inset-0 overflow-hidden transition-opacity ${
            sidebarVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gray-100 opacity-25"></div>
          <div
            className="fixed right-0 top-0 mt-2 mr-2 flex flex-col bg-slate-800 rounded-md shadow-lg w-56"
            onClick={handleToggleSidebar}
          >
            {/*  Sidebar collapse icon */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center" onClick={handleToggleSidebar}>
                <svg
                  className="w-6 h-6 fill-current text-gray-500 cursor-pointer"
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" d="M8 5l8 6-8 6z" />
                </svg>
              </div>
            </div>
            <Link href="/">
              <a
                className={`mx-2 block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white ${
                  router.pathname === "/" ? "text-green-50" : ""
                }`}
              >
                Home
              </a>
            </Link>
            <Link href="/about">
              <a
                className={`mx-2 block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white mr-10 ${
                  router.pathname === "/about" ? "text-green-50" : ""
                }`}
              >
                Contact Us
              </a>
            </Link>
            <div className="px-1 py-1 my-2">
              {!session && (
                <a
                  href={`/api/auth/signin`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                  Login
                </a>
              )}
              {session?.user && (
                <>
                  <Cart cartItems={cartItems} />
                </>
              )}
            </div>

            {/* Profile */}
            {session && (
              <div className={``}>
                <span className="block px-4 py-2 text-white text-sm">
                  <small>Signed in as</small>
                  <br />
                  <small>
                    <strong>
                      {session?.user?.email || session?.user?.name}
                    </strong>
                  </small>
                </span>
                <hr />
                <a
                  href="/user"
                  className="block px-4 py-2 text-white hover:bg-gray-300"
                >
                  Profile
                </a>
                <a
                  href="/orders"
                  className="block px-4 py-2 text-white hover:bg-gray-300"
                >
                  Orders
                </a>
                {/* <a
                href="#"
                className="block px-4 py-2 text-white hover:bg-gray-300"
              >
                Settings
              </a> */}
                <a
                  href={`/api/auth/signout`}
                  className="block px-4 py-2 text-red-600 font-bold bg-gray-300 hover:bg-red-200"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="md:flex md:items-center md:ml-4 hidden">
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
      </div>
    </header>

    // <header className="text-gray-600 body-font">
    //   <div className="flex items-center justify-between bg-gray-800 p-2">
    //     <Link href="/">
    //       <a className="w-32 flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
    //         <Image
    //           src="/xxray-icon.png"
    //           alt="logo"
    //           width={50}
    //           height={50}
    //           className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
    //         />
    //       </a>
    //     </Link>
    //     <div className="flex-row ">
    //       <div className=" w-72 mt-0 text-red-500  text-5xl font-bold mx-1 mb-1">
    //        Fire Power
    //       </div>
    //       <div className="text-white text-xs mx-2">Everything Herbal - Natural testerone boosters</div>
    //     </div>

    //     <nav className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center mr-10">
    //       <div className="flex flex-1 flex-row justify-center  text-green-600 mr-10">
    //         <Link href="/">
    //           <a
    //             className={`mx-10 block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white ${
    //               router.pathname === "/" ? "text-green-50" : ""
    //             }`}
    //           >
    //             Home
    //           </a>
    //         </Link>

    //         <Link href="/about">
    //           <a
    //             className={`block lg:inline-block lg:mt-0 text-teal-200 font-bold hover:text-white mr-10 ${
    //               router.pathname === "/about" ? "text-green-50" : ""
    //             }`}
    //           >
    //             Contact Us
    //           </a>
    //         </Link>
    //       </div>
    //     </nav>
    //     {/* {!session && (
    //       <div className="w-56">
    //       <span className="text-xs text-gray-400">You are not signed in!</span>
    //     </div>
    //     )} */}
    //     <div className="w-42 mt-2 mr-2">
    //       <p>
    //         {!session && (
    //           <>
    //             <div className="">
    //               <a
    //                 href={`/api/auth/signin`}
    //                 className="bg-blue-600 rounded-sm text-white px-4 py-1"
    //                 onClick={(e) => {
    //                   e.preventDefault();
    //                   signIn();
    //                 }}
    //               >
    //                 Login
    //               </a>
    //             </div>
    //           </>
    //         )}
    //         {session?.user && (
    //           <>
    //             <Cart cartItems={cartItems} />
    //           </>
    //         )}
    //       </p>
    //     </div>

    //     {session?.user && (
    //       <div>
    //         <Profile user={session.user} />
    //       </div>
    //     )}
    //   </div>
    // </header>
  );
};

export default Header;
