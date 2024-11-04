import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './chemist.css'
import AuthContext from '../../AuthContext.jsx'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import Sidebar_chemist from '../../components/sidebar_chemist/Sidebar_chemist';

const Chemist = () => {
  const { cdashboardState, backend_url } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);
  const [medicineName, setMedicineName] = useState('');
    const [cost, setCost] = useState('');
    const [type, setType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [amount, setAmount] = useState('');

    const handleRequestMedicine = async () => {
        const data = {
            medicineName,
            cost: parseInt(cost),
            type,
            companyName,
            amount: parseInt(amount),
        };

        const requestResponse = await fetch(`${backend_url}/medicine-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (requestResponse.ok) {
            alert("Request submitted successfully!");
        } else {
            alert("Failed to submit request.");
        }
    };
  if (isNaN(id)) {
    console.error('Invalid chemist ID');
  }
  useEffect(() => {
    if (!token || userType !== 'CHEMIST') {
      navigate('/');
    }
  }, [token])
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
          <div>
            <h2>Request Medicine</h2>
            <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} placeholder="Medicine Name" />
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" />
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button onClick={handleRequestMedicine}>Request Medicine</button>
        </div>
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
