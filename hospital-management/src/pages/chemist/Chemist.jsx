import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './chemist.css';
import AuthContext from '../../AuthContext.jsx';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import Sidebar_chemist from '../../components/sidebar_chemist/Sidebar_chemist';
import ChemistPharmacyPanel from '../../components/pharmacy/chemistPharmacyPanel.jsx';

const Chemist = () => {
    const { cdashboardState, backend_url, logout, inventory, fetchInventory } = useContext(AuthContext);
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
    const [pharmacyRequests, setPharmacyRequests] = useState([]); // New state for pharmacy requests
    const should_fetch = useRef(true);


    const fetchChemistData = async () => {
          const response = await fetch(`${backend_url}/chemist/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            alert('Failed to fetch patient data');
            logout();
            navigate('/');
          }
        //   console.error('Error:', error);
        };

    useEffect(() => {
        if (should_fetch.current) {
            fetchChemistData();
            fetchInventory();
            fetchPharmacyRequests(); // Fetch pharmacy requests on initial load
            should_fetch.current = false;
        }
    }, []);

    const fetchPharmacyRequests = async () => {
        const response = await fetch(`${backend_url}/pharmacy/${id}`);
        const data = await response.json();
        setPharmacyRequests(data);
    };

    const handleRequestMedicine = async (e) => {
        e.preventDefault();
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
            setMedicineName('');
            setCost('');
            setType('');
            setCompanyName('');
            setAmount('');
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
                        <div className="appointments">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Medicine Id</th>
                                        <th>Medicine Name</th>
                                        <th>Cost</th>
                                        <th>Type</th>
                                        <th>Company Name</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item) => (
                                        <tr key={item.medicineID}>
                                            <td>{item.medicineID}</td>
                                            <td>{item.medicineName}</td>
                                            <td>{item.cost}</td>
                                            <td>{item.type}</td>
                                            <td>{item.companyName}</td>
                                            <td>{item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                        <div className="appointments">
                            <h2>Your Salary Records</h2>
                            <div className="appointment_cards">
                            {salaries.length > 0 ?
                                    <>{salaries.map((salary) => (
                                        <div className='app_cards' key={salary.csID}>
                                            <div className="app_cards_date">
                                                <p>{new Date(salary.issueDate).toLocaleString()}</p>
                                            </div>
                                            <div className="app_cards_details">
                                                <p>Amount: ${salary.salary}</p>
                                                <button className='login_button' onClick={() => handleAcceptSalary(salary.csID)}>Accept Salary</button>
                                            </div>
                                        </div>
                                    ))}</>
                                    :
                                    <center><p>No salary records found.</p></center>
                                }
                                </div>
                        </div>
                    </>}
                    {cdashboardState === 3 && <>
                        <center><h1 className="dashboard-header">Pharmacy Requests</h1></center>
                        <ChemistPharmacyPanel />
                        

                    </>}
                </div>
            </div>
        </div>
    );
}

export default Chemist;
