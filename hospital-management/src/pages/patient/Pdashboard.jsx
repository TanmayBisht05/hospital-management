import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import './pdashboard.css'
import AuthContext from '../../AuthContext.jsx'
import App_cards from '../../components/app_cards/App_cards.jsx'

const pdashboard = () => {
  const { pdashboardState } = React.useContext(AuthContext);

  return (
    <div className='pdashboard'>
      <Sidebar />
      <div className="main-content">
        {pdashboardState === 0 && <>
          <h1 className="dashboard-header">Profile</h1>
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
        </>}
        
        {pdashboardState === 4 && <>
          <h1 className="dashboard-header">History</h1>
        </>}
      </div>
    </div>
  )
}

export default pdashboard
