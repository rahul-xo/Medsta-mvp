import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/NavBar";

const App = () => {
  return (
    <div className="main h-screen relative">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;
