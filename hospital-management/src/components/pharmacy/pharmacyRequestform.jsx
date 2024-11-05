import React, { useState } from 'react';
import axios from 'axios';

const AddPharmacyRequestForm = ({patientID}) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    patientID: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
        "medicineName": formData.medicineName,
        "amount": formData.amount,
        "patientID": patientID
    }

    axios.post('http://localhost:8080/pharmacy', body)
      .then(response => {
        alert('Pharmacy request added successfully!');
        setFormData({
          medicineName: '',
          amount: '',
        });
      })
      .catch(error => {
        alert('Failed to add pharmacy request.');
        console.error('There was an error!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Medicine Name:</label>
        <input
          type="text"
          name="medicineName"
          value={formData.medicineName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Request</button>
    </form>
  );
};

export default AddPharmacyRequestForm;
