// frontend/src/Pages/Home.jsx

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FaSearch } from 'react-icons/fa';
import OurCoreFeatures from '../Components/home/OurCoreFeatures';
import GetInTouch from "../Components/home/GetInTouch";
import MedstaForProviders from "../Components/home/MedstaForProviders";
import PlaceYourOrder from '../Components/home/PlaceYourOrder';



const Home = () => {
  // Placeholder data for partners
  const partners = [
    { name: "Partner 1", img: "/Images/22.png" },
    { name: "Partner 2", img: "/Images/12.jpg" },
    { name: "Partner 3", img: "/Images/23.png" },
    { name: "Partner 4", img: "/Images/24.png" },
    { name: "Partner 5", img: "/Images/25.png" },
    { name: "Partner 6", img: "/Images/26.png" },
  ];

  return (
    <div className="w-full pt-10"> {/* Add padding top to avoid navbar overlap */}
      
      {/* Welcome Section */}
      <section className="text-center py-6 md:py-6 px-4 bg-white">
        <h1 className="text-7xl md:text-7xl font-bold text-blue-600">Welcome to Medsta</h1>
        <p className="mt-2 text-slate-600">Healthcare, Your Way. Comprehensive digital healthcare for everyone, everywhere.</p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 "><FaSearch /></span>
          <input
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Search Doctors, Medicine, Diagnostic test, Beauty and more..."
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <Carousel 
          autoPlay 
          infiniteLoop 
          showThumbs={false} 
          showStatus={false} 
          interval={3000}
        >
          {/* Slide 1 */}
          <div className="max-h-96 overflow-hidden rounded-lg">
            <img src="/Images/3.jpg" alt="Sale Banner 1" className="h-full w-full object-cover" />
          </div>
          {/* Slide 2 */}
          <div className="max-h-96 overflow-hidden rounded-lg">
            <img src="/Images/1.jpg" alt="Sale Banner 2" className="h-full w-full object-cover" />
          </div>
          {/* Slide 3 */}
          <div className="max-h-96 overflow-hidden rounded-lg">
            <img src="/Images/2.jpg" alt="Sale Banner 3" className="h-full w-full object-cover" />
          </div>
        </Carousel>
      </section>
      
      <OurCoreFeatures />
      

      {/* Our Partners Near You Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-10 py-6">
        <h2 className="text-5xl font-semibold text-center text-blue-600 mb-8">Our Partners Near You</h2>
        <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
          {partners.map((partner, index) => (
            <div key={index} className="text-center">
              <img src={partner.img} alt={partner.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md border-2 border-white" />
            </div>
          ))}
        </div>
      </section>
      
      

      {/* --- Existing Sections --- */}
      
      
      <PlaceYourOrder />
      <GetInTouch />
      <MedstaForProviders />
    </div>
  );
};

export default Home;