import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './doctorAppointments.css';
import AuthContext from '../../AuthContext';

const DoctorAppointments = ({ doctorID }) => {
    const {getMinDateTime, backend_url} = useContext(AuthContext);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);
    const [patientNames, setPatientNames] = useState({});
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
                const upcomingResponse = await axios.get(`${backend_url}/appointments/doctor/${doctorID}/upcoming`);
                const requestedResponse = await axios.get(`${backend_url}/appointments/doctor/${doctorID}/requested`);

                const allAppointments = [...upcomingResponse.data, ...requestedResponse.data];
                const patientIDs = [...new Set(allAppointments.map(app => app.patientID))];

                // Fetch all unique patient names
                const patientDataPromises = patientIDs.map(id =>
                    axios.get(`${backend_url}/patients/${id}`).then(response => ({
                        id,
                        name: `${response.data.firstName} ${response.data.lastName}`
                    }))
                );

                const patientData = await Promise.all(patientDataPromises);
                const patientNameMap = Object.fromEntries(patientData.map(p => [p.id, p.name]));

                setPatientNames(patientNameMap);

                if (Array.isArray(upcomingResponse.data)) {
                    const updatedAppointments = await Promise.all(upcomingResponse.data.map(async (appointment) => {
                        const billResponse = await axios.get(`${backend_url}/bill/${appointment.billID}`);
                        return {
                            ...appointment,
                            cost: billResponse.data.totalCost,
                        };
                    }));
                    setUpcomingAppointments(updatedAppointments);
                } else {
                    setError('Unexpected response format for upcoming appointments');
                }

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
                    `${backend_url}/appointments/doctor/${doctorID}/grant`,
                    { appointmentID, appointmentTime: formattedTime, patientID, totalCost: costNumber, type: 'Appointment' },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                alert(response.data);
            } else if (mode === 'reschedule') {
                const formattedTime = new Date(time).toISOString();
                const response = await axios.put(
                    `${backend_url}/appointments/${appointmentID}/update-time`,
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
        <div className='appointments'>
            <center><h1>Appointments for Doctor ID: {doctorID}</h1></center>

            <center><h2>Upcoming Appointments</h2></center>
            {upcomingAppointments.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient Name</th>
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
                                    <td>{patientNames[appointment.patientID] || "Loading..."}</td>
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
                <div className="appointment_cards">
                    <center><div>No upcoming appointments found.</div></center>
                </div>
            )}

            <center><h2>Requested Appointments</h2></center>
            {requestedAppointments.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedAppointments.map(appointment => (
                                <tr key={appointment.appointmentID}>
                                    <td>{appointment.appointmentID}</td>
                                    <td>{patientNames[appointment.patientID] || "Loading..."}</td>
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
                <div className="appointment_cards">
                    <center><div>No requested appointments found.</div></center>
                </div>
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
