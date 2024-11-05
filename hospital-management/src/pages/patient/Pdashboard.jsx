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
  const { pdashboardState, backend_url } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorID, setSelectedDoctorID] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoomID, setSelectedRoomID] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState([]);

  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);

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
        console.error('Failed to fetch patient data');
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
  const should_fetch = useRef(true);
  useEffect(() => {
    if(should_fetch.current === true) {
      fetchRoomsByPatientId();
      fetchRooms();
      should_fetch.current = false;
    }
  }, [])

  useEffect(() => {
    if (!token || userType !== 'PATIENT') {
      navigate('/login');
    } else {
      fetchPatientData();
      fetchDoctors();
      fetchAppointments();
      if (pdashboardState === 3) fetchUnpaidBills(); // Fetch unpaid bills when pdashboardState is 3
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

  const calculateNumDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
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
            <center><h1 className="dashboard-header">Profile</h1></center>
            {patientData ? (
              <div className="patient-profile">
                <p><strong>Patient ID:</strong> {patientData.patientID}</p>
                <p><strong>First Name:</strong> {patientData.firstName}</p>
                <p><strong>Last Name:</strong> {patientData.lastName}</p>
                <p><strong>Address:</strong> {patientData.address}</p>
                <p><strong>Email:</strong> {patientData.email}</p>
                <p><strong>Gender:</strong> {patientData.gender}</p>
                <p><strong>History:</strong> {patientData.history}</p>
                <p><strong>Date of Birth:</strong> {patientData.dob}</p>
              </div>
            ) : (
              <p>Loading patient data...</p>
            )}
          </>}
          {pdashboardState === 1 && (
            <div>
              <center><h1 className="dashboard-header">Upcoming Appointments</h1></center>
              <div className="appointments">
                {upcomingAppointments.length > 0 ? (
                  <div className="appointment_cards">
                    {upcomingAppointments.map((appointment) => (
                      <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                    ))}
                  </div>
                ) : (
                  <p>No upcoming appointments.</p>
                )}
              </div>
              <center><h1 className="dashboard-header">Previous Appointments</h1></center>
              <div className="appointments">
                {previousAppointments.length > 0 ? (
                  <div className="appointment_cards">
                  {previousAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))}
                  </div>
                ) : (
                  <p>No previous appointments.</p>
                )}
              </div>
              <center><h1 className="dashboard-header">Requested Appointments</h1></center>
              <div className="appointments">
                {requestedAppointments.length > 0 ? (
                  <div className="appointment_cards">
                  {requestedAppointments.map((appointment) => (
                    <App_cards key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))}
                  </div>
                ) : (
                  <p>No Requested appointments.</p>
                )}
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
              <h1>Pending Bills</h1>
                {unpaidBills.length > 0 ? (
                  <div className="appointment_cards">
                    {unpaidBills.map((bill) => (
                      <div key={bill.billID} className="bill-item">
                        <p><strong>Bill ID:</strong> {bill.billID}</p>
                        <p><strong>Amount:</strong> {bill.totalCost}</p>
                        <p><strong>Type:</strong> {bill.type}</p>
                        <button onClick={() => handlePayBill(bill.billID)} className="pay-button">Pay</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No pending bills.</p>
                )}
            </div>
          )}
          {pdashboardState === 4 && (
            <div>
              <center><h1 className="dashboard-header">Previous Appointments</h1></center>
              <div className="appointments">
                {previousAppointments.length > 0 ? (
                  previousAppointments.map((appointment) => (
                    <App_cards_2 key={appointment.appointmentID} param={appointment} flag={false} onDelete={handleDeleteAppointment} />
                  ))
                ) : (
                  <p>No previous appointments.</p>
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
                    required
                  />
                  </div>
                <button type="submit" className="login_button">Book Room</button>
              </form>
            </div>
            <div className="appointments">
              <h2>Your Booked Rooms :</h2>
              <div className="appointment_cards">
                {roomBookings.length > 0 ? (
                  roomBookings.map(room => (
                    <div key={room.roomBookingID} className="room-card">
                      <p><strong>Room ID :</strong> {room.roomID}</p>
                      <p><strong>Room Type :</strong> {getRoomType(room.roomID)}</p>
                      <p><strong>Booked From :</strong> {room.bookFrom}</p>
                      <p><strong>Booked Till :</strong> {room.bookTill}</p>
                    </div>
                  ))
                ) : (
                  <p>No rooms booked.</p>
                )}
                </div>
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




