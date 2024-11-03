// DoctorHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorHistory.css'; // Optional: For styling

const DoctorHistory = ({ doctorID }) => {
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPreviousAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/previous`);
                setPreviousAppointments(response.data);
            } catch (error) {
                console.error('Error fetching previous appointments:', error);
                setError('Error fetching previous appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchPreviousAppointments();
    }, [doctorID]);

    if (loading) return <div>Loading previous appointments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Previous Appointments for Doctor ID: {doctorID}</h2>
            {previousAppointments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Patient ID</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {previousAppointments.map(appointment => (
                            <tr key={appointment.appointmentID}>
                                <td>{appointment.appointmentID}</td>
                                <td>{appointment.patientID}</td>
                                <td>{appointment.cost}</td>
                                <td>Previous</td>
                                <td>{appointment.time ? new Date(appointment.time).toLocaleString() : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No previous appointments found.</p>
            )}
        </div>
    );
};

export default DoctorHistory;
