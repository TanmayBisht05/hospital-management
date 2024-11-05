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
    cost:'',
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
        const resp = await axios.get(`http://localhost:8080/patients/by-email?email=${formData.patientEmail}`)
        console.log(resp.data)
        const body = {
            "patientID": resp.data.patientID,
            "type": formData.type,
            "criticalLevel": formData.criticalLevel,
            "cost": formData.cost

        }

      const response = await fetch(`http://localhost:8080/surgery/${doctorID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccessMessage('Surgery registered successfully!');
        setFormData({ surgeryID: '', patientEmail: '', type: '', criticalLevel: '' }); // Reset form

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

          <label className='login_label'>Patient Email:</label>
          <input className='login_input'
            type="text"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            required
          />
          </div>


          <div className="login_div">

          <label className='login_label'>Type:</label>
          <input className='login_input'
            type="text"
            name="type"
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
            value={formData.criticalLevel}
            onChange={handleChange}
            required
          />
          </div>
        
          <div className="login_div">
          <label className='login_label'>Cost:</label>
          <input className='login_input'
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
          </div>


        <button className='login_button' type="submit">Add Surgery</button>
      </form>
      </div>
      {/* <SurgeryList doctorID={doctorID} /> */}
    </div>

  );
};

// Ensure doctorID is passed as a prop
SurgeryForm.propTypes = {
  doctorID: PropTypes.number.isRequired,
};

export default SurgeryForm;
