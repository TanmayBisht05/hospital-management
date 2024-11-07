import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AuthContext from '../../AuthContext';

const SurgeryForm = ({ doctorID }) => {
  const {getMinDateTime, backend_url, fetchSurgeries} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    patientID: '', // Changed from patientEmail to patientID
    type: '',
    criticalLevel: '',
    cost: '',
    time: '', // For the surgery time
  });
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
      const body = {
        patientID: formData.patientID, // Using patientID directly
        doctorID: doctorID, // Include the doctorID
        totalCost: formData.cost,
        criticalLevel: formData.criticalLevel,
        time: new Date(formData.time).toISOString(), // Convert to ISO format if needed
      };

      const response = await fetch(`${backend_url}/surgeries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const surgeryID = await response.json(); // Assuming the response returns the surgery ID
        setSuccessMessage(`Surgery registered successfully! Surgery ID: ${surgeryID}`);
        setFormData({ patientID: '', type: '', criticalLevel: '', cost: '', time: '' }); // Reset form
        fetchSurgeries(doctorID);
      } else {
        throw new Error('Failed to register surgery');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login_div">
      <h2>Register New Surgery</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="login_div">
        <form className='login_form' onSubmit={handleSubmit}>
          <div className="login_div">
            <label className='login_label'>Patient ID:</label>
            <input className='login_input'
              type="number"
              placeholder='Patient ID'
              name="patientID"
              value={formData.patientID}
              onChange={handleChange}
              required
              min={0}
            />
          </div>

          <div className="login_div">
            <label className='login_label'>Type:</label>
            <input className='login_input'
              type="text"
              name="type"
              placeholder='Type of surgery'
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login_div">
            <label className='login_label'>Critical Level:</label>
            <input className='login_input'
              type="number"
              name="criticalLevel"
              placeholder='Critical level (0-10)'
              value={formData.criticalLevel}
              onChange={handleChange}
              required
              min={0}
              max={10}
            />
          </div>
        
          <div className="login_div">
            <label className='login_label'>Cost:</label>
            <input className='login_input'
              type="number"
              min={0}
              name="cost"
              placeholder='Cost'
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login_div">
            <label className='login_label'>Time:</label>
            <input className='login_input'
              type="datetime-local" // Using datetime for the surgery time
              name="time"
              value={formData.time}
              onChange={handleChange}
              min={getMinDateTime()}
              required
            />
          </div>

          <button className='login_button' type="submit">Add Surgery</button>
        </form>
      </div>
    </div>
  );
};

// Ensure doctorID is passed as a prop
SurgeryForm.propTypes = {
  doctorID: PropTypes.number.isRequired,
};

export default SurgeryForm;
