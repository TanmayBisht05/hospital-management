import React from 'react'
import './Section1.css'
import banner from '../../assets/hero-banner.png'
const Section1 = () => {
  return (
    <div>
      <div className="section1_container">
        <div className="section1">
          <div className="section1_left">
            <p className='section1_welcome'>Welcome to Doclab</p>
            <h1 className='section1_heading'>Find Nearest Doctor.</h1>
            <div className="section1_search_doctor">
              
            </div>
          </div>
          <div className="section1_right">
            <img src = {banner} alt = "banner" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section1
