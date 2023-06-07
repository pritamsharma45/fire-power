import React from "react";
import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram } from "react-icons/fa";

export default function Footer() {
  const MediaIcons = [
    {
      icon: <FaFacebook />,
      url: "https://www.facebook.com/profile.php?id=100091973694729",
    },
    {
      icon: <FaTwitter />,
      url: "https://twitter.com/LJoint22454",
    },
    {
      icon: <FaWhatsapp />,
      url: "https://wa.me/447817094075",
    },
    {
      icon: <FaTelegram />,
      url: "https://t.me/+Paa7IUttf7U5NjI0",
    },
  ];

  return (
    <footer className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-col items-center justify-between">
        <div className="text-gray-500 text-sm mb-4 md:mb-0">
          © 2023 Love Joint. All rights reserved.
        </div>
        <div className="flex items-center mt-2 space-x-4">
          <a
            href="/privacyPolicy"
            className="text-gray-500 hover:text-gray-700 text-xs transition-colors duration-200"
          >
            Privacy & Cookie Policy
          </a>
        </div>
        <div className="flex items-center mt-2 space-x-4">
          {MediaIcons.map((item, index) => (
            <a key={index} href={item.url}>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
