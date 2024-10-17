import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import './pdashboard.css'
import AuthContext from '../../AuthContext.jsx'
const pdashboard = () => {
  const { pdashboardState } = React.useContext(AuthContext);

  return (
    <div className='pdashboard'>
      <Sidebar />
      <div className="main-content">
        {pdashboardState === 0 && <div><h1 className="dashboard-header">Profile</h1></div>}
        {pdashboardState === 1 && <div><h1 className="dashboard-header">Appointments</h1></div>}
        {pdashboardState === 2 && <div><h1 className="dashboard-header">New Appointment</h1></div>}
        {pdashboardState === 3 && <div><h1 className="dashboard-header">Pending Bills</h1></div>}
        {pdashboardState === 4 && <div><h1 className="dashboard-header">History</h1></div>}
      </div>
    </div>
  )
}

export default pdashboard
