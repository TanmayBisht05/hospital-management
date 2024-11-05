import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingRequests = ({ patientID }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientID) {
      axios.get(`http://localhost:8080/pharmacy/${patientID}`)
        .then(response => {
          setRequests(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch requests.');
          setLoading(false);
        });
    }
  }, [patientID]);

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Pharmacy Requests for Patient ID: {patientID}</h2>
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Medicine Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.requestID}>
                <td>{request.requestID}</td>
                <td>{request.medicineName}</td>
                <td>{request.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests found for this patient.</p>
      )}
    </div>
  );
};

export default PendingRequests;
