import React, { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full h-16 fixed flex justify-between items-center top-0 left-0 z-50 bg-white/90 backdrop-blur-sm shadow-md px-4 sm:px-6">
        <div className="logo w-20 overflow-hidden flex items-center gap-1 text-xl font-semibold">
          <img className="h-[90px] w-[90px]" src="../Images/logo.svg" alt="Logo" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-md text-gray-800">
            <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
              Features
            </li>
            <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
              About
            </li>
            <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
              Policies
            </li>
            <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
              Contact
            </li>
          </ul>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-transparent text-blue-600 font-semibold px-4 py-2 cursor-pointer rounded-md hover:bg-blue-50 transition-colors">
            Login
          </button>
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 cursor-pointer rounded-md hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-40 flex flex-col items-center justify-center gap-8">
          <ul className="flex flex-col gap-8 text-xl text-gray-800 text-center">
            <li className="font-semibold cursor-pointer">Features</li>
            <li className="font-semibold cursor-pointer">About</li>
            <li className="font-semibold cursor-pointer">Policies</li>
            <li className="font-semibold cursor-pointer">Contact</li>
          </ul>
          <div className="flex flex-col gap-4 w-4/5">
            <button className="bg-transparent text-blue-600 border border-blue-600 font-semibold px-4 py-2 rounded-md">
              Login
            </button>
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;

