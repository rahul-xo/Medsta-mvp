import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/Stores/authStore.js";
import { useLocationStore } from "@/Stores/locationStore.js";
import { FaMapMarkerAlt } from "react-icons/fa";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const doSignOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const place = useLocationStore((s) => s.place);
  const initLocation = useLocationStore((s) => s.initFromStorage);
  const requestLocation = useLocationStore((s) => s.requestLocation);

  useEffect(() => {
    initLocation();
  }, [initLocation]);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Outer fixed container */}
      <div className="w-full h-16 fixed flex justify-center items-center top-0 left-0 z-50 bg-white/90 backdrop-blur-sm shadow-md px-4 sm:px-6 lg:px-8">
        {/* Inner container for max-width and centering */}
        <div className="w-full max-w-7xl flex justify-between items-center">

          {/* Left Logo */}
          <div className="shrink-0 flex items-center">
            <NavLink to={user ? (role === 'patient' ? '/patient-dashboard' : '/provider-dashboard') : '/'}>
              <img
                // Adjusted height slightly, kept width settings for responsiveness
                className="h-15 w-40 sm:w-48 md:w-56 object-contain"
                src="../Images/logo.png"
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* Center Menu: flex-1 ensures it pushes logo left and buttons right WITHIN the inner container */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-10 text-md text-gray-800">
              <Link to="/#services">
                <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
                  Services
                </li>
              </Link>
              <NavLink to="/about">
                <li className="font-medium cursor-pointer text-[#009cfb] hover:text-blue-600 transition-colors">
                  About
                </li>
              </NavLink>
              <NavLink to="/policies">
                <li className="font-medium cursor-pointer text-[#009cfb] hover:text-blue-600 transition-colors">
                  Policies
                </li>
              </NavLink>
              <li className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
                Contact
              </li>
            </ul>
          </div>

          {/* Right Side - Cart / Profile */}
          <div className="hidden md:flex items-center gap-4 relative">
            {/* Location indicator */}
            <button
              onClick={requestLocation}
              title={place ? `Current location: ${place}` : "Set location"}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FaMapMarkerAlt className="text-blue-600" />
              <span className="truncate max-w-[200px]" aria-live="polite">
                {place || "Set location"}
              </span>
            </button>
            <NavLink
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FaShoppingCart />
              <span>Cart</span>
            </NavLink>

            {/* Auth: show login/signup OR compact profile icon */}
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="bg-transparent text-[#009cfb] font-semibold px-4 py-2 cursor-pointer rounded-md hover:bg-blue-50 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 cursor-pointer rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className="ml-1">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-200"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  {/* Simple avatar icon; could be replaced with user.photoURL */}
                  <FaUserCircle className="text-2xl text-gray-700" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-1">
                    <NavLink
                      to={role === 'patient' ? '/patient-dashboard' : '/provider-dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile Dashboard
                    </NavLink>
                    <NavLink
                      to={role === 'patient' ? '/patient-dashboard?tab=orders' : '/provider-dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Orders
                    </NavLink>
                    <NavLink
                      to="/policies"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Manage Refund
                    </NavLink>
                    <NavLink
                      to="/about"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Need Help
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Edit Profile
                    </NavLink>
                    <NavLink
                      to="/about"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Refer & Earn
                    </NavLink>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div> {/* End Inner container */}

        {/* Mobile Menu Button - Stays outside inner container for edge placement */}
        <div className="md:hidden flex items-center absolute right-4 sm:right-6 lg:right-8"> {/* Positioned absolutely */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div> {/* End Outer fixed container */}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-40 flex flex-col items-center justify-center gap-8">
          <ul className="flex flex-col gap-6 text-xl text-gray-800 text-center">
            <button
              onClick={() => { requestLocation(); setIsMenuOpen(false); }}
              className="mx-auto flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FaMapMarkerAlt className="text-blue-600" />
              <span>{place || "Set location"}</span>
            </button>
            <Link to="/#services">
              <li className="font-semibold cursor-pointer">Services</li>
            </Link>
             <NavLink to="/about" onClick={() => setIsMenuOpen(false)}> {/* Close menu on navigate */}
              <li className="font-semibold cursor-pointer">About</li>
             </NavLink>
             <NavLink to="/policies" onClick={() => setIsMenuOpen(false)}> {/* Close menu on navigate */}
              <li className="font-semibold cursor-pointer">Policies</li>
             </NavLink>
            <li className="font-semibold cursor-pointer">Contact</li>
          </ul>
          <div className="flex flex-col gap-4 w-4/5">
            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)} /* Close menu */
              className="flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FaShoppingCart />
              <span>Cart</span>
            </NavLink>
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)} /* Close menu */
                  className="bg-transparent text-blue-600 border border-blue-600 font-semibold px-4 py-2 rounded-md text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)} /* Close menu */
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={role === 'patient' ? '/patient-dashboard' : '/provider-dashboard'}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md text-center"
                >
                  Profile Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;