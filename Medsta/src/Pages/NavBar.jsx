import React from "react";

const NavBar = () => {
  return (
    <div className="w-full fixed flex justify-between p-3 items-center top-0 left-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="logo flex items-center gap-0.5 tracking-widest text-xl font-semibold">
        <img className="h-auto w-30" src="/Images/logo.png" alt="Logo" />
      </div>
      <div className="Navigation py-2 px-6">
        <ul className="flex gap-6 text-[16px] text-gray-700">
          <li className="tracking-wide font-semibold cursor-pointer hover:text-blue-600 transition-colors">
            Features
          </li>
          <li className="tracking-wide font-semibold cursor-pointer hover:text-blue-600 transition-colors">
            About
          </li>
          <li className="tracking-wide font-semibold cursor-pointer hover:text-blue-600 transition-colors">
            Policies
          </li>
          <li className="tracking-wide font-semibold cursor-pointer hover:text-blue-600 transition-colors">
            Contact
          </li>
        </ul>
      </div>
      <div className="Authenticate">
        <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 cursor-pointer rounded-md hover:bg-blue-50 transition-colors">
          Login
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-md ml-2 hover:bg-blue-600 transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default NavBar;
