import React, { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import './pdashboard.css';
import AuthContext from '../../AuthContext.jsx';
import App_cards from '../../components/app_cards/App_cards.jsx';
import App_cards_2 from '../../components/app_cards_2/App_cards2.jsx';
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import UserInfo from './profile.jsx';
import PatientBills from '../../components/bills/patientbills.jsx';
import AddPharmacyRequestForm from '../../components/pharmacy/pharmacyRequestform.jsx';
import PendingRequests from '../../components/pharmacy/pendingRequests.jsx';


const pdashboard = () => {
  const { pdashboardState, backend_url, logout, formattedDate, setPdashboardState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorID, setSelectedDoctorID] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoomID, setSelectedRoomID] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [rescheduleStartDate, setRescheduleStartDate] = useState('');
  const [rescheduleEndDate, setRescheduleEndDate] = useState('');
  const [roomBookingToReschedule, setRoomBookingToReschedule] = useState(null); // Track the booking being rescheduled

  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);
  const should_fetch = useRef(true);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`${backend_url}/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPatientData(data);
      } else {
        alert('Failed to fetch patient data');
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

      const fetchRooms = async () => {
        try {
          const response = await fetch(`${backend_url}/rooms`);
          if (response.ok) {
            const data = await response.json();
            setRooms(data);
          } else {
            console.error('Failed to fetch rooms');
          }
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${backend_url}/doctor`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };
  const login_fetch = useRef(true);

  useEffect(() => {
    if(login_fetch.current === true) {
      fetchPatientData();
      login_fetch.current = false;
    }
  }, [])

  useEffect(() => {
    if(should_fetch.current === true) {
      fetchRoomsByPatientId();
      fetchRooms();
      should_fetch.current = false;
    }
  }, [])

  const fetchSurgeriesForPatient = async (patientID) => {
    try {
      const response = await fetch(`http://localhost:8080/surgeries/patient/${patientID}`);
      const data = await response.json();
      setSurgeries(data);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
    }
  };

  useEffect(() => {
    if (pdashboardState === 3) {
      fetchSurgeriesForPatient(id); // Replace with actual patient ID
    }
  }, [pdashboardState, id]);

  useEffect(() => {
    if (!token || userType !== 'PATIENT') {
      navigate('/login');
    } else {
      fetchDoctors();
      fetchAppointments();
      if (pdashboardState === 4) fetchUnpaidBills(); // Fetch unpaid bills when pdashboardState is 4
    }
  }, [navigate, token, userType, id, pdashboardState]);
  const fetchAppointments = async () => {
    try {
      const requestedResponse = await fetch(`${backend_url}/appointments/patient/${id}/requested`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (requestedResponse.ok) {
        const requestedData = await requestedResponse.json();
        setRequestedAppointments(requestedData);
      } else {
        console.error('Failed to fetch requested appointments');
      }

      const upcomingResponse = await fetch(`${backend_url}/appointments/patient/${id}/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        setUpcomingAppointments(upcomingData);
      } else {
        console.error('Failed to fetch upcoming appointments');
      }

      const previousResponse = await fetch(`${backend_url}/appointments/patient/${id}/previous`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (previousResponse.ok) {
        const previousData = await previousResponse.json();
        setPreviousAppointments(previousData);
      } else {
        console.error('Failed to fetch previous appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  const fetchRoomsByPatientId = async () => {
    const response = await fetch(`${backend_url}/api/roomBookings/patient/${id}`);
    const data = await response.json();
    setRoomBookings(data);
  }
  const handleRoomBooking = async (e) => {
    e.preventDefault();
    if (selectedRoomID && bookingStartDate && bookingEndDate) {
      try {
        const response = await fetch(`${backend_url}/api/roomBookings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientID: id,
            roomID: selectedRoomID,
            bookFrom: bookingStartDate,
            bookTill: bookingEndDate,
            numDays: calculateNumDays(bookingStartDate, bookingEndDate)
          }),
        });
        if (response.ok) {
          alert('Room booking created successfully.');
          setSelectedRoomID('');
          setBookingStartDate('');
          setBookingEndDate('');
          fetchRoomsByPatientId(); // Update room list after booking
        } else {
          alert('Failed to create room booking.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please fill in all booking details.');
    }
  };
  const calculateCost = async (roomID, numDays) => {
    
    try {
      const response = await fetch(`${backend_url}/rooms/${roomID}`);
      
      if (response.ok) {
        const room = await response.json();
        const dailyRate = room.cost; // assuming the cost is in the 'cost' field
        
        const totalCost = dailyRate * numDays;
        return totalCost;
      } else {
        console.error('Failed to fetch room details');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      return 0;
    }
  };
  


  const handleReschedule = async (roomBookingID) => {
    if (rescheduleStartDate && rescheduleEndDate) {
      
      try {
        const response = await fetch(`${backend_url}/api/roomBookings/${roomBookingID}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify({
            roomID: roomBookingToReschedule.roomID,
            patientID: roomBookingToReschedule.patientID,
            bookFrom: new Date(rescheduleStartDate).toISOString(),  // Convert to ISO string
            bookTill: new Date(rescheduleEndDate).toISOString(),  // Convert to ISO string
            numDays: calculateNumDays(rescheduleStartDate, rescheduleEndDate),
            totalCost: await calculateCost(roomBookingToReschedule.roomID, calculateNumDays(rescheduleStartDate, rescheduleEndDate)), // Ensure it's an async call
          }),
        });

        if (response.ok) {
          alert('Room booking rescheduled successfully.');
          fetchRoomsByPatientId(); // Update room list after rescheduling
          setRoomBookingToReschedule(null); // Reset selected booking
        } else {
          alert('Failed to reschedule room booking.');
        }
      } catch (error) {
        console.error('Error rescheduling booking:', error);
      }
    } else {
      alert('Please fill in the new booking dates.');
    }
};


  const calculateNumDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const openRescheduleModal = (room) => {
    setRoomBookingToReschedule(room);
    // setRescheduleStartDate(room.bookFrom);
    // setRescheduleEndDate(room.bookTill);
  };

  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    if (selectedDoctorID) {
      try {
        const response = await fetch(`${backend_url}/appointments/patient/${id}/request?doctorID=${selectedDoctorID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Appointment request successfully created.');
          fetchAppointments();
          setSelectedDoctorID('')
          setPdashboardState(1);
        } else {
          alert('Failed to create appointment request.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please select a doctor.');
    }
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctorID(event.target.value);
  };
  const getRoomType = (roomID) => {
    const room = rooms.find(room => room.roomID === roomID);
    return room ? room.roomType : 'Unknown';
  }

  const handleDeleteAppointment = async (appointmentID) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        console.log(appointmentID);

        const response = await fetch(`${backend_url}/appointments/${appointmentID}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Appointment successfully deleted.');
          fetchAppointments(); // Refresh the appointments after deletion
        } else {
          console.log(response);
          const message = await response.text();
          alert(message || 'Failed to delete appointment.');
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };


  const fetchUnpaidBills = async () => {
    try {
      const response = await fetch(`${backend_url}/bill/patient/${id}/unpaid`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const bills = await response.json();
        setUnpaidBills(bills);
      } else {
        console.error('Failed to fetch unpaid bills');
      }
    } catch (error) {
      console.error('Error fetching unpaid bills:', error);
    }
  };


  const handlePayBill = async (billID) => {
    try {
      const response = await fetch(`${backend_url}/bill/${billID}/status?status=1`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Bill successfully paid.');
        fetchUnpaidBills(); // Refresh unpaid bills list after payment
      } else {
        alert('Failed to update bill status.');
      }
    } catch (error) {
      console.error('Error updating bill status:', error);
    }
  };

  

  return (
    <div>
      <Navbar />
      <Fake />
      <div className='pdashboard'>
        <Sidebar />
        <div className="main-content">
          {pdashboardState === 0 && <>
            <div className="appointments">
              <div className="doctor-profile">
            <center><h1 className="dashboard-header">Profile</h1></center>
            {patientData ? (
              <>
                <div className="profile-detail">
                  <span className="profil-icon">🪪</span>
                  <p className="profile-text"><span className="profile-label">Patient ID:</span> <span className="profile-value">{patientData.patientID}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">👤</span>
                  <p className="profile-text"><span className="profile-label">First Name:</span> <span className="profile-value">{patientData.firstName}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">👤</span>
                  <p className="profile-text"><span className="profile-label">Last Name:</span> <span className="profile-value">{patientData.lastName}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🎂</span>
                  <p className="profile-text"><span className="profile-label">Date of Birth:</span> <span className="profile-value">{new Date(patientData.dob).toLocaleDateString()}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">⚧️</span>
                  <p className="profile-text"><span className="profile-label">Gender:</span> <span className="profile-value">{patientData.gender}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">📧</span>
                  <p className="profile-text"><span className="profile-label">Email:</span> <span className="profile-value">{patientData.email}</span></p>
                </div>
                <div className="profile-detail">
                  <span className="profile-icon">🏡</span>
                  <p className="profile-text"><span className="profile-label">Address:</span> <span className="profile-value">{patientData.address}</span></p>
                </div>
              </>
            ) : (
              <p>Loading patient data...</p>
            )}
              </div>
            </div>
          </>}
          {pdashboardState === 1 && (
            <div>
              <center><h1 className="dashboard-header">Upcoming Appointments</h1></center>
              <div className="appointments">
                <div className="appointment_cards">
                {upcomingAppointments.length > 0 ? (
                    <>{upcomingAppointments.map((appointment) => (
                      <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                    ))}</>
                  ) : (
                    <p>No upcoming appointments.</p>
                  )}
                </div>
              </div>
              <center><h1 className="dashboard-header">Previous Appointments</h1></center>
              <div className="appointments">
                <div className="appointment_cards">
                {previousAppointments.length > 0 ? (
                  <>{previousAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))}</>
                ) : (
                  <p>No previous appointments.</p>
                )}
                </div>
              </div>
              <center><h1 className="dashboard-header">Requested Appointments</h1></center>
              <div className="appointments">
                <div className="appointment_cards">
                {requestedAppointments.length > 0 ? (
                  <>{requestedAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))}</>
                ) : (
                  <p>No Requested appointments.</p>
                )}
                </div>
              </div>
            </div>
          )}
          {pdashboardState === 2 && (
            <div>
              <center><h1 className="dashboard-header">New Appointment</h1></center>
                <div className='appointments'>
                  <center><h2>Available Doctors:</h2></center>
                  <div className="appointment_cards">
                  {doctors.map(doctor => (
                    <App_cards key = {doctor.doctorID} param = {doctor} flag = {false} />
                  ))}
                  </div>
                </div>
                <div className="login_div">
                <h2>Request an Appointment:</h2>
                <form onSubmit={handleRequestAppointment} className="login_form">
                  <div className="login_div">
                <label className='login_label' htmlFor="doctorSelect">Select a Doctor : </label>
                <select className='login_select' id="doctorSelect" value={selectedDoctorID} onChange={handleDoctorChange}>
                  <option value="">--Select Doctor--</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctorID} value={doctor.doctorID}>
                      {doctor.doctorID} - {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
                  </div>
                <button type='submit' className='login_button'>Request Appointment</button>
                  </form>
                  </div>
            </div>
          )}
          {pdashboardState === 3 && (
            <div className='appointments'>
              <center><h1>Surgeries</h1></center>
              <div className="appointment_cards">
              {surgeries.length > 0 ? (
                  <>{surgeries.map((surgery) => (
                    <div key={surgery.surgeryID} className="surgery-item">
                      <p><strong>Surgery ID:</strong> {surgery.surgeryID}</p>
                      <p><strong>Doctor ID:</strong> {surgery.doctorID}</p>                    
                      <p><strong>Date and Time:</strong> {new Date(surgery.time).toLocaleString()}</p>                      
                    </div>
                  ))}</>
                ) : (
                  <center><p>No surgeries found.</p></center>
                )}
              </div>
            </div>
          )}



          {pdashboardState === 4 && (
            <div className='appointments'>
              <h1>Pending Bills</h1>
              <div className="appointment_cards">
                {unpaidBills.length > 0 ? (
                    <>{unpaidBills.map((bill) => (
                      <div key={bill.billID} className="app_cards">
                        <div className="app_cards_date">
                          <p><strong>Bill ID:</strong> {bill.billID}</p>
                        </div>
                        <div className="app_cards_details">
                          <p><strong>Amount:</strong> {bill.totalCost}</p>
                          <p><strong>Type:</strong> {bill.type}</p>
                          <button onClick={() => handlePayBill(bill.billID)} className="login_button">Pay</button>
                        </div>
                      </div>
                    ))}</>
                ) : (
                  <p>No pending bills.</p>
                )}
                  </div>
            </div>
          )}
      
          {pdashboardState === 5 && <>
            <center><h1 className="dashboard-header">Book Room</h1></center>
            <div className="appointments">
              <h2>Available Rooms:</h2>
                <div className="appointment_cards">
                {rooms.length > 0 ? (
                  rooms.map(room => (
                    <div key={room.roomID} className="room-card">
                      <p><strong>Room Type :</strong> {room.roomType}</p>
                      <p><strong>Cost (1 Day) :</strong> ₹{room.cost}</p>
                    </div>
                  ))
                ) : (
                  <p>No rooms available.</p>
                )}
              </div>
            </div>
            <div className="login_div">
                <h2>Book a Room:</h2>
              <form onSubmit={handleRoomBooking} className="login_form">
                <div className="login_div">
                <label className='login_label'>
                  Select Room ID:
                  </label>
                  <select className='login_select'
                    value={selectedRoomID}
                    onChange={(e) => setSelectedRoomID(e.target.value)}
                    required
                  >
                    <option value="">--Select Room--</option>
                    {rooms.map(room => (
                      <option key={room.roomID} value={room.roomID}>
                        {room.roomID} - {room.roomType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="login_div">
                <label className='login_label'>
                  Booking Start Date:
                  </label>
                  <input className='login_input'
                    type="date"
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    min={formattedDate(new Date())}
                    required
                  />
                </div>
                <div className="login_div">
                <label className='login_label'>
                  Booking End Date:
                  </label>
                  <input className='login_input'
                    type="date"
                    value={bookingEndDate}
                    onChange={(e) => setBookingEndDate(e.target.value)}
                    min = {bookingStartDate}
                    required
                    disabled={!bookingStartDate}
                  />
                  </div>
                <button type="submit" className="login_button">Book Room</button>
              </form>
            </div>
            <div className="appointments">
      <h2>Your Booked Rooms:</h2>
      <div className="appointment_cards">
        {roomBookings.length > 0 ? (
          roomBookings.map(room => (
            <div key={room.roomBookingID} className="app_cards">
              <div className="app_cards_date">
                <p><strong>Booking ID:</strong> {room.roomBookingID}</p>
              </div>
              <div className="app_cards_details">
                <p><strong>Room Type:</strong> {getRoomType(room.roomID)}</p>
                <p><strong>Booked From:</strong> {room.bookFrom}</p>
                <p><strong>Booked Till:</strong> {room.bookTill}</p>
                <button className='login_button' onClick={() => openRescheduleModal(room)}>Reschedule</button>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms booked.</p>
        )}
      </div>

      {/* Reschedule Modal */}
      {roomBookingToReschedule && (
        <div className="login_div">
          <h3>Reschedule Booking for Room ID: {roomBookingToReschedule.roomID}</h3>
          <form onSubmit={(e) => {e.preventDefault(); handleReschedule(roomBookingToReschedule.roomBookingID)}} className="login_form">
          <div className="login_div">
            <label className='login_label'>
              New Start Date:
            </label>
              <input className='login_input'
                type="date"
                onChange={(e) => setRescheduleStartDate(e.target.value)}
                min={formattedDate(new Date())}
              />
          </div>
          <div className="login_div">
            <label className='login_label'>
              New End Date:
            </label>
              <input className='login_input'
                type="date"
                onChange={(e) => setRescheduleEndDate(e.target.value)}
                min={rescheduleStartDate}
                disabled={!rescheduleStartDate}
              />
          </div>
          <div className="login_div_horizontal">
            <button type='submit' className='login_button'>Confirm Reschedule</button>
            <button className='login_button button_red' onClick={() => setRoomBookingToReschedule(null)}>Cancel</button>
          </div>
          </form>
        </div>
              )}
    </div>
          </>}
          {pdashboardState === 6 && <>
            <center><h1 className="dashboard-header">Pharmacy</h1></center>
            <AddPharmacyRequestForm patientID={id} />
            <PendingRequests patientID={id} />


          </>}
        </div>
      </div>
    </div>
  );
};

export default pdashboard;




