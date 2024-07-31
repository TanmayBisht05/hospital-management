import React, { useState, useEffect } from 'react';
import './About.css';
import banner1 from '../../assets/operation.jpg';
import banner2 from '../../assets/beds.jpg';
import banner3 from '../../assets/nurse.webp';

const About = () => {
  const images = [banner1, banner2, banner3];
  const [currentImage, setCurrentImage] = useState(images[0]);
  
  useEffect(() => {
  
    const interval = setInterval(() => {
      setCurrentImage(prevImage => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="about_container">
      <div className="about">
        <div className="about_left">
          <h2 className="about_heading">About Our Hospital</h2>
          <p className="about_text">
            Established in 2005, our hospital has been a beacon of medical excellence and compassionate care. 
            With a dedicated team of highly skilled professionals and state-of-the-art facilities, we are 
            committed to delivering top-quality healthcare services to our patients and their families.
          </p>
          <p className="about_text">
            Over the years, we have reached several milestones, including performing the first successful 
            heart transplant in the region and establishing a renowned cancer treatment center. Our mission 
            is to continue pushing the boundaries of medical innovation while providing personalized and empathetic 
            care. We are devoted to enhancing patient outcomes and advancing healthcare practices through our 
            continuous efforts and commitment.
          </p>
          <p className="about_text">
            We believe that healthcare is not just about treating illnesses but about improving lives and building 
            a healthier community. Join us in our journey towards a better future, where every patient receives 
            exceptional care and every interaction is marked by kindness and respect.
          </p>
        </div>
        <div className="about_right">
          <img src={currentImage} alt="Hospital Banner" />
        </div>
      </div>
    </div>
  );
}

export default About;
