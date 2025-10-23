import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

const coreFeatures = [
  {
    title: "DOCTORS",
    description: "Book appointments with experienced doctors online or in-clinic.",
    image: "/Images/30.jpg",
    link: "/book-appointment"
  },
  {
    title: "MEDICINES",
    description: "Order medicines online for home delivery or store pickup.",
    image: "/Images/32.jpeg",
    link: "/medicine-ordering"
  },
  {
    title: "TESTS",
    description: "Book diagnostic tests and get samples collected from home.",
    image: "/Images/31.jpeg",
    link: "/diagnostic-tests"
  },
  {
    title: "THERAPY",
    description: "Access various therapy sessions for mental and physical well-being.",
    image: "/Images/therapy.jpg",
    link: "/therapy"
  },
];

const commonNeeds = [
  { id: 1, label: "Fever", icon: "🌡️" },
  { id: 2, label: "Cold", icon: "🤧" },
  { id: 3, label: "Pain", icon: "🤕" },
  { id: 4, label: "Digestion", icon: "🍎" },
  { id: 5, label: "Headache", icon: "🤯" },
  { id: 6, label: "Skin", icon: "✨" },
  { id: 7, label: "Cough", icon: "😷" },
  { id: 8, label: "Allergy", icon: "🌸" },
  { id: 9, label: "Vitamins", icon: "💊" },
  { id: 10, label: "Stress", icon: "🧘" },
];

const mostSoldProducts = [
  { id: 1, name: "Product A", image: "/Images/product-placeholder.jpg" },
  { id: 2, name: "Product B", image: "/Images/product-placeholder.jpg" },
  { id: 3, name: "Product C", image: "/Images/product-placeholder.jpg" },
  { id: 4, name: "Product D", image: "/Images/product-placeholder.jpg" },
  { id: 5, name: "Product E", image: "/Images/product-placeholder.jpg" },
  { id: 6, name: "Product F", image: "/Images/product-placeholder.jpg" },
  { id: 7, name: "Product G", image: "/Images/product-placeholder.jpg" },
  { id: 8, name: "Product H", image: "/Images/product-placeholder.jpg" },
];

const medstaHeroes = [
  { id: 1, image: "/Images/hero-placeholder.jpg" },
  { id: 2, image: "/Images/hero-placeholder.jpg" },
  { id: 3, image: "/Images/hero-placeholder.jpg" },
  { id: 4, image: "/Images/hero-placeholder.jpg" },
  { id: 5, image: "/Images/hero-placeholder.jpg" },
  { id: 6, image: "/Images/hero-placeholder.jpg" },
];

const renderArrowPrev = (onClickHandler, hasPrev, label) =>
  hasPrev && (
    <button type="button" onClick={onClickHandler} title={label} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors">
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
  );

const renderArrowNext = (onClickHandler, hasNext, label) =>
  hasNext && (
    <button type="button" onClick={onClickHandler} title={label} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors">
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
    </button>
  );

