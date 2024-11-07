import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../AuthContext';

const PendingRequests = ({ patientID }) => {
  const {requestsPharmacy, fetch_requests_pharmacy, handleDenyRequest} = useContext(AuthContext);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (patientID) {
      fetch_requests_pharmacy(patientID);
    }
  }, [patientID]);
  if (error) return <p>{error}</p>

  return (
    <div className='appointments'>
      <h2>Pharmacy Requests for Patient ID: {patientID}</h2>
      {requestsPharmacy.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Medicine Name</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestsPharmacy.map(request => (
              <tr key={request.requestID}>
                <td>{request.requestID}</td>
                <td>{request.medicineName}</td>
                <td>{request.amount}</td>
                <td><button className='login_button button_red' onClick={async () => { await handleDenyRequest(request.requestID); fetch_requests_pharmacy(patientID);}}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="appointment_cards">
          <center><p>No pending requests found for this patient.</p></center>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
