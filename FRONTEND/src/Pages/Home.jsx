import React from "react";

const Home = () => {
  return (
    <div className="w-full pt-[70px]">
      <div className="get-started w-full h-[calc(100vh-70px)] overflow-hidden">
        <div className="video w-full h-full relative">
          <video autoPlay muted loop className="object-cover h-full w-full" src="../Videos/your-video.mp4"></video>
          <div className="video-text absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white bg-black/50">
            <h1 className="text-5xl font-bold">Welcome To Medsta</h1>
            <p className="mt-4 text-lg"></p>
          </div>
        </div>
      </div>
      <div className="h-screen w-full bg-white p-10">
        <h2 className="text-4xl font-bold">Our Features</h2>
        <p className="mt-4">This is the next section of the page.</p>
      </div>
    </div>
  );
};

export default Home;

