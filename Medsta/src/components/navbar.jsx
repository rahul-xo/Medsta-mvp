import { useState } from 'react';
// Assuming the logo is available relative to src/components/
// This path is correct based on the original structure: src/assets/react.svg
import logo from '../assets/react.svg'; 

/**
 * Simple navigation link component.
 */
const NavLink = ({ href, children, onClick }) => (
  <a href={href} className="nav-link" onClick={onClick}>
    {children}
  </a>
);

/**
 * Responsive Navbar component with links, action button, and Auth buttons.
 */
const Navbar = () => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Function to toggle the mobile menu state
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Array of main navigation links
  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="navbar">
      {/* Logo Section (Left) */}
      <div className="navbar-logo-container">
        <img src={logo} className="logo-img" alt="Medsta Logo" />
        <span className="logo-name">Medsta</span>
      </div>

      {/* Primary Navigation Links (Center - Desktop Only) */}
      <div className="nav-links">
        {links.map((link) => (
          <NavLink key={link.name} href={link.href}>
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Action and Auth Buttons (Right - Desktop Only) */}
      <div className="navbar-actions">
        {/* WhatsApp Order Button */}
        <a href="https://wa.me/YOUR_PHONE_NUMBER" target="_blank" rel="noopener noreferrer" className="whatsapp-button">
          {/* WhatsApp Icon (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 mr-2 fill-current">
            <path d="M380.9 97.1C339.2 59.3 283.8 40 227.3 40c-117 0-211.8 95.8-211.8 213.6 0 38.6 10.3 75 29.8 107.5l-33.6 123.5 127.3-32.9c30.8 16.9 64.6 25.8 99.3 25.8h.1c117 0 211.8-95.8 211.8-213.6 0-56.5-20.5-111-58.7-152.8zM227.3 446.7c-29.3 0-57.9-7.9-82.7-22.9l-5.6-3.3-57.2 14.7 15-55.6-3.6-5.9c-16.7-27.4-25.5-59.3-25.5-92.4 0-98.3 79.9-178.2 178.6-178.2 47.9 0 92.5 19.4 125.7 51.1 33.2 31.7 51.5 75.3 51.5 121.7 0 98.3-80 178.2-178.6 178.2zM337.3 294.4c-6.8-3.4-38.3-18.7-44.2-20.8-5.8-2.1-10.1-3.2-14.4 3.2-4.3 6.4-16.5 20.8-20.2 25.1-3.7 4.3-7.4 4.8-14.2 1.6-6.8-3.2-28.7-10.6-54.8-33.8-20.3-17.9-34-40.2-38.1-47.1-4.1-6.8-0.4-10.1 3.2-13.4 3.4-3.2 7.5-8.4 11.3-12.6 3.7-4.1 4.9-7.2 6.8-11.3 1.9-4.1.9-7.8-0.5-10.8-1.4-3-12.7-30.7-17.4-42.1-4.6-11.4-9.3-9.9-14.4-10.1-4.9-0.2-10.4-0.1-15.9 0-5.5 0-14.4 6.4-21.8 14.8-7.4 8.4-28.2 27.5-28.2 67 0 39.5 29.3 77.3 33.5 83.1 4.2 5.8 57.8 88.3 138.6 120.3 79.4 30.6 79.4 20.2 93.3 18.9 13.9-1.3 44.2-18.1 50.4-35.4 6.2-17.3 6.2-16.1 4.3-30.1-1.9-14-6.8-22-11.1-29.4z"/>
          </svg>
          WhatsApp Order
        </a>

        <NavLink href="#login" className="login-button">Login</NavLink>
        <NavLink href="#signup" className="signup-button">Signup</NavLink>
      </div>

      {/* Mobile Menu Button (Right - Mobile Only) */}
      <button className="menu-button" onClick={toggleMenu}>
        {isMenuOpen ? (
          // Close Icon (X) 
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Menu Icon (Hamburger) 
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

       {/* Mobile Menu Overlay */}
       <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink key={`mobile-${link.name}`} href={link.href} onClick={toggleMenu}>
              {link.name}
            </NavLink>
          ))}
          <div className="mobile-actions">
              <NavLink href="#login" className="login-button-mobile" onClick={toggleMenu}>Login</NavLink>
              <NavLink href="#signup" className="signup-button-mobile" onClick={toggleMenu}>Signup</NavLink>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;

### `react:Update App to use Navbar:src/App.jsx`
```jsx


### `css:Navbar Stylesheet:src/App.css`
```css
:root {
  /* Define a variable for the navbar logo size for consistency */
  --navbar-logo-size: 2.5em; 
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  /* Reset padding to prevent side-scrolling/layout issues with fixed navbar */
  padding: 0; 
  text-align: center;
}

/* Base Navbar Styles (Desktop First) */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  background-color: #ffffff; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed; /* Keep it at the top when scrolling */
  top: 0;
  left: 0;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box; /* Ensure padding doesn't affect total width */
}

