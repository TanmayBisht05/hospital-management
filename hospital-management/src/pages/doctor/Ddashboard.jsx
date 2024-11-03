import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import './ddashboard.css';
import AuthContext from '../../AuthContext.jsx';
import App_cards from '../../components/app_cards/App_cards.jsx';

import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';

const Ddashboard = () => {
  const { ddashboardState = 0 } = useContext(AuthContext); // Default to 0 if undefined
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const userType = Cookies.get('userType');
    const doctorId = parseInt(Cookies.get('id'), 10);
    
    if (!token || userType !== 'DOCTOR' || isNaN(doctorId)) {
      navigate('/login');
      return;
    }
  
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/doctor/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        const data = await response.json();
        setDoctorData(data);
        console.log('Doctor Data:', data); // Debug log
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctorData();
  }, [navigate]);

  console.log('Dashboard State:', ddashboardState); // Debug log

  return (
    <div>
      <Navbar />
      <Fake />
      <div className='ddashboard'>
        <Sidebar />
        <div className="main-content">
          {loading ? (
            <h1 className="dashboard-header">Loading...</h1>
          ) : error ? (
            <h1 className="dashboard-header">{error}</h1>
          ) : (
            <>
              <h1 className="dashboard-header">Dashboard</h1>
              {ddashboardState === 0 && doctorData && ( // Ensure doctorData is available
                <div className="doctor-profile">
                  <h1 className="dashboard-header">Profile</h1>
                  <p><strong>First Name:</strong> {doctorData.firstName}</p>
                  <p><strong>Last Name:</strong> {doctorData.lastName}</p>
                  <p><strong>Date of Birth:</strong> {new Date(doctorData.dob).toLocaleDateString()}</p>
                  <p><strong>Education:</strong> {doctorData.education}</p>
                  <p><strong>Gender:</strong> {doctorData.gender}</p>
                  <p><strong>Phone:</strong> {doctorData.phone}</p>
                  <p><strong>Email:</strong> {doctorData.email}</p>
                  <p><strong>Post:</strong> {doctorData.post}</p>
                  <p><strong>Department:</strong> {doctorData.department}</p>
                  <p><strong>Specialization:</strong> {doctorData.specialization}</p>
                </div>
              )}
              {ddashboardState === 1 && (
                <>
                  <h1 className="dashboard-header">Appointments</h1>
                  <div className="appointments">
                    <h2>Upcoming Appointments</h2>
                    <div className="appointment_cards">
                      <App_cards />
                      <App_cards />
                    </div>
                  </div>
                </>
              )}
              {ddashboardState === 2 && <h1 className="dashboard-header">Requested Appointments</h1>}
              {ddashboardState === 3 && <h1 className="dashboard-header">Surgery</h1>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ddashboard;
