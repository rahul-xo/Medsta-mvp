import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/NavBar";
import Footer from "./Components/Footer";


const App = () => {
  return (
    <div className="main relative">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
