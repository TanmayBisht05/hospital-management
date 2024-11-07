import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaSyringe, FaUserInjured } from 'react-icons/fa';
import { MdPending, MdOutlineMeetingRoom, MdOutlineLocalPharmacy } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import './sidebar.css';
import AuthContext from '../../AuthContext';

const Sidebar = () => {
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
                ele.current = document.getElementById('idsurgeries');
            } else if(pdashboardState === 4) {
                ele.current = document.getElementById('idpending');
            }  else if(pdashboardState === 5) {
                ele = document.getElementById('idbookroom');
            } else if(pdashboardState === 6) {
                ele = document.getElementById('idpharmacy');
            }

            // else if(pdashboardState === 5) {
            //     ele = document.getElementById('idhistory');
            // }

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
            ele.current = document.getElementById('idsurgeries');
        } else if(num === 4) {
            ele.current = document.getElementById('idpending');
        }  else if(num === 5) {
            ele.current = document.getElementById('idbookroom');
        } else if(num === 6) {
            ele.current = document.getElementById('idpharmacy');
        }


        else if(num === 5) {
            ele.current = document.getElementById('idhistory');
        }

        if(ele.current) {
            ele.current.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        setPdashboardState(num);
    }
    return (
        <div className="sidebar">
            <h2 className="text-light mb-4">Patient Dashboard</h2>
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
                    <FaSyringe /> New Appointment
                </a>
                <a onClick={() => {handleClick(3)}} id='idsurgeries'>
                    <MdPending /> Surgeries
                </a>
                <a onClick={() => {handleClick(4)}} id='idpending'>
                    <MdPending /> Pending Bills
                </a>
                
                <a onClick={() => {handleClick(5)}} id='idbookroom'>
                    <MdOutlineMeetingRoom /> Book Room
                </a>
                <a onClick={() => {handleClick(6)}} id='idpharmacy'>
                    <MdOutlineLocalPharmacy /> Pharmacy
                </a>


                {/* <a onClick={() => {handleClick(5)}} id='idhistory'>
                    <FaUserInjured /> History
                </a> */}

        </div>
    );
};

export default Sidebar;
