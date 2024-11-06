import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './doctorAppointments.css';
import AuthContext from '../../AuthContext';

const DoctorAppointments = ({ doctorID }) => {
    const {getMinDateTime} = useContext(AuthContext);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [schedulingData, setSchedulingData] = useState({
        appointmentID: null,
        time: '',
        cost: '',
        patientID: null,
        mode: null // 'schedule' or 'reschedule'
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const upcomingResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/upcoming`);
                if (Array.isArray(upcomingResponse.data)) {
                    const updatedAppointments = await Promise.all(upcomingResponse.data.map(async (appointment) => {
                        const billResponse = await axios.get(`http://localhost:8080/bill/${appointment.billID}`);
                        return {
                            ...appointment,
                            cost: billResponse.data.totalCost,
                        };
                    }));
                    setUpcomingAppointments(updatedAppointments);
                } else {
                    setError('Unexpected response format for upcoming appointments');
                }

                const requestedResponse = await axios.get(`http://localhost:8080/appointments/doctor/${doctorID}/requested`);
                if (Array.isArray(requestedResponse.data)) {
                    setRequestedAppointments(requestedResponse.data);
                } else {
                    setError('Unexpected response format for requested appointments');
                }
            } catch (error) {
                setError('Error fetching appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [doctorID]);

    const handleScheduleClick = (appointmentID, patientID, mode) => {
        setSchedulingData({ ...schedulingData, appointmentID, patientID, mode });
    };

    const handleScheduleSubmit = async (event) => {
        event.preventDefault();
        const { appointmentID, time, cost, patientID, mode } = schedulingData;

        try {
            if (mode === 'schedule') {
                const formattedTime = new Date(time).toISOString();
                const costNumber = parseInt(cost, 10);

                const response = await axios.put(
                    `http://localhost:8080/appointments/doctor/${doctorID}/grant`,
                    { appointmentID, appointmentTime: formattedTime, patientID, totalCost: costNumber, type: 'Appointment' },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                alert(response.data);
            } else if (mode === 'reschedule') {
                const formattedTime = new Date(time).toISOString();
                const response = await axios.put(
                    `http://localhost:8080/appointments/${appointmentID}/update-time`,
                    null,
                    { params: { newTime: formattedTime } }
                );
                alert(response.data);
            }
            window.location.reload();
        } catch (error) {
            alert('Error submitting form');
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
            <center><h1>Appointments for Doctor ID: {doctorID}</h1></center>

            {upcomingAppointments.length > 0 ? (
                <div>
                    <center><h2>Upcoming Appointments</h2></center>
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
                                        <button className='app_cards_details_button' onClick={() => handleScheduleClick(appointment.appointmentID, appointment.patientID, 'reschedule')}>
                                            Reschedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <center><div>No upcoming appointments found.</div></center>
            )}

            {requestedAppointments.length > 0 ? (
                <div>
                    <center><h2>Requested Appointments</h2></center>
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
                                        <button className='app_cards_details_button' onClick={() => handleScheduleClick(appointment.appointmentID, appointment.patientID, 'schedule')}>
                                            Schedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <center><div>No requested appointments found.</div></center>
            )}

            {schedulingData.appointmentID && (
                <div className='appointments'>
                    <div className="login_div">
                        <h2>{schedulingData.mode === 'schedule' ? 'Schedule Appointment' : 'Reschedule Appointment'}</h2>
                        <form className='login_form' onSubmit={handleScheduleSubmit}>
                            <div className='login_div'>
                                <label className='login_label'>Time:</label>
                                <input
                                    className='login_label'
                                    type="datetime-local"
                                    name="time"
                                    value={schedulingData.time}
                                    onChange={handleInputChange}
                                    min={getMinDateTime()}
                                    required
                                />
                            </div>
                            {schedulingData.mode === 'schedule' && (
                                <div className='login_div'>
                                    <label className='login_label'>Cost:</label>
                                    <input
                                        className='login_input'
                                        type="number"
                                        name="cost"
                                        value={schedulingData.cost}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="login_div_horizontal">
                                <button className='login_button' type="submit">Confirm {schedulingData.mode === 'schedule' ? 'Schedule' : 'Reschedule'}</button>
                                <button className='login_button button_red' type="button" onClick={() => setSchedulingData({ appointmentID: null, time: '', cost: '', patientID: null, mode: null })}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
