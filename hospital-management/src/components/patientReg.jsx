import React, { useState } from 'react';

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    ntk: '',
    email: '',
    gender: '',
    medHistory: '',
    dob: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const result = await response.json();
      console.log(result);

      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        ntk: '',
        email: '',
        gender: '',
        medHistory: '',
        dob: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="patient-registration">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            maxLength="50"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            maxLength="50"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Address:
          <textarea
            name="address"
            maxLength="200"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        
        <label>
          NTK (Next of Kin):
          <input
            type="text"
            name="ntk"
            maxLength="50"
            value={formData.ntk}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Email:
          <input
            type="email"
            name="email"
            maxLength="80"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </label>
        
        <label>
          Medical History:
          <textarea
            name="medHistory"
            maxLength="500"
            value={formData.medHistory}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Password:
          <input
            type="password"
            name="password"
            maxLength="255"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
