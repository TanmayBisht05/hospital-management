import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../AuthContext';

const PendingRequests = ({ patientID }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleDenyRequest, backend_url } = useContext(AuthContext);
  const fetch_requests = () => {
    axios.get(`${backend_url}/pharmacy/${patientID}`)
      .then(response => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch requests.');
        setLoading(false);
      });
  }
  useEffect(() => {
    if (patientID) {
      fetch_requests();
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.requestID}>
                <td>{request.requestID}</td>
                <td>{request.medicineName}</td>
                <td>{request.amount}</td>
                <td><button className='login_button button_red' onClick={async () => { await handleDenyRequest(request.requestID); fetch_requests();}}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <center><p>No pending requests found for this patient.</p></center>
      )}
    </div>
  );
};

export default PendingRequests;
