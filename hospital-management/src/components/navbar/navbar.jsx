import React, { useEffect, useRef, useState, useContext } from 'react';
import './navbar.css';
import AuthContext from '../../AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    let {isAuthenticated, logout, userType} = useContext(AuthContext);
    const location = useLocation();
    const handleLogout = () => {
        logout();
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-logo">
                    Heal
                </a>
                <div className="nav-menu">
                    {location.pathname !== "/" && location.pathname !== "#" && location.pathname !== "/patients" && location.pathname !== "/admin" && location.pathname !== "/chemist" && location.pathname !== "/doctor" && <div className="nav-item">
                        <a href="/" className="nav-links">
                            Home
                        </a>
                    </div>}
                    <div className="nav-item">
                        <a href="/doctors" className="nav-links">
                            Doctors
                        </a>
                    </div>
                    {isAuthenticated && userType === 'PATIENT' && location.pathname !== "/patients" && <div className="nav-item">
                        <a href="/patients" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
                    {isAuthenticated && userType === 'ADMIN' && location.pathname !== "/admin" && <div className="nav-item">
                        <a href="/admin" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
                    {isAuthenticated && userType === 'CHEMIST' && location.pathname !== "/chemist" && <div className="nav-item">
                        <a href="/chemist" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
                    {isAuthenticated && userType === 'DOCTOR' && location.pathname !== "/doctor" && <div className="nav-item">
                        <a href="/doctor" className="nav-links">
                            Dashboard
                        </a>
                    </div>}
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
