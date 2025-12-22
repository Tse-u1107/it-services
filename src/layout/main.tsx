import React from 'react';
import Navbar from '../components/navigationBar/Navbar';
import Footer from '../components/footer/footer';

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className='bg-off-white min-h-screen'>
        {children}
      </div>
      <div className='border-t border-gray-200'>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
