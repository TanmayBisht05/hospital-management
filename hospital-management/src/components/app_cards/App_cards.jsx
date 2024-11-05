import React from 'react';
import './app_cards.css';

const App_cards = ({ param, flag, onDelete }) => {
  const handleDelete = () => {
    onDelete(param.appointmentID); // Call the delete function with the appointment ID
  };

  if (flag === false) {
    return (
      <>
        {param.appointmentID !== undefined && param.appointmentID && flag === false ? (
          <div className="app_cards">
            <div className="app_cards_date">
              <p>{new Date(param.time).toLocaleString()}</p>
            </div>
            <div className="app_cards_details">
              <p><strong>Appointment ID:</strong> {param.appointmentID}</p>
              <p><strong>Doctor ID:</strong> {param.doctorID}</p>
              <p><strong>Status:</strong> {param.status === 0 ? 'Requested' : 'Granted'}</p>
              <button onClick={handleDelete} className="delete_button_app_cards">Delete</button> {/* Delete Button */}
            </div>
          </div>
        ) : (
          <div className="app_cards">
            <div className="app_cards_date">
              <p>{param.firstName} {param.lastName}</p>
            </div>
            <div className="app_cards_details">
              <p><strong>Doctor ID : </strong>{param.doctorID}</p>
              <p><strong>Post : </strong>{param.post}</p>
              <p><strong>Specialization : </strong>{param.specialization}</p>
              <p><strong>Department : </strong>{param.department}</p>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="app_cards">
        <div className="app_cards_date">
          <p>{new Date(param.time).toLocaleString()}</p>
        </div>
        <div className="app_cards_details">
          <p><strong>Appointment ID:</strong> {param.appointmentID}</p>
          <p><strong>Patient ID:</strong> {param.patientID}</p>
          <p><strong>Status:</strong> {param.status}</p>
          <p><strong>Cost:</strong> {param.cost}</p>
        </div>
        <button onClick={handleDelete} className="delete-button">Delete</button> {/* Delete Button */}
      </div>
    );
  }
};

export default App_cards;
