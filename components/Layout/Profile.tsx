import { useState } from "react";
import {signOut, useSession } from "next-auth/react";

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const loggedUser = session.user;
  console.log("User Session",loggedUser.id);
  const loading = status === "loading";
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={user.image}
          alt="Profile image"
        />

        <svg
          className={`ml-2 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.5 9.5L10 13l3.5-3.5l1 1l-4.5 4.5l-4.5-4.5l1-1z" />
        </svg>
      </button>
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 ${
          isOpen ? "" : "invisible"
        }`}
      >
        <span className="block px-4 py-2 text-gray-800 text-xs">
          <small>Signed in as</small>
          <br />
          <small>
            <strong>{session.user.email || session.user.name}</strong>
          </small>
        </span>
        <hr />
        <a href="/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">
          Profile
        </a>
        <a href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">
          Orders
        </a>
        {/* <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-300">
          Settings
        </a> */}
        <a
          href={`/api/auth/signout`}
          className="block px-4 py-2 text-red-800 hover:bg-red-200"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Logout
        </a>
      </div>
    </div>
  );
}

export default ProfileDropdown;
