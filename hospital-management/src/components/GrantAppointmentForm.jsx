import React, { useState } from 'react';

const GrantAppointmentForm = ({ appointmentID, onGrant }) => {
  const [appointmentTime, setAppointmentTime] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onGrant(appointmentID, appointmentTime, cost);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Appointment Time:</label>
      <input
        type="datetime-local"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        required
      />
      <label>Cost:</label>
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        required
      />
      <button type="submit">Grant Appointment</button>
    </form>
  );
};

export default GrantAppointmentForm;