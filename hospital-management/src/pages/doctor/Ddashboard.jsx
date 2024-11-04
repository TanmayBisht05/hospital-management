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
import DoctorAppointments from '../../components/doctorAppointments/DoctorAppointments.jsx';
import DoctorHistory from '../../components/doctorHistory/DoctorHistory.jsx';
import DoctorSalaries from '../../components/doctorSalaries/DoctorSalaries.jsx';
import DoctorApprovesBills from '../../components/doctorApprovesBills/DoctorApprovesBills.jsx';

const Ddashboard = () => {
  const { pdashboardState, setPdashboardState } = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const doctorId = parseInt(Cookies.get('id'), 10);

  useEffect(() => {
    if (!token || userType !== 'DOCTOR' || isNaN(doctorId)) {
      navigate('/login');
      return;
    }
    fetchDoctorData(doctorId);
  }, [navigate]);

  const fetchDoctorData = useCallback(async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8080/doctor/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor data');
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
          <div>
            <DoctorAppointments doctorID={doctorId} />
          </div>
        );

      case 2:
        return (
          <div>
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

      case 5:
        return (
          <div>
            <DoctorHistory doctorID={doctorId} />
          </div>
        );
        case 4:
          return (
            <div>
              <DoctorSalaries doctorID={doctorId} />
            </div>
          );

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
