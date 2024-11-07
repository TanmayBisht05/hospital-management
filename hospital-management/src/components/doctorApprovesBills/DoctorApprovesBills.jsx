import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorApprovesBills.css';

const DoctorApprovesBills = ({ doctorID }) => {
    const [appointments, setAppointments] = useState([]);
    const [surgeries, setSurgeries] = useState([]);
    const [bills, setBills] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointmentsAndSurgeriesAndBills = async () => {
            try {
                // Fetch appointments for the doctor
                const appointmentsResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming/billStatus1`);
                const appointmentsData = appointmentsResponse.data;

                // Fetch surgeries for the doctor
                const surgeriesResponse = await axios.get(`http://localhost:8080/surgeries/doctor/${doctorID}/upcoming/billStatus1`);
                const surgeriesData = surgeriesResponse.data;

                if (Array.isArray(appointmentsData)) {
                    setAppointments(appointmentsData);
                } else {
                    console.error('Unexpected response format for appointments:', appointmentsData);
                    setError('Unexpected response format for appointments');
                }

                if (Array.isArray(surgeriesData)) {
                    setSurgeries(surgeriesData);
                } else {
                    console.error('Unexpected response format for surgeries:', surgeriesData);
                    setError('Unexpected response format for surgeries');
                }

                // Fetch each bill's details for appointments and surgeries
                const billsData = {};
                await Promise.all(
                    [...appointmentsData, ...surgeriesData].map(async (item) => {
                        if (item.billID) {
                            const billResponse = await axios.get(`http://localhost:8080/bill/${item.billID}`);
                            billsData[item.billID] = billResponse.data;
                        }
                    })
                );

                setBills(billsData);
            } catch (error) {
                console.error('Error fetching appointments, surgeries, or bills:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentsAndSurgeriesAndBills();
    }, [doctorID]);

    const handleStatusChange = async (billID, status) => {
        try {
            await axios.patch(`http://localhost:8080/bill/${billID}/status`, null, {
                params: { status },
                headers: { 'Content-Type': 'application/json' },
            });
            // Refresh the displayed appointments and surgeries after status change
            setAppointments(appointments.filter(appointment => appointment.billID !== billID));
            setSurgeries(surgeries.filter(surgery => surgery.billID !== billID));
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

            {(appointments.length > 0 || surgeries.length > 0) ? (
                <table>
                    <thead>
                        <tr>
                            <th>Bill ID</th>
                            <th>Type</th>
                            <th>ID</th>
                            <th>Patient ID</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...appointments, ...surgeries].map(item => (
                            <tr key={item.appointmentID || item.surgeryID}>
                                <td>{item.billID}</td>
                                <td>{item.appointmentID ? 'Appointment' : 'Surgery'}</td>
                                <td>{item.appointmentID || item.surgeryID}</td>
                                <td>{item.patientID}</td>
                                <td>
                                    {bills[item.billID] ? bills[item.billID].totalCost : 'Loading...'}
                                </td>
                                <td>
                                    <button onClick={() => handleStatusChange(item.billID, 2)}>Accept</button>
                                    <button onClick={() => handleStatusChange(item.billID, 0)}>Deny</button>
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
