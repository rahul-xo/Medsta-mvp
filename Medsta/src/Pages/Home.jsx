import React from "react";

const Home = () => {
  return (
    <div className="w-full mt-32 flex flex-col justify-center items-center">
      <div className="Search-Panel flex flex-col gap-4 ">
        <h1 className="font-semibold text-[25px]">What are you Looking For?</h1>
        <input type="search" name="" id="" placeholder="search for medicine , consultation" className="rounded-full text-[17px] px-3 w-2xl py-2.5 shadow-lg outline-none border border-gray-300" />
      </div>
    </div>
  );
};

export default Home;
