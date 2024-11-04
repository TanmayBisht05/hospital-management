import React from 'react';
import './patientbills.css';

const PatientBills = ({ unpaidBills, handlePayBill }) => {
  return (
    <div className="patient-bills">
      <h1>Pending Bills</h1>
      {unpaidBills.length > 0 ? (
        unpaidBills.map((bill) => (
          <div key={bill.billID} className="bill-item">
            <p><strong>Bill ID:</strong> {bill.billID}</p>
            <p><strong>Amount:</strong> ${bill.totalCost}</p>
            <p><strong>Type:</strong> ${bill.type}</p>
            
            <button onClick={() => handlePayBill(bill.billID)} className="pay-button">Pay</button>
          </div>
        ))
      ) : (
        <p>No pending bills.</p>
      )}
    </div>
  );
};

export default PatientBills;
