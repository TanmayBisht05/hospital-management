import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineInventory } from 'react-icons/md';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import './sidebar_chemist.css';
import AuthContext from '../../AuthContext';

const Sidebar_chemist = () => {
    const { cdashboardState, setCdashboardState } = React.useContext(AuthContext);
    let ele = useRef(null);
    let shouldSetEle = useRef(true);
    useEffect(() => {
        if(shouldSetEle.current) {
            shouldSetEle.current = false;
            if(cdashboardState === 0) {
                ele.current = document.getElementById('idinventory');
            } else if(cdashboardState === 1) {
                ele.current = document.getElementById('idorder');
            } else if(cdashboardState === 2) {
                ele.current = document.getElementById('idsell');
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
            ele.current = document.getElementById('idinventory');
        } else if(num === 1) {
            ele.current = document.getElementById('idorder');
        } else if(num === 2) {
            ele.current = document.getElementById('idsell');
        }
        if(ele.current) {
            ele.current.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        setCdashboardState(num);
    }
    return (
        <div className="sidebar">
            <h2 className="text-light mb-4">Chemist Dashboard</h2>
                <Link to={'/'}>
                    <FaHome /> Home
                </Link>
                <a onClick={() => {handleClick(0)}} id='idinventory'>
                    <MdOutlineInventory /> Inventory
                </a>
                <a onClick={() => {handleClick(1)}} id='idorder'>
                    <AiOutlineMedicineBox /> Order Medicines
                </a>
                <a onClick={() => {handleClick(2)}} id='idsell'>
                    <MdOutlineSell /> Sell Requests
                </a>
        </div>
    );
};

export default Sidebar_chemist;
