import React, { useEffect, useRef, useState } from 'react';
import './navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 0) {
            document.querySelector('.navbar').classList.add('scroll');
        } else {
            document.querySelector('.navbar').classList.remove('scroll');
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-logo">
                    Heal
                </a>
                <div className="nav-menu">
                    <div className="nav-item">
                        <a href="/" className="nav-links">
                            Home
                        </a>
                    </div>
                    <div className="nav-item">
                        <a href="/doctors" className="nav-links">
                            Doctors
                        </a>
                    </div>
                    <div className="nav-item">
                        <a href="/patients" className="nav-links">
                            Patients
                        </a>
                    </div>
                    <div className="nav-item">
                        <a href="/contact" className="nav-links">
                            Contact
                        </a>
                    </div>
                    <div className="nav-item">
                        <a href="/about" className="nav-links">
                            About
                        </a>
                    </div>
                </div>
                {/* <div className={`navbar-hamburger ${isMenuOpen ? 'open' : ''}`} onClick={handleMenuToggle}>
                    <div className="hamburger-line">
                        <a href="/" className="nav-links">
                            Home
                        </a>
                    </div>
                    <div className="hamburger-line">
                        <a href="/doctors" className="nav-links">
                            Doctors
                        </a>
                    </div>
                    <div className="hamburger-line">
                        <a href="/contact" className="nav-links">
                            Contact
                        </a>
                    </div>
                    <div className="hamburger-line">
                        <a href="/about" className="nav-links">
                            About
                        </a>
                    </div>
                </div> */}
            </div>
        </nav>
    );
};

export default Navbar;
