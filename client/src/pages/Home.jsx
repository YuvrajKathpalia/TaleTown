import React from 'react';
import heroImage from "../assets/images/four.webp"; 
import RecentBooks from '../components/RecentBooks';
import { useNavigate } from 'react-router-dom';


const Home = () => {

  
const navigate = useNavigate();

const handleExploreNowClick = () => {
    navigate('/books');
  };
  
  return (
    <div>
      <div
        className="flex items-center justify-center min-h-screen text-white"
        style={{
          background: `linear-gradient(#08003ab3, #08003ab3), url(${heroImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="p-8 max-w-2xl text-center">
          <h1 className="text-5xl font-extrabold mb-4 font-roboto">
            Discover Endless Stories
          </h1>
          <p className="text-xl mb-6 font-openSans">
            Explore a vibrant collection of books at TaleTown. From timeless classics to modern gems, our library has something for every reader.
          </p>
          <button
            onClick={handleExploreNowClick}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300"
          >
            Explore Now
          </button>
        </div>
      </div>
  
      <div className="py-8">
        <RecentBooks />
      </div>
  
      {/* Footer.. */}
      <footer className="bg-zinc-800 text-white min-h-[50vh] mt-28 py-16 px-10">
  <div className="grid grid-cols-3 gap-14 justify-items-center items-start">
    <ul className="footer-list p-0 list-none">
      <li><h2 className="font-bold font-afacadFlux text-4xl mb-4">ABOUT</h2></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Contact us</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">About us</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Careers</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Gift Cards</p></li>
    </ul>
    <ul className="footer-list p-0 list-none">
      <li><h2 className="font-bold font-afacadFlux text-4xl mb-4">HELP</h2></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Payments</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Shipping</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Cancellation & Returns</p></li>
      <li className='mb-1'><p className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">FAQs</p></li>
    </ul>
    <ul className="footer-list p-0 list-none">
      <li><h2 className="font-bold font-afacadFlux text-4xl mb-4">SOCIALS</h2></li>
      <li className='mb-1'>
        <a href="https://www.linkedin.com/in/yuvrajkathpalia" target="_blank" rel="noopener noreferrer" className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">LinkedIn</a>
      </li>
      <li className='mb-1'>
        <a href="https://github.com/YuvrajKathpalia" target="_blank" rel="noopener noreferrer" className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">GitHub</a>
      </li>
      <li className='mb-1'>
        <a href="#" className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Twitter</a>
      </li>
      <li className='mb-1'>
        <a href="https://www.instagram.com/yuvraj.kathpalia/" target="_blank" rel="noopener noreferrer" className="text-lg italic text-gray-400 cursor-pointer hover:text-white transition-colors duration-300">Instagram</a>
      </li>
    </ul>
  </div>
</footer>
  </div>
  );
  
};  

export default Home;
