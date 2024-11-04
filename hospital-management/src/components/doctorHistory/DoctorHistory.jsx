// DoctorHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorHistory.css';

const DoctorHistory = ({ doctorID }) => {
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [selectedAppointmentID, setSelectedAppointmentID] = useState(null);
    const [prescriptionError, setPrescriptionError] = useState(null);

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

    const handlePrescriptionChange = (e) => {
        setPrescription(e.target.value);
    };

    const handleAddPrescription = async (appointmentID) => {
        try {
            const response = await axios.put(`http://localhost:8080/appointments/${appointmentID}/update-prescription`, null, {
                params: { prescription }
            });
            alert(response.data);
            // Optionally refresh the appointments after adding a prescription
            setPrescription(''); // Clear the input
            setSelectedAppointmentID(null); // Deselect the appointment
            // Fetch previous appointments again to see updated data
            fetchPreviousAppointments();
        } catch (error) {
            console.error('Error updating prescription:', error);
            setPrescriptionError('Failed to update prescription. Ensure the appointment ID is valid.');
        }
    };

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
                            <th>Action</th>
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
                                <td>
                                    <button onClick={() => setSelectedAppointmentID(appointment.appointmentID)}>
                                        Add Prescription
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No previous appointments found.</p>
            )}

            {selectedAppointmentID && (
                <div>
                    <h3>Add Prescription for Appointment ID: {selectedAppointmentID}</h3>
                    <textarea
                        value={prescription}
                        onChange={handlePrescriptionChange}
                        placeholder="Enter prescription (max 500 characters)"
                        maxLength="500"
                    />
                    <button onClick={() => handleAddPrescription(selectedAppointmentID)}>Submit Prescription</button>
                    {prescriptionError && <div style={{ color: 'red' }}>{prescriptionError}</div>}
                </div>
            )}
        </div>
    );
};

export default DoctorHistory;
