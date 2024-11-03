import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineInventory } from 'react-icons/md';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import './sidebar_admin.css';
import AuthContext from '../../AuthContext';

const Sidebar_admin = () => {
    const { adashboardState, setAdashboardState } = React.useContext(AuthContext);
    let ele = useRef(null);
    let shouldSetEle = useRef(true);
    useEffect(() => {
        if(shouldSetEle.current) {
            shouldSetEle.current = false;
            if(adashboardState === 0) {
                ele.current = document.getElementById('idrdoctor');
            } else if(adashboardState === 1) {
                ele.current = document.getElementById('idrchemist');
            } else if(adashboardState === 2) {
                ele.current = document.getElementById('idmachinery');
            } else if(adashboardState === 3) {
                ele.current = document.getElementById('idrequests');
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
            ele.current = document.getElementById('idrdoctor');
        } else if(num === 1) {
            ele.current = document.getElementById('idrchemist');
        } else if(num === 2) {
            ele.current = document.getElementById('idmachinery');
        } else if(num === 3) {
            ele.current = document.getElementById('idrequests');
        }
        if(ele.current) {
            ele.current.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        setAdashboardState(num);
    }
    return (
        <div className="sidebar">
            <h2 className="text-light mb-4">Admin Dashboard</h2>
                <Link to={'/'}>
                    <FaHome /> Home
                </Link>
                <a onClick={() => {handleClick(0)}} id='idrdoctor'>
                    <MdOutlineInventory /> Register Doctor
                </a>
                <a onClick={() => {handleClick(1)}} id='idrchemist'>
                    <AiOutlineMedicineBox /> Register Chemist
                </a>
                <a onClick={() => {handleClick(2)}} id='idmachinery'>
                    <MdOutlineSell /> Machinery
                </a>
                <a onClick={() => {handleClick(3)}} id='idrequests'>
                    <MdOutlineSell /> Requests
                </a>
        </div>
    );
};

export default Sidebar_admin;
