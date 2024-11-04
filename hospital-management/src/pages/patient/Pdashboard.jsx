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
  const { pdashboardState, backend_url } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorID, setSelectedDoctorID] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);

  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);

  useEffect(() => {
    if (!token || userType !== 'PATIENT') {
      navigate('/login');
    } else {
      const fetchPatientData = async () => {
        try {
          const response = await fetch(`${backend_url}/patients/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPatientData(data);
          } else {
            console.error('Failed to fetch patient data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const fetchDoctors = async () => {
        try {
          const response = await fetch(`${backend_url}/doctor`);
          if (response.ok) {
            const data = await response.json();
            setDoctors(data);
          } else {
            console.error('Failed to fetch doctors');
          }
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
      };

      
      fetchPatientData();
      fetchDoctors();
      fetchAppointments();
    }
  }, [navigate, token, userType, id]);
  const fetchAppointments = async () => {
    try {
      // Fetch requested appointments
      const requestedResponse = await fetch(`${backend_url}/appointments/patient/${id}/requested`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (requestedResponse.ok) {
        const requestedData = await requestedResponse.json();
        setRequestedAppointments(requestedData);
      } else {
        console.error('Failed to fetch requested appointments');
      }
  
      // Fetch upcoming appointments
      const upcomingResponse = await fetch(`${backend_url}/appointments/patient/${id}/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        setUpcomingAppointments(upcomingData);
      } else {
        console.error('Failed to fetch upcoming appointments');
      }
  
      // Fetch previous appointments
      const previousResponse = await fetch(`${backend_url}/appointments/patient/${id}/previous`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (previousResponse.ok) {
        const previousData = await previousResponse.json();
        setPreviousAppointments(previousData);
      } else {
        console.error('Failed to fetch previous appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    if (selectedDoctorID) {
      try {
        const response = await fetch(`${backend_url}/appointments/patient/${id}/request?doctorID=${selectedDoctorID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Appointment request successfully created.');
          fetchAppointments();
        } else {
          alert('Failed to create appointment request.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please select a doctor.');
    }
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctorID(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <Fake />
      <div className='pdashboard'>
        <Sidebar />
        <div className="main-content">
          {pdashboardState === 0 && <>
            <center><h1 className="dashboard-header">Profile</h1></center>
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
            <center><h1 className="dashboard-header">Appointments</h1></center>
            <div className="appointments">
              <h2>Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? 
              <p>No Upcoming Appointments</p>
              :
              <div className="appointment_cards">
                {upcomingAppointments.map(app => (
                  <App_cards key={app.appointmentID} param={app} flag ={false} />
                ))}
              </div>}
            </div>
            <div className="appointments">
              <h2>Previous Appointments</h2>
              {previousAppointments.length === 0 ? 
              <p>No Previous Appointments</p>
              :
              <div className="appointment_cards">
                {previousAppointments.map(app => (
                  <App_cards key={app.appointmentID} param={app} flag = {false} />
                ))}
              </div>}
            </div>
            <div className="appointments">
              <h2>Requested Appointments</h2>
              {requestedAppointments.length === 0 ?
              <p>No Requested Appointments</p>
              :
              <div className="appointment_cards">
                {requestedAppointments.map(app => (
                  <App_cards key={app.appointmentID} param={app} flag = {false} />
                ))}
              </div>}
            </div>
          </>}
          {pdashboardState === 2 && <>
            <center><h1 className="dashboard-header">New Appointment</h1></center>
            <div className='appointments'>
              <center><h2>Available Doctors:</h2></center>
              <div className="appointment_cards">
              {doctors.map(doctor => (
                <App_cards key = {doctor.doctorID} param = {doctor} flag = {false} />
              ))}
              </div>
            </div>
            <div className="login_div">
            <h2>Request an Appointment:</h2>
            <form onSubmit={handleRequestAppointment} className="login_form">
              <div className="login_div">
            <label className='login_label' htmlFor="doctorSelect">Select a Doctor : </label>
            <select className='login_select' id="doctorSelect" value={selectedDoctorID} onChange={handleDoctorChange}>
              <option value="">--Select Doctor--</option>
              {doctors.map(doctor => (
                <option key={doctor.doctorID} value={doctor.doctorID}>
                  {doctor.doctorID} - {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
              </div>
            <button type='submit' className='login_button'>Request Appointment</button>
              </form>
              </div>
          </>}
          {pdashboardState === 3 && <>
            <center><h1 className="dashboard-header">Pending Bills</h1></center>
            <div className="appointments">
            <PatientBills patientID={id} /> 
            </div>
          </>}
          {pdashboardState === 4 && <>
            <center><h1 className="dashboard-header">History</h1></center>
            <UserInfo cookie={"ejkjjs"} />
          </>}
        </div>
      </div>
    </div>
  )
}

export default pdashboard;
