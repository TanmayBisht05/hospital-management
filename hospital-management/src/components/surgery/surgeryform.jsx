import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SurgeryList from './surgeryList';
import axios from 'axios';

const SurgeryForm = ({ doctorID }) => {
  const [formData, setFormData] = useState({
    surgeryID: '',
    patientID: '',
    type: '',
    criticalLevel: '',
  });
  const [refresh, setRefresh] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
        
        const resp = await axios.get(`http://localhost:8080/patients/by-email?email=${formData.patientID}`);
        // console.log(resp.data.patientID)
        // formData.patientID = resp.data.patientID;
        // console.log(resp.data.patientID)
        
        const body = {
            "patientID": resp.data.patientID,
            "doctorID": doctorID,
            "type": formData.type,
            "criticalLevel": formData.criticalLevel,
            "cost": formData.cost

        }

        console.log(body)
        
      const response = await fetch(`http://localhost:8080/surgery/${doctorID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccessMessage('Surgery registered successfully!');
        setFormData({patientID: '', type: '', criticalLevel: '', cost: '' }); // Reset form

      } else {
        throw new Error('Failed to register surgery');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="surgery-form">
      <h2>Register New Surgery</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
       
        <div>
          <label>Patient Email:</label>
          <input
            type="text"
            name="patientID"
            value={formData.patientID}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Critical Level:</label>
          <input
            type="number"
            name="criticalLevel"
            value={formData.criticalLevel}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cost:</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Surgery</button>
      </form>
      <SurgeryList doctorID={doctorID} />
    </div>

  );
};

// Ensure doctorID is passed as a prop
SurgeryForm.propTypes = {
  doctorID: PropTypes.number.isRequired,
};

export default SurgeryForm;
