
import Services from "../Components/home/Services";
import GetInTouch from "../Components/home/GetInTouch";

const Home = () => {
  return (
    <div className="w-full">
      <div className="get-started w-full h-screen overflow-hidden">
        <div className="video w-full h-full relative">
          <video autoPlay muted loop className="object-cover h-full w-full" src="../Videos/your-video.mp4"></video>
          <div className="video-text absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white bg-black/50">
            <h1 className="text-5xl font-bold">
Healthcare, Your Way.</h1>
            <p className="mt-4 text-lg"></p>
          </div>
        </div>
      </div>
      <Services />
      <GetInTouch />
    </div>
  );
};

export default Home;

