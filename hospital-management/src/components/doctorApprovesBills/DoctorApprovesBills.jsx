import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorApprovesBills.css';

const DoctorApprovesBills = ({ doctorID }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming/billStatus1`);
                console.log(response);
                if (Array.isArray(response.data)) {
                    setBills(response.data);
                } else {
                    console.error('Unexpected response format for bills:', response.data);
                    setError('Unexpected response format for bills');
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
                setError('Error fetching bills');
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, [doctorID]);

    const handleStatusChange = async (billID, status) => {
        try {
            await axios.patch(`http://localhost:8080/bill/${billID}/status`, null, {
                params: { status },
                headers: { 'Content-Type': 'application/json' },
            });
            // Refresh the bills after status change
            setBills(bills.filter(bill => bill.billID !== billID));
            alert(status === 2 ? "Bill accepted" : "Bill denied");
        } catch (error) {
            console.error(`Error updating bill status for bill ID ${billID}:`, error);
            alert('Error updating bill status');
        }
    };

    if (loading) return <div>Loading bills...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <center><h1>Pending Bills</h1></center>
            {bills.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Bill ID</th>
                            <th>Appointment ID</th>
                            <th>Patient ID</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill.billID}>
                                <td>{bill.billID}</td>
                                <td>{bill.appointmentID}</td>
                                <td>{bill.patientID}</td>
                                <td>{bill.cost}</td>
                                <td>
                                    <button onClick={() => handleStatusChange(bill.billID, 2)}>Accept</button>
                                    <button onClick={() => handleStatusChange(bill.billID, 0)}>Deny</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <center><p>No pending bills found.</p></center>
            )}
        </div>
    );
};

export default DoctorApprovesBills;
