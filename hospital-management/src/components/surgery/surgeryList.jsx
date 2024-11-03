import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const SurgeryList = ({ doctorID }) => {
  const [surgeries, setSurgeries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch surgeries for the doctor
  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/surgery/doctor/${doctorID}`);
        setSurgeries(response.data);
      } catch (error) {
        setErrorMessage('Failed to load surgeries.');
      }
    };

    fetchSurgeries();
  }, [doctorID]);

  // Delete a surgery
  const handleDelete = async (surgeryID) => {
    try {
      await axios.delete(`http://localhost:8080/surgery/delete/${surgeryID}`);
      setSurgeries((prevSurgeries) => prevSurgeries.filter((surgery) => surgery.surgeryID !== surgeryID));
    } catch (error) {
      setErrorMessage('Failed to delete surgery.');
    }
  };

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
                <td>
                  <button onClick={() => handleDelete(surgery.surgeryID)}>Delete</button>
                </td>
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
