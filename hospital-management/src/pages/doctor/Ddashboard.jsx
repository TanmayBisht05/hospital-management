import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
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
import DoctorAppointments from '../../components/doctorAppointments/DoctorAppointments.jsx';
import DoctorHistory from '../../components/doctorHistory/DoctorHistory.jsx';
import DoctorApprovesBills from '../../components/doctorApprovesBills/DoctorApprovesBills.jsx';
import DoctorSalaries from '../../components/doctorSalaries/DoctorSalaries.jsx';
import MachineHiring from '../../components/machineHiring/MachineHiring.jsx';
import { all } from 'axios';

const Ddashboard = () => {
  const { pdashboardState, setPdashboardState, logout } = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const doctorId = parseInt(Cookies.get('id'), 10);
  const should_fetch_doctor_data = useRef(true);

  useEffect(() => {
    if (!token || userType !== 'DOCTOR' || isNaN(doctorId)) {
      navigate('/login');
      return;
    }
    if(should_fetch_doctor_data.current) {
      fetchDoctorData(doctorId);
      should_fetch_doctor_data.current = false;
    }
  }, []);

  const fetchDoctorData = useCallback(async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8080/doctor/${doctorId}`);
      if (!response.ok) {
        alert('Failed to fetch doctor data');
        logout();
        navigate('/');
      }
      const data = await response.json();
      setDoctorData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (loading) return <h1 className="dashboard-header">Loading...</h1>;
    if (error) return <h1 className="dashboard-header">{error}</h1>;

    switch (pdashboardState) {
      case 0:

        return (
            <div className="appointments">
            <div className="doctor-profile">
              <h1 className="dashboard-header">Doctor Profile</h1>
              {doctorData && (
              <>
                <div className="profile-detail">
                  <span className="profile-icon">👤</span>
                  <p className="profile-text"><span className="profile-label">First Name:</span> <span className="profile-value">{doctorData.firstName}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">👤</span>
                  <p className="profile-text"><span className="profile-label">Last Name:</span> <span className="profile-value">{doctorData.lastName}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🎂</span>
                  <p className="profile-text"><span className="profile-label">Date of Birth:</span> <span className="profile-value">{new Date(doctorData.dob).toLocaleDateString()}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🎓</span>
                  <p className="profile-text"><span className="profile-label">Education:</span> <span className="profile-value">{doctorData.education}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">⚧️</span>
                  <p className="profile-text"><span className="profile-label">Gender:</span> <span className="profile-value">{doctorData.gender}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">📞</span>
                  <p className="profile-text"><span className="profile-label">Phone:</span> <span className="profile-value">{doctorData.phone}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">📧</span>
                  <p className="profile-text"><span className="profile-label">Email:</span> <span className="profile-value">{doctorData.email}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🏷️</span>
                  <p className="profile-text"><span className="profile-label">Post:</span> <span className="profile-value">{doctorData.post}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🏥</span>
                  <p className="profile-text"><span className="profile-label">Department:</span> <span className="profile-value">{doctorData.department}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🩺</span>
                  <p className="profile-text"><span className="profile-label">Specialization:</span> <span className="profile-value">{doctorData.specialization}</span></p>
                </div>
              </>
            )}
          </div>
            </div>
);

        

      case 1:
        return (
          <div>
            <DoctorAppointments doctorID={doctorId} />
          </div>
        );

      case 2:
        return (
          <div className='appointments'>
            <center><h1>Surgery</h1></center>
            <SurgeryForm doctorID={doctorId} />
            <SurgeryList doctorID={doctorId} />
          </div>
        );

        case 3:
          return (
            <div>
              <DoctorApprovesBills doctorID={doctorId} />
            </div>
          );

      
        case 4:
          return (
            <div className='appointments'>
              <center><h1>Salary</h1></center>
              <DoctorSalaries doctorID={doctorId} />
            </div>
          );

        case 5:
          return (
            <div className='appointments'>
              <DoctorHistory doctorID={doctorId} />
            </div>
          );


        case 6:
        return <MachineHiring doctorID={doctorId} />; 


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
