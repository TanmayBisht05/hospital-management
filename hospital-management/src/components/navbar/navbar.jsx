import React, { useEffect, useRef, useState, useContext } from 'react';
import './navbar.css';
import AuthContext from '../../AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    let {isAuthenticated, logout, userType} = useContext(AuthContext);
    const location = useLocation();

    const handleScroll = () => {
        if (window.scrollY > 0) {
            document.querySelector('.navbar').classList.add('scroll');
        } else {
            document.querySelector('.navbar').classList.remove('scroll');
        }
    };
    const handleLogout = () => {
        logout();
    }

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
                    {location.pathname !== "/" && location.pathname !== "#" && <div className="nav-item">
                        <a href="/" className="nav-links">
                            Home
                        </a>
                    </div>}
                    <div className="nav-item">
                        <a href="/doctors" className="nav-links">
                            Doctors
                        </a>
                    </div>
                    {isAuthenticated && userType === 'PATIENT' && <div className="nav-item">
                        <a href="/patients" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
                    {isAuthenticated && userType === 'ADMIN' && <div className="nav-item">
                        <a href="/admin" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
                    {isAuthenticated && userType === 'CHEMIST' && <div className="nav-item">
                        <a href="/chemist" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
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
                    {!isAuthenticated && <div className="nav-item">
                        <a href="/login" className="nav-links">
                            Login
                        </a>
                    </div>}
                    {!isAuthenticated && <div className="nav-item">
                        <a href="/signup" className="nav-links">
                            Signup
                        </a>
                    </div>}
                    {isAuthenticated && <div className="nav-item">
                        <a href = "/" onClick={handleLogout} className="nav-links">
                            Logout
                        </a>
                    </div>}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
