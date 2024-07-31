import React, {useEffect, useRef, useState} from 'react';
import './navbar.css';

const Navbar = () => {
    const handleScroll = () => {
        if (window.scrollY > 0) {
            document.querySelector('.navbar').classList.add('scroll');
        } else {
            document.querySelector('.navbar').classList.remove('scroll');

        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-logo">Doclab</a>
                <div className="nav-menu">
                    <div className="nav-item"><a href="/" className="nav-links">Home</a></div>
                    <div className="nav-item"><a href="/about" className="nav-links">About</a></div>
                    {/* <div className="nav-item"><a href="/services" className="nav-links">Services</a></div> */}
                    <div className="nav-item"><a href="/doctors" className="nav-links">Doctors</a></div>
                    <div className="nav-item"><a href="/contact" className="nav-links">Contact</a></div>
                </div>
                {/* <div className='navbar_button'>
                    <p>Make Appointment</p>
                </div> */}
            </div>
        </nav>
    );
};

export default Navbar;