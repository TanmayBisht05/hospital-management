import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorAppointments.css';

const DoctorAppointments = ({ doctorID }) => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [schedulingData, setSchedulingData] = useState({
        appointmentID: null,
        time: '',
        cost: '',
        patientID: null, // To hold the patient ID when scheduling
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Fetch upcoming appointments
                const upcomingResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming`);
                if (Array.isArray(upcomingResponse.data)) {
                    const updatedAppointments = await Promise.all(upcomingResponse.data.map(async (appointment) => {
                        // Fetch cost from the corresponding bill
                        const billResponse = await axios.get(`http://localhost:8080/bill/${appointment.billID}`); // Assuming billID is part of the appointment
                        return {
                            ...appointment,
                            cost: billResponse.data.totalCost, // Add cost from the bill
                        };
                    }));
                    setUpcomingAppointments(updatedAppointments);
                } else {
                    console.error('Unexpected response format for upcoming appointments:', upcomingResponse.data);
                    setError('Unexpected response format for upcoming appointments');
                }

                // Fetch requested appointments
                const requestedResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/requested`);
                if (Array.isArray(requestedResponse.data)) {
                    setRequestedAppointments(requestedResponse.data);
                } else {
                    console.error('Unexpected response format for requested appointments:', requestedResponse.data);
                    setError('Unexpected response format for requested appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Error fetching appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [doctorID]);

    const handleScheduleClick = (appointmentID, patientID) => {
        // Set the appointment ID and patient ID for the one being scheduled
        setSchedulingData({ ...schedulingData, appointmentID, patientID });
    };

    const handleScheduleSubmit = async (event) => {
        event.preventDefault();

        const { appointmentID, time, cost, patientID } = schedulingData;

        // Format the time to ISO string if not already formatted
        const formattedTime = new Date(time).toISOString();
        const costNumber = parseInt(cost, 10);

        try {
            const response = await axios.put(
                `http://localhost:8080/appointments/doctor/${doctorID}/grant`,
                {
                    appointmentID,
                    appointmentTime: formattedTime,
                    patientID,
                    totalCost: costNumber,
                    type: 'Appointment', // You can modify this type as necessary
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert(response.data); // Show success or failure message
            // Refresh the appointments after scheduling
            window.location.reload();
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            alert('Error scheduling appointment');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSchedulingData({ ...schedulingData, [name]: value });
    };

    if (loading) return <div>Loading appointments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Appointments for Doctor ID: {doctorID}</h2>

            {upcomingAppointments.length > 0 ? (
                <div>
                    <h3>Upcoming Appointments</h3>
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
                            {upcomingAppointments.map(appointment => (
                                <tr key={appointment.appointmentID}>
                                    <td>{appointment.appointmentID}</td>
                                    <td>{appointment.patientID}</td>
                                    <td>{appointment.cost}</td>
                                    <td>Upcoming</td>
                                    <td>{appointment.time ? appointment.time : "N/A"}</td>
                                    <td>
                                        <button onClick={() => handleScheduleClick(appointment.appointmentID, appointment.patientID)}>
                                            Reschedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>No upcoming appointments found.</div>
            )}

            {requestedAppointments.length > 0 ? (
                <div>
                    <h3>Requested Appointments</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient ID</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedAppointments.map(appointment => (
                                <tr key={appointment.appointmentID}>
                                    <td>{appointment.appointmentID}</td>
                                    <td>{appointment.patientID}</td>
                                    <td>Requested</td>
                                    <td>
                                        <button onClick={() => handleScheduleClick(appointment.appointmentID, appointment.patientID)}>
                                            Schedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>No requested appointments found.</div>
            )}

            {schedulingData.appointmentID && (
                <div>
                    <h3>Schedule Appointment</h3>
                    <form onSubmit={handleScheduleSubmit}>
                        <div>
                            <label>
                                Time:
                                <input
                                    type="datetime-local"
                                    name="time"
                                    value={schedulingData.time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Cost:
                                <input
                                    type="number"
                                    name="cost"
                                    value={schedulingData.cost}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>
                        <button type="submit">Confirm Schedule</button>
                        <button type="button" onClick={() => setSchedulingData({ appointmentID: null, time: '', cost: '', patientID: null })}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
