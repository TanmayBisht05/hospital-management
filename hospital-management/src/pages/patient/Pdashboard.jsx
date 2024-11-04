import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import './pdashboard.css';
import AuthContext from '../../AuthContext.jsx';
import App_cards from '../../components/app_cards/App_cards.jsx';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import UserInfo from './profile.jsx';
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
      fetchPatientData();
      fetchDoctors();
      fetchAppointments();
    }
  }, [navigate, token, userType, id]);

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

  const fetchAppointments = async () => {
    try {
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

  const handleDeleteAppointment = async (appointmentID) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        console.log(appointmentID);

        const response = await fetch(`${backend_url}/appointments/${appointmentID}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Appointment successfully deleted.');
          fetchAppointments(); // Refresh the appointments after deletion
        } else {
          console.log(response);
          const message = await response.text();
          alert(message || 'Failed to delete appointment.');
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
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
          {pdashboardState === 1 && (
            <div>
              <center><h1 className="dashboard-header">Upcoming Appointments</h1></center>
              <div className="appointments">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))
                ) : (
                  <p>No upcoming appointments.</p>
                )}
              </div>
              <center><h1 className="dashboard-header">Previous Appointments</h1></center>
              <div className="appointments">
                {previousAppointments.length > 0 ? (
                  previousAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))
                ) : (
                  <p>No previous appointments.</p>
                )}
              </div>
            </div>
          )}
          {pdashboardState === 2 && (
            <div>
              <center><h1 className="dashboard-header">Requested Appointments</h1></center>
              <div className="appointments">
                {requestedAppointments.length > 0 ? (
                  requestedAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))
                ) : (
                  <p>No requested appointments.</p>
                )}
              </div>
            </div>
          )}
          {pdashboardState === 3 && (
            <div>
              <h1>Consult a Doctor</h1>
              <select onChange={handleDoctorChange} value={selectedDoctorID}>
                <option value="">Select a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
              <button onClick={handleRequestAppointment}>Request Appointment</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default pdashboard;
