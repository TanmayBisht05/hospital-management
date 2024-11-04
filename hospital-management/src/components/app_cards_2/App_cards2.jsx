import React from 'react';
import './app_cards_2.css';

const App_cards_2 = ({ param, flag, onDelete }) => {
  // Function to render the prescription details if available
  const renderPrescription = () => {
    if (param.prescription) {
      return (
        <div className="prescription_box">
          <h4>Prescription:</h4>
          <p>{param.prescription}</p>
        </div>
      );
    }
    return null; // Return null if no prescription is available
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
              {renderPrescription()} {/* Call the renderPrescription function here */}
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
              {renderPrescription()} {/* Call the renderPrescription function here */}
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
          {renderPrescription()} {/* Call the renderPrescription function here */}
        </div>
      </div>
    );
  }
};

export default App_cards_2;
