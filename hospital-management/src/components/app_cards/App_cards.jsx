import React from 'react';
import './app_cards.css';

const App_cards = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <h3>Appointment Details</h3>
      <p><strong>Appointment ID:</strong> {appointment.appointmentID}</p>
      <p><strong>Doctor ID:</strong> {appointment.doctorID}</p>
      <p><strong>Patient ID:</strong> {appointment.patientID}</p>
      <p><strong>Time:</strong> {new Date(appointment.time).toLocaleString()}</p>
      <p><strong>Status:</strong> {appointment.status === 0 ? 'Requested' : 'Granted'}</p>
      {/* Additional fields as required */}
    </div>
  );
};

export default App_cards;