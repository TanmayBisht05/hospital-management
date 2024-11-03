import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SidebarDoctor from '../../components/sidebarDoctor/sidebarDoctor.jsx';
import './ddashboard.css';
import AuthContext from '../../AuthContext.jsx';
import App_cards from '../../components/app_cards/App_cards.jsx';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import SurgeryForm from '../../components/surgery/surgeryform.jsx';
import SurgeryList from '../../components/surgery/surgeryList.jsx';
import GrantAppointmentForm from '../../components/GrantAppointmentForm.jsx';


const Ddashboard = () => {
  const { pdashboardState, setPdashboardState } = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surgeries, setSurgeries] = useState([]);
  const [newSurgery, setNewSurgery] = useState({
    surgeryID: "",
    patientID: "",
    type: "",
    criticalLevel: "",
  });
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const doctorId = parseInt(Cookies.get('id'), 10);

  useEffect(() => {
    if (!token || userType !== 'DOCTOR' || isNaN(doctorId)) {
      navigate('/login');
      return;
    }

    fetchDoctorData(doctorId);
    fetchAppointments();
  }, [navigate, token, userType, doctorId]);

  const fetchDoctorData = useCallback(async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8080/doctor/${doctorId}`);
      if (!response.ok) throw new Error('Failed to fetch doctor data');
      const data = await response.json();
      setDoctorData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      // Fetch requested appointments
      const requestedResponse = await fetch(`http://localhost:8080/appointments/doctor/${doctorId}/requested`, {
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
      const upcomingResponse = await fetch(`http://localhost:8080/appointments/doctor/${doctorId}/upcoming`, {
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
      const previousResponse = await fetch(`http://localhost:8080/appointments/doctor/${doctorId}/previous`, {
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
  }, [doctorId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const grantAppointment = async (appointmentID, appointmentTime, cost) => {
    try {
      const response = await fetch(`http://localhost:8080/appointments/doctor/${doctorId}/grant`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentID, appointmentTime, cost }),
      });
      const message = await response.text();
      if (response.ok) {
        alert(message);
        fetchAppointments(); // Refresh the appointments list
      } else {
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error granting appointment:', error);
    }
  };


  const renderContent = () => {
    if (loading) return <h1 className="dashboard-header">Loading...</h1>;
    if (error) return <h1 className="dashboard-header">{error}</h1>;

    switch (pdashboardState) {
      case 0:
        return (
          <div className="doctor-profile">
            <h1 className="dashboard-header">Profile</h1>
            {doctorData && (
              <>
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
              </>
            )}
          </div>
        );

      case 1:
        return (
          <>
            <h1 className="dashboard-header">Appointments</h1>
            <div className="appointments">
              <h2>Upcoming Appointments</h2>
              <div className="appointment_cards">
                {upcomingAppointments.map(app => (
                  <App_cards key={app.appointmentID} appointment={app} />
                ))}
              </div>
            </div>
            <div className="appointments">
              <h2>Previous Appointments</h2>
              <div className="appointment_cards">
                {previousAppointments.map(app => (
                  <App_cards key={app.appointmentID} appointment={app} />
                ))}
              </div>
            </div>
            <div className="appointments">
              <h2>Requested Appointments</h2>
              <div className="appointment_cards">
                {requestedAppointments.map(app => (
                  <App_cards key={app.appointmentID} appointment={app} />
                ))}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
          
          <h1 className="dashboard-header">Grant Requested Appointments</h1>
          <div>
            {requestedAppointments.map((appointment) => (
              <div key={appointment.appointmentID}>
                <p>Patient ID: {appointment.patientID}</p>
                <p>Requested Date: {new Date(appointment.requestedDate).toLocaleString()}</p>
                <GrantAppointmentForm
                  appointmentID={appointment.appointmentID}
                  onGrant={grantAppointment}
                />
              </div>
            ))}
          </div>
          </>

        );
      case 3:
        return (
          <div>
            <SurgeryForm doctorID={doctorId} />
            <SurgeryList doctorID={doctorId} />
          </div>
        );
        
      case 4:
        return <h1 className="dashboard-header">History</h1>;
      case 5:
        return <h1 className="dashboard-header">Requested Appointments</h1>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <Fake />
      <div className='ddashboard'>
  
        <SidebarDoctor />
        <div className="main-content">
          {renderContent()} 
         </div>
      </div>
    </div>
  );
};

export default Ddashboard;
