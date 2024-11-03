import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaSyringe, FaUserInjured } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import './sidebarDoctor.css';
import AuthContext from '../../AuthContext';

const SidebarDoctor = () => {
    const { pdashboardState, setPdashboardState } = React.useContext(AuthContext);
    let ele = useRef(null);
    let shouldSetEle = useRef(true);
    useEffect(() => {
        if(shouldSetEle.current) {
            shouldSetEle.current = false;
            if(pdashboardState === 0) {
                ele.current = document.getElementById('idprofile');
            } else if(pdashboardState === 1) {
                ele.current = document.getElementById('idapp');
            } else if(pdashboardState === 2) {
                ele.current = document.getElementById('idnewapp');
            } else if(pdashboardState === 3) {
                ele.current = document.getElementById('idpending');
            } else if(pdashboardState === 4) {
                ele = document.getElementById('idhistory');
            }
            if(ele.current) {
                ele.current.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }
        }
    }, []);
    const handleClick = (num) => {
        if(ele.current) {
            ele.current.style.backgroundColor = 'rgb(0, 87, 97)';
            ele.current = null;
        }
        if(num === 0) {
            ele.current = document.getElementById('idprofile');
        } else if(num === 1) {
            ele.current = document.getElementById('idapp');
        } else if(num === 2) {
            ele.current = document.getElementById('idnewapp');
        } else if(num === 3) {
            ele.current = document.getElementById('idpending');
        } else if(num === 4) {
            ele.current = document.getElementById('idhistory');
        }
        if(ele.current) {
            ele.current.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        setPdashboardState(num);
    }
    return (
        <div className="sidebar">
            <h2 className="text-light mb-4">Doctor Dashboard</h2>
                <Link to={'/'}>
                    <FaHome /> Home
                </Link>
                <a onClick={() => {handleClick(0)}} id='idprofile'>
                    <CgProfile /> Profile
                </a>
                <a onClick={() => {handleClick(1)}} id='idapp'>
                    <FaCalendarAlt /> Appointments
                </a>
                <a onClick={() => {handleClick(2)}} id='idnewapp'>
                    <FaSyringe /> Grant Appointments
                </a>
                <a onClick={() => {handleClick(3)}} id='idpending'>
                    <MdPending /> Surgery 
                </a>
                <a onClick={() => {handleClick(4)}} id='idhistory'>
                    <MdPending /> History 
                </a>
        </div>
    );
};

export default SidebarDoctor;