/* Logo and Name Styling */
.navbar-logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  /* Override default link color if logo container is a link */
  color: inherit; 
}

.logo-img {
  height: var(--navbar-logo-size);
  width: auto;
  padding: 0; 
  transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: rotate(10deg);
}

.logo-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6; /* Primary blue for brand */
}

/* Navigation Links (Desktop) */
.nav-links {
  display: flex;
  gap: 2rem;
  font-size: 1rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
  border-radius: 4px; /* Added for general aesthetic */
}

/* Underline effect for links */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -5px;
  left: 0;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link:hover::after {
  width: 100%;
}

/* Action Buttons Container */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* WhatsApp Button */
.whatsapp-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #25d366; /* WhatsApp Green */
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(37, 211, 102, 0.4);
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  border: none;
}

.whatsapp-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(37, 211, 102, 0.6);
  background-color: #1DA853; /* Slightly darker green on hover */
  color: white; 
}

.whatsapp-button svg {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
    fill: currentColor;
}

/* Login/Signup Buttons */
.login-button, .signup-button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.login-button {
  border: 2px solid #3b82f6;
  color: #3b82f6;
  background-color: transparent;
}

.login-button:hover {
  background-color: #3b82f6;
  color: white;
}

.signup-button {
  background-color: #3b82f6;
  color: white;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.signup-button:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 6px 12px rgba(37, 99, 235, 0.5);
}

/* Mobile Menu Button & Responsiveness */
.menu-button {
  display: none; /* Hide on desktop */
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1010; 
  border-radius: 8px;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: #f3f4f6;
}

.menu-button svg {
    color: #3b82f6;
    height: 1.75rem;
    width: 1.75rem;
}

/* ------------------ Mobile Styles ------------------ */
@media (max-width: 1024px) {
  /* Hide desktop elements */
  .nav-links, .navbar-actions {
    display: none;
  }
  
  /* Show menu button */
  .menu-button {
    display: block; 
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 0; 
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(5px);
    overflow-y: auto; /* Allow scrolling for long menus */
    transition: width 0.3s ease-in-out;
    padding-top: 80px; /* Space for the logo/close button */
    z-index: 1005;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .mobile-menu-overlay.open {
    width: 80%; /* Takes up 80% of the screen width */
    max-width: 350px; /* Capping max width for larger screens */
    box-shadow: -6px 0 15px rgba(0, 0, 0, 0.15);
  }

  .mobile-menu-overlay .nav-link {
      display: block;
      font-size: 1.25rem;
      padding: 1rem 0;
      width: 80%;
      text-align: center;
      color: #333;
      margin: 0.5rem 0;
      transition: background-color 0.2s;
  }
  
  .mobile-menu-overlay .nav-link:hover {
      background-color: #f1f1f1;
  }
  
  .mobile-menu-overlay .nav-link::after {
      /* Remove desktop underline effect on mobile */
      display: none; 
  }


  .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
      width: 80%;
  }

  .login-button-mobile, .signup-button-mobile {
      width: 100%;
      text-align: center;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: background-color 0.2s, color 0.2s;
  }
  
  .login-button-mobile {
      border: 2px solid #3b82f6;
      color: #3b82f6;
      background-color: transparent;
  }
  
  .signup-button-mobile {
      background-color: #3b82f6;
      color: white;
  }
}
/* --------------------------------------------------- */


/* Adjust main content to avoid overlap with fixed navbar */
/* Calculation: Navbar padding (1rem top + 1rem bottom) + Logo height (2.5em) + some extra margin */
.main-content {
  margin-top: calc(2rem + var(--navbar-logo-size) + 1.5rem); 
  padding: 2rem;
}

/* Original Logo Styles (for the content below the navbar, mostly untouched) */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  /* This style targets the logos below the navbar, not the navbar logo */
  .main-content a:nth-of-type(2) .logo { 
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}


I've updated the files to introduce the new, responsive `Navbar` component, separating it into its own file in `src/components/Navbar.jsx` and applying new, clean styles in `src/App.css`. The `App.jsx` now renders this component at the top of the application. Let me know if you'd like to adjust the colors, fonts, or functionality!