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
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const upcomingResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming`);
                console.log('Fetched upcoming appointments:', upcomingResponse.data);
                if (Array.isArray(upcomingResponse.data)) {
                    setUpcomingAppointments(upcomingResponse.data);
                } else {
                    console.error('Unexpected response format for upcoming appointments:', upcomingResponse.data);
                    setError('Unexpected response format for upcoming appointments');
                }

                const requestedResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/requested`);
                console.log('Fetched requested appointments:', requestedResponse.data);
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

    const handleScheduleClick = (appointmentID) => {
        // Set the appointment ID for the one being scheduled
        setSchedulingData({ ...schedulingData, appointmentID });
    };

    const handleScheduleSubmit = async (event) => {
        event.preventDefault();
    
        const { appointmentID, time, cost } = schedulingData;
    
        // Format the time to ISO string if not already formatted
        const formattedTime = new Date(time).toISOString();
    
        // Convert cost to a number
        const costNumber = parseInt(cost, 10);
    
        console.log('Scheduling Data:', { appointmentID, formattedTime, costNumber }); // Check the formatted data
    
        try {
            const response = await axios.put(
                `http://localhost:8080/appointments/doctor/${doctorID}/grant`,
                {
                    appointmentID,
                    appointmentTime: formattedTime,
                    cost: costNumber,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            alert(response.data); // Show success or failure message
            setRequestedAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                    appointment.appointmentID === appointmentID
                        ? { ...appointment, status: 1, time: formattedTime, cost: costNumber }
                        : appointment
                )
            );
            setSchedulingData({ appointmentID: null, time: '', cost: '' }); // Reset scheduling data
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
                                <th>Cost</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedAppointments.map(appointment => (
                                <tr key={appointment.appointmentID}>
                                    <td>{appointment.appointmentID}</td>
                                    <td>{appointment.patientID}</td>
                                    <td>{appointment.cost}</td>
                                    <td>Requested</td>
                                    <td>{appointment.time ? appointment.time : "N/A"}</td>
                                    <td>
                                        <button onClick={() => handleScheduleClick(appointment.appointmentID)}>
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
                        <button type="button" onClick={() => setSchedulingData({ appointmentID: null, time: '', cost: '' })}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
