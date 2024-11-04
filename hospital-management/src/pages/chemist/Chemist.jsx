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
    const [salaries, setSalaries] = useState([]);
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
    const fetchSalaries = async () => {
      const response = await fetch(`${backend_url}/chemist-salaries/take/${id}`);
      const data = await response.json();
      setSalaries(data);
    };
  
    const handleAcceptSalary = async (salaryID) => {
      const response = await fetch(`${backend_url}/chemist-salaries/${salaryID}`, { method: 'DELETE' });
      if (response.ok) {
        alert("Salary accepted!");
        setSalaries(salaries.filter(salary => salary.csID !== salaryID));
      } else {
        alert("Failed to accept salary.");
      }
    };
  if (isNaN(id)) {
    console.error('Invalid chemist ID');
  }
  useEffect(() => {
    if (!token || userType !== 'CHEMIST') {
      navigate('/');
    } else {
      fetchSalaries(); // Fetch salary records for the chemist upon loading
    }
  }, [token]);
  return (
    <div>
            <Navbar />
            <Fake />
    <div className='pdashboard'>
        <Sidebar_chemist />
      
      <div className="main-content">
        {cdashboardState === 0 && <>
          <center><h1 className="dashboard-header">Inventory</h1></center>
        </>}
        {cdashboardState === 1 && <>
          <center><h1 className="dashboard-header">Order Medicines</h1></center>
          <div>
            <center><h2>Request Medicine</h2></center>
            <div className="login_div">
              <form onSubmit={handleRequestMedicine} className="login_form">
                <div className="login_div">
                  <label htmlFor="medname" className="login_label">Medicine Name : </label>
                  <input className='login_input' type="text" id='medname' value={medicineName} onChange={(e) => setMedicineName(e.target.value)} placeholder="Medicine Name" />
                </div>
                <div className="login_div">
                  <label htmlFor="medcost" className="login_label">Cost : </label>
                  <input className='login_input' id='medcost' type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" />
                </div>
                <div className="login_div">
                  <label htmlFor="medtype" className="login_label">Type : </label>
                <input className='login_input' id='medtype' type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
                </div>
                <div className="login_div">
                  <label htmlFor="medcompanyname" className="login_label">Company Name : </label>
                <input className='login_input' id='medcompanyname' type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
                </div>
                <div className="login_div">
                  <label htmlFor="medamount" className="login_label">Amount : </label>
                <input className='login_input' id='medamount' type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
                </div>
                <button className='login_button' type='submit'>Request Medicine</button>
              </form>
            </div>
        </div>
        </>}
        {cdashboardState === 2 && <>
            <center><h1 className="dashboard-header">Salary Records</h1></center>
            <div className="salary-list">
              <h2>Your Salary Records</h2>
              <ul>
                {salaries.map((salary) => (
                  <li key={salary.csID}>
                    <p>Date Issued: {salary.issueDate}</p>
                    <p>Amount: ${salary.amount}</p>
                    <button onClick={() => handleAcceptSalary(salary.csID)}>Accept Salary</button>
                  </li>
                ))}
              </ul>
            </div>
          </>}
      </div>
    </div>
    </div>
  )
}

export default Chemist;
