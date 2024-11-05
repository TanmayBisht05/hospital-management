import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';




const SurgeryList = ({ patientID }) => {
  const [surgeries, setSurgeries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch surgeries for the patient
  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/surgeries/patient/${patientID}`);
        setSurgeries(response.data);
      } catch (error) {
        setErrorMessage('Failed to load surgeries.');
      }
    };

    fetchSurgeries();
  }, [patientID]);




  return (
    <div>
      <h2>Surgeries for Doctor ID: {doctorID}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {surgeries.length === 0 ? (
        <p>No surgeries found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Surgery ID</th>
              <th>Patient ID</th>
              <th>Type</th>
              <th>Critical Level</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surgery) => (
              <tr key={surgery.surgeryID}>
                <td>{surgery.surgeryID}</td>
                <td>{surgery.patientID}</td>
                <td>{surgery.type}</td>
                <td>{surgery.criticalLevel}</td>
                <td>{new Date(surgery.time).toLocaleString()}</td> {/* Display formatted time */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

SurgeryList.propTypes = {
  doctorID: PropTypes.number.isRequired,
};

export default SurgeryList;
