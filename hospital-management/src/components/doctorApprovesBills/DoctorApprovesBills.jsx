import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorApprovesBills.css';

const DoctorApprovesBills = ({ doctorID }) => {
    const [appointments, setAppointments] = useState([]);
    const [bills, setBills] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointmentsAndBills = async () => {
            try {
                // Fetch appointments for the doctor
                const appointmentsResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming/billStatus1`);
                const appointmentsData = appointmentsResponse.data;
                console.log(appointmentsData);
                if (Array.isArray(appointmentsData)) {
                    setAppointments(appointmentsData);

                    // Fetch each bill's details
                    const billsData = {};
                    await Promise.all(
                        appointmentsData.map(async (appointment) => {
                            if (appointment.billID) {
                                const billResponse = await axios.get(`http://localhost:8080/bill/${appointment.billID}`);
                                console.log(billResponse);
                                billsData[appointment.billID] = billResponse.data;
                            }
                        })
                    );

                    setBills(billsData);
                } else {
                    console.error('Unexpected response format for appointments:', appointmentsData);
                    setError('Unexpected response format for appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments or bills:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentsAndBills();
    }, [doctorID]);

    const handleStatusChange = async (billID, status) => {
        try {
            await axios.patch(`http://localhost:8080/bill/${billID}/status`, null, {
                params: { status },
                headers: { 'Content-Type': 'application/json' },
            });
            // Refresh the appointments and bills after status change
            setAppointments(appointments.filter(appointment => appointment.billID !== billID));
            alert(status === 2 ? "Bill accepted" : "Bill denied");
        } catch (error) {
            console.error(`Error updating bill status for bill ID ${billID}:`, error);
            alert('Error updating bill status');
        }
    };

    if (loading) return <div>Loading bills...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='appointments'>
            <center><h1>Pending Bills</h1></center>

            {appointments.length > 0 ? (
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
                        {appointments.map(appointment => (
                            <tr key={appointment.appointmentID}>
                                <td>{appointment.billID}</td>
                                <td>{appointment.appointmentID}</td>
                                <td>{appointment.patientID}</td>
                                <td>
                                    {bills[appointment.billID] ? bills[appointment.billID].totalCost : 'Loading...'}
                                </td>

                                <td>
                                    <button onClick={() => handleStatusChange(appointment.billID, 2)}>Accept</button>
                                    <button onClick={() => handleStatusChange(appointment.billID, 0)}>Deny</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="appointment_cards">
                    <center><p>No pending bills found.</p></center>
                </div>
            )}
        </div>
    );
};

export default DoctorApprovesBills;
