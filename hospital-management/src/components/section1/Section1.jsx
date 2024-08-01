import React from 'react'
import './Section1.css'
// import banner from '../../assets/docteam.jpg'
import banner from '../../assets/hero-banner.png'
const Section1 = () => {
  return (
    <div>
      <div className="section1_container">
        <div className="section1">
          <div className="section1_left">
            <p className='section1_welcome'><center>Welcome to Heal</center></p>
            <h1 className='section1_heading'>Find Nearest Doctor.</h1>
            <div className="section1_search_doctor">
              <p className='section1_search_desc'>Search doctors, clinics, and hospitals</p>
              <div className="section1_search">
                <input type="text" placeholder="Locations" />
                <button className='section1_search_button'>Find Now</button>
              </div>
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
