import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../AuthContext';

const AddPharmacyRequestForm = ({patientID}) => {
  const {backend_url} = useContext(AuthContext);
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

    axios.post(`${backend_url}/pharmacy`, body)
      .then(response => {
        alert('Pharmacy request added successfully!');
        setFormData({
          medicineName: '',
          amount: '',
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
        alert('Failed to add pharmacy request.');
      });
      window.location.reload();
  };

  return (
    <div className="login_div">
    <h2>Add Pharmacy Request</h2>
    <form className='login_form' onSubmit={handleSubmit}>
      <div className='login_div'>
        <label className='login_label'>Medicine Name:</label>
        <input className='login_input'
          type="text"
          name="medicineName"
          value={formData.medicineName}
          onChange={handleChange}
          required
        />
      </div>
      <div className='login_div'>
        <label className='login_label'>Amount:</label>
        <input className='login_input'
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <button className='login_button' type="submit">Add Request</button>
    </form>
    </div>
  );
};

export default AddPharmacyRequestForm;
