import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../AuthContext';

const PharmacyRequests = () => {
    const {handleDenyRequest, fetchPharmacyRequests, backend_url, pharmacyRequests, setPharmacyRequests} = useContext(AuthContext);

    useEffect(() => {
        fetchPharmacyRequests();
    }, []);

    const createBill = async (patientID, totalCost, type) => {
        // Construct the URL with query parameters
        const backendUrl = `${backend_url}/bill?patientID=${patientID}&totalCost=${totalCost}&type=${type}`; // Use template literals
    
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

    const checkMedicineExists = async (medicineName) => {
        const response = await fetch(`${backend_url}/medicines/medicine-id?name=${medicineName}`);
        const medicineID = await response.json();
        return medicineID !== 0 ? medicineID : null; // return the medicineID if exists
    };

    const getMedicineDetails = async (medicineId) => {
        const response = await fetch(`${backend_url}/medicines/${medicineId}`);
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
                const updateResponse = await fetch(`${backend_url}/medicines/${medicineId}`, {
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
                    await fetch(`${backend_url}/pharmacy/${requestId}`, { method: 'DELETE' });
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

    

    return (
        <div className='appointments'>
            <h2>Pharmacy Requests</h2>
            <div className="appointment_cards">
                {pharmacyRequests.length === 0 ? <p>No Requests as of now</p> :
                <>{pharmacyRequests.map((request) => (
                    <div className="app_cards" key={request.requestID}>
                        <div className="app_cards_date">Request ID : {request.requestID}</div>
                        <div className="app_cards_details">
                            <p>Medicine Name: {request.medicineName}</p>
                            <p>Requested Amount: {request.amount}</p>
                            <div className="login_div_horizontal">
                                <button className='login_button' onClick={() => handleAcceptRequest(request.requestID, request.medicineName, request.amount, request.patientID)}>Accept</button>
                                <button className='login_button button_red' onClick={() => handleDenyRequest(request.requestID)}>Deny</button>
                            </div>
                        </div>
                    </div>
                ))}</>}
            </div>
        </div>
    );
};

export default PharmacyRequests;
