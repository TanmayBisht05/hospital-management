import React, { useContext, useEffect, useRef, useState } from 'react';
import './Section1.css';
import Navbar from '../navbar/navbar';
import banner from '../../assets/hero-banner.png';
import Footer from '../footer';
import AuthContext from '../../AuthContext';

const Section1 = () => {
  let {animate, setAnimate, should_animate} = useContext(AuthContext);
  useEffect(() => {
    if (should_animate.current && animate) {
      console.log(animate)
      if (animate) {
        const timer = setTimeout(() => {
          setAnimate(false);
          sessionStorage.setItem('animate', 'false');
        }, 500);
        
        return () => clearTimeout(timer);
      }
      should_animate.current = false;
    }
  }, [setAnimate]);

  return (
    <div>
      <Navbar />
      <div className="section1_container">
        <div className="section1">
          <div className={`section1_left ${animate ? 'section1_left_animation' : ''}`}>
            <center><p className='section1_welcome'>Welcome to Heal</p></center>
            <h1 className='section1_heading'>Find Nearest Doctor.</h1>
            <div className="section1_search_doctor">
              <p className='section1_search_desc'>Search doctors, clinics, and hospitals</p>
              <div className="section1_search">
                <input type="text" placeholder="Locations" />
                <button className='section1_search_button'>Find Now</button>
              </div>
            </div>
          </div>
          <div className={`section1_right ${animate ? 'section1_right_animation' : ''}`}>
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Section1;