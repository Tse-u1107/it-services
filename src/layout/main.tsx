import React from 'react';
import Navbar from './navigationBar/Navbar';
import Footer from '../components/footer/footer';

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className='bg-off-white min-h-screen'>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Main;
