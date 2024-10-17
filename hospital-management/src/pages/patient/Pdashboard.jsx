import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import './pdashboard.css'
const pdashboard = () => {
  return (
    <div className='pdashboard'>
      <Sidebar />
      <div className="main-content">
        <h1 className="dashboard-header">Welcome to Your Dashboard</h1>
      </div>
    </div>
  )
}

export default pdashboard
