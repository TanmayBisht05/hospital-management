import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PharmacyRequests = () => {
    const [pharmacyRequests, setPharmacyRequests] = useState([]);

    useEffect(() => {
        fetchPharmacyRequests();
    }, []);

    const createBill = async (patientID, totalCost, type) => {
        // Construct the URL with query parameters
        const backendUrl = `http://localhost:8080/bill?patientID=${patientID}&totalCost=${totalCost}&type=${type}`; // Use template literals
    
        try {
            // Make the POST request
            const response = await axios.post(backendUrl);
    
            // Handle the response
            if (response.status === 201) {
                console.log('Bill created successfully:', response.data);
                return response.data; // Return the created bill data if needed
            } else {
                console.error('Failed to create bill:', response.data);
            }
        } catch (error) {
            console.error('Error creating bill:', error);
        }
    };

    const fetchPharmacyRequests = async () => {
        const response = await fetch('http://localhost:8080/pharmacy');
        const data = await response.json();
        setPharmacyRequests(data);
    };

    const checkMedicineExists = async (medicineName) => {
        const response = await fetch(`http://localhost:8080/medicines/medicine-id?name=${medicineName}`);
        const medicineID = await response.json();
        return medicineID !== 0 ? medicineID : null; // return the medicineID if exists
    };

    const getMedicineDetails = async (medicineId) => {
        const response = await fetch(`http://localhost:8080/medicines/${medicineId}`);
        const medicineDetails = await response.json();
        return medicineDetails; // Assuming this returns an object with the medicine details
    };

    const handleAcceptRequest = async (requestId, medicineName, requestedAmount, patientID) => {
        const medicineId = await checkMedicineExists(medicineName);
        if (medicineId) {
            const medicineDetails = await getMedicineDetails(medicineId);
            if (medicineDetails.amount >= requestedAmount) {

                const body = {
                    medicineID: medicineId,
                    medicineName: medicineDetails.medicineName,
                    type: medicineDetails.type,
                    cost: medicineDetails.cost,
                    companyName: medicineDetails.companyName,
                    amount: medicineDetails.amount - requestedAmount, // Update the amount
                };
    
                // Make the PUT request to update the medicine details
                const updateResponse = await fetch(`http://localhost:8080/medicines/${medicineId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
    
                if (updateResponse.ok) {
                    // Proceed with accepting the request (you would call your API to accept the request here)

                    const totalCost = requestedAmount * medicineDetails.cost; // Calculate TotalCost
                    const billBody = {
                        "patientID": patientID,
                        "totalCost": totalCost,
                        "type": "pharmacy",

                    };
                    
                    createBill(patientID, totalCost, "Pharmacy");
                    await fetch(`http://localhost:8080/pharmacy/${requestId}`, { method: 'DELETE' });
                    fetchPharmacyRequests(); // Refresh the list after denying


                } else {
                    alert("Failed to update medicine inventory.");
                }
            } else {
                alert("Not enough medicine.");
            }
        } else {
            alert("This medicine does not exist in the inventory.");
        }
    };

    const handleDenyRequest = async (requestId) => {
        // Call the deny request API here (like the existing API to deny the request)
        console.log(`Denying request ${requestId}`);
        // Example of API call to deny the request
        await fetch(`http://localhost:8080/pharmacy/${requestId}`, { method: 'DELETE' });
        fetchPharmacyRequests(); // Refresh the list after denying
    };

    return (
        <div>
            <h2>Pharmacy Requests</h2>
            <div className="pharmacy-requests">
                {pharmacyRequests.map((request) => (
                    <div className="request-card" key={request.requestID}>
                        <p>Medicine Name: {request.medicineName}</p>
                        <p>Requested Amount: {request.amount}</p>
                        <button onClick={() => handleAcceptRequest(request.requestID, request.medicineName, request.amount, request.patientID)}>Accept</button>
                        <button onClick={() => handleDenyRequest(request.requestID)}>Deny</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PharmacyRequests;
