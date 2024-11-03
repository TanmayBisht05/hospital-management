import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import './pdashboard.css'
import AuthContext from '../../AuthContext.jsx'
import App_cards from '../../components/app_cards/App_cards.jsx'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import UserInfo from './profile.jsx'
import PatientBills from '../../components/bills/patientbills.jsx';

const pdashboard = () => {
  const { pdashboardState } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);
  if (isNaN(id)) {
    console.error('Invalid patient ID');
  } else {
    // Use `id` as an integer
  }
  useEffect(() => {
    // Check if token exists in cookies
    
    
    if (!token || userType!='PATIENT') {
      // Redirect to login if token is missing
      navigate('/login');
    }
    else {
      // Fetch patient data
      const fetchPatientData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/patients/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token in headers for authentication
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPatientData(data); // Store fetched data in state
          } else {
            console.error('Failed to fetch patient data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchPatientData();
    }
  }, [navigate, token, userType, id]);



  return (
    <div>
            <Navbar />
            <Fake />
    <div className='pdashboard'>
      <Sidebar />
      
      <div className="main-content">
        {pdashboardState === 0 && <>
          <h1 className="dashboard-header">Profile</h1>
            {patientData ? (
              <div className="patient-profile">
                <p><strong>Patient ID:</strong> {patientData.patientID}</p>
                <p><strong>First Name:</strong> {patientData.firstName}</p>
                <p><strong>Last Name:</strong> {patientData.lastName}</p>
                <p><strong>Address:</strong> {patientData.address}</p>
                <p><strong>Email:</strong> {patientData.email}</p>
                <p><strong>Gender:</strong> {patientData.gender}</p>
                <p><strong>History:</strong> {patientData.history}</p>
                <p><strong>Date of Birth:</strong> {patientData.dob}</p>
              </div>
            ) : (
              <p>Loading patient data...</p>
            )}
        </>}
        {pdashboardState === 1 && <>
          <h1 className="dashboard-header">Appointments</h1>
          <div className="appointments">
            <h2>Upcoming Appointments</h2>
            <div className="appointment_cards">
              <App_cards />
              <App_cards />
              <App_cards />
              <App_cards />
            </div>
          </div>
          <div className="appointments">
            <h2>Previous Appointments</h2>
            <div className="appointment_cards">
              <App_cards />
              <App_cards />
              <App_cards />
              <App_cards />
              <App_cards />
              <App_cards />
              <App_cards />
            </div>
          </div>
        </>}
        {pdashboardState === 2 && <>
          <h1 className="dashboard-header">New Appointment</h1>
        </>}
        {pdashboardState === 3 && <>
          <h1 className="dashboard-header">Pending Bills</h1>
          <PatientBills patientID={id} />
        </>}
        
        {pdashboardState === 4 && <>
          <h1 className="dashboard-header">History</h1>
          <UserInfo cookie={"ejkjjs"}></UserInfo>

        </>}
      </div>
    </div>
    </div>
  )
}

export default pdashboard
