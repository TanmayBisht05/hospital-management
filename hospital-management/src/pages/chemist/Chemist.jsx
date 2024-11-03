import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './chemist.css'
import AuthContext from '../../AuthContext.jsx'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import Sidebar_chemist from '../../components/sidebar_chemist/Sidebar_chemist';

const Chemist = () => {
  const { cdashboardState } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);
  if (isNaN(id)) {
    console.error('Invalid chemist ID');
  }
  return (
    <div>
            <Navbar />
            <Fake />
    <div className='pdashboard'>
        <Sidebar_chemist />
      
      <div className="main-content">
        {cdashboardState === 0 && <>
          <h1 className="dashboard-header">Inventory</h1>
        </>}
        {cdashboardState === 1 && <>
          <h1 className="dashboard-header">Order Medicines</h1>
        </>}
        {cdashboardState === 2 && <>
          <h1 className="dashboard-header">Sell Requests</h1>
        </>}
      </div>
    </div>
    </div>
  )
}

export default Chemist;
