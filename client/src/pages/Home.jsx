import React from 'react';
import heroImage from "../assets/images/four.webp"; 
import RecentBooks from '../components/RecentBooks';

const Home = () => {
  return (
    <div>
    <div
      className="flex items-center justify-center min-h-screen text-white "
      style={{
        background: `linear-gradient(#08003ab3, #08003ab3), url(${heroImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      
      <div className="p-8 max-w-2xl text-center ">
        <h1 className="text-5xl font-extrabold mb-4 font-roboto">
          Discover Endless Stories
        </h1>
        <p className="text-xl mb-6 font-openSans">
          Explore a vibrant collection of books at TaleTown. From timeless classics to modern gems, our library has something for every reader.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300">
          Explore Now
        </button>
      </div>
    </div>

    <div className="py-8">
        <RecentBooks />
      </div>
    </div>
  );
};

export default Home;
