import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaSyringe, FaUserInjured } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="text-light mb-4">Patient Dashboard</h2>
                <Link to="/">
                    <FaHome /> Home
                </Link>
                <Link to="/appointments">
                    <FaCalendarAlt /> Appointments
                </Link>
                <Link to="/new_appointment">
                    <FaSyringe /> New Appointment
                </Link>
                <Link to = "/pending_bills">
                    <MdPending /> Pending Bills
                </Link>
                <Link to="/patient_details">
                    <FaUserInjured /> History
                </Link>
        </div>
    );
};

export default Sidebar;
