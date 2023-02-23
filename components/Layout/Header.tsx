import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
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
        <nav>
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <div className="flex flex-wrap items-center text-base justify-center">
              <Link href="/">
                <div className="nav-link mr-5 hover:text-gray-900">Home</div>
              </Link>
              <Link href="/about">
                <div className="nav-link mr-5 hover:text-gray-900">
                  Contact Us
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