// Helper function to chunk array
const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export default function OurCoreFeatures() {
    const [itemsPerSlide, setItemsPerSlide] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerSlide(5);
            } else if (window.innerWidth >= 1024) {
                setItemsPerSlide(4);
            } else if (window.innerWidth >= 768) {
                setItemsPerSlide(3);
            } else if (window.innerWidth >= 640) {
                setItemsPerSlide(2);
            } else {
                setItemsPerSlide(2);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const groupedCommonNeeds = chunkArray(commonNeeds, itemsPerSlide);
    const groupedMostSold = chunkArray(mostSoldProducts, itemsPerSlide);
    const groupedHeroes = chunkArray(medstaHeroes, 2); // Always group heroes by 2

  return (
    <section id="services" className="py-16 md:py-8 bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header for Core Features */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Our Core Features</h2>
          <p className="text-slate-600 text-lg">
            Explore the powerful tools Medsta offers to manage your health seamlessly
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {coreFeatures.map((feature, index) => (
            <NavLink to={feature.link} key={index} className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end">
                <h3 className="text-xl font-bold text-white relative z-10">{feature.title}</h3>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Shop by your common needs Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Shop by your common needs</h2>
          <p className="text-slate-600 text-lg">
            Book Tests, Medicine, Appointment, Therapy at the comfort of your home or get priority at the store
          </p>
        </div>

        {/* Common Needs Carousel */}
        <div className="relative mb-16">
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            emulateTouch={true}
            renderArrowPrev={renderArrowPrev}
            renderArrowNext={renderArrowNext}
          >
            {groupedCommonNeeds.map((group, i) => (
                <div key={i} className="flex justify-center gap-4">
                    {group.map(item => (
                        <div key={item.id} className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
                            <div className="bg-teal-500 text-white rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-teal-600 transition-colors aspect-square">
                                <span className="text-4xl mb-2">{item.icon}</span>
                                <p className="text-lg font-medium text-center">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
          </Carousel>
        </div>
        {/* Another set of boxes below the carousel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-teal-500 text-white rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-teal-600 transition-colors aspect-square">
            <span className="text-4xl mb-2">🩹</span>
            <p className="text-lg font-medium">First Aid</p>
          </div>
          <div className="bg-teal-500 text-white rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-teal-600 transition-colors aspect-square">
            <span className="text-4xl mb-2">💪</span>
            <p className="text-lg font-medium">Fitness</p>
          </div>
          <div className="bg-teal-500 text-white rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-teal-600 transition-colors aspect-square">
            <span className="text-4xl mb-2">👶</span>
            <p className="text-lg font-medium">Child Care</p>
          </div>
          <div className="bg-teal-500 text-white rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-teal-600 transition-colors aspect-square">
            <span className="text-4xl mb-2">❤️</span>
            <p className="text-lg font-medium">Heart Health</p>
          </div>
        </div>

        {/* Most Sold Products Section */}
        <div className="text-center mb-8">
          <h2 className="py-16 md:py-12 text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Most sold products</h2>
        </div>

        {/* Most Sold Products Carousel */}
        <div className="relative mb-16">
           <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            emulateTouch={true}
            renderArrowPrev={renderArrowPrev}
            renderArrowNext={renderArrowNext}
          >
            {groupedMostSold.map((group, i) => (
                <div key={i} className="flex justify-center gap-4">
                    {group.map(product => (
                        <div key={product.id} className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
                            <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 aspect-square">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-32 object-contain mb-2"
                                />
                                <p className="text-lg font-medium text-gray-800 text-center">{product.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
          </Carousel>
        </div>

        {/* Offers Section */}
        <div className="text-center mb-8 mt-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Offers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="h-32 rounded-lg bg-gradient-to-r from-blue-300 to-indigo-200 shadow-md flex items-center justify-center text-white text-xl font-bold">
            Offer 1
          </div>
          <div className="h-32 rounded-lg bg-gradient-to-r from-green-300 to-teal-200 shadow-md flex items-center justify-center text-white text-xl font-bold">
            Offer 2
          </div>
          <div className="h-32 rounded-lg bg-gradient-to-r from-purple-300 to-pink-200 shadow-md flex items-center justify-center text-white text-xl font-bold">
            Offer 3
          </div>
        </div>

        {/* Meet our Heroes Section */}
        <div className="text-center mb-8 mt-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Meet our Heroes</h2>
        </div>
        <div className="relative mb-16">
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            emulateTouch={true}
            renderArrowPrev={renderArrowPrev}
            renderArrowNext={renderArrowNext}
          >
            {groupedHeroes.map((group, i) => (
                <div key={i} className="flex justify-center items-center gap-4">
                    {group.map(hero => (
                         <div key={hero.id} className="p-2 flex-shrink-0">
                            <div className="bg-teal-500 rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto overflow-hidden shadow-md">
                                <img
                                    src={hero.image}
                                    alt={`Hero ${hero.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
