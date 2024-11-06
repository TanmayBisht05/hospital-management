import React, { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import './admin.css'
import AuthContext from '../../AuthContext.jsx'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import Sidebar_admin from '../../components/sidebar_admin/Sidebar_admin';

const Admin = () => {
  const { adashboardState, signup, backend_url, logout, formattedDate } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);

  const [requests, setRequests] = useState([]);
  const should_fetch = useRef(true);

  const [chemists, setChemists] = useState([]); // New state for chemists list
  const [selectedChemist, setSelectedChemist] = useState(''); 
  const [salary, setSalary] = useState(''); 
  const [issueDate, setIssueDate] = useState(''); 

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorSalary, setDoctorSalary] = useState('');
  const [doctorIssueDate, setDoctorIssueDate] = useState('');

  const [roomType, setRoomType] = useState('');
  const [roomCost, setRoomCost] = useState('');

  const [rooms, setRooms] = useState([]);


    useEffect(() => {
        if(should_fetch.current) {
            fetchAdminData();
            fetchRequests();
            fetchChemists();
            fetchDoctors();
            fetchRooms();
            should_fetch.current = false;
        }
    }, []);

    const fetchRequests = async () => {
        const response = await fetch(`${backend_url}/medicine-requests`);
        const data = await response.json();
        setRequests(data);
    };

    const fetchAdminData = async () => {
        try {
          const response = await fetch(`${backend_url}/api/admins/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            alert('Failed to fetch admin data');
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
        const response = await fetch(`${backend_url}/doctor`);
        const data = await response.json();
        setDoctors(data);
      };

    const fetchChemists = async () => {
        const response = await fetch(`${backend_url}/chemist`);
        const data = await response.json();
        setChemists(data);
      };

    const handleSalarySubmit = async (e) => {
        e.preventDefault();
        const data = {
            chemistID: parseInt(selectedChemist),
            salary: parseFloat(salary),
            issueDate,
        };

        const response = await fetch(`${backend_url}/chemist-salaries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Salary record created successfully!');
            setSelectedChemist('');
            setSalary('');
            setIssueDate('');
        } else {
            alert('Failed to create salary record.');
        }
    };


    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        const data = {
          roomType : roomType,
          cost : parseInt(roomCost)
        };
    
        const response = await fetch(`${backend_url}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          alert('Room created successfully!');
          setRoomType('');
          setRoomCost('')
          fetchRooms();
        } else {
          alert('Failed to create room.');
        }
      };

  const handleDoctorSalarySubmit = async (e) => {
    e.preventDefault();
    const data = {
      doctorID: parseInt(selectedDoctor),
      salary: parseFloat(doctorSalary),
      issueDate: doctorIssueDate,
    };

    const response = await fetch(`${backend_url}/doctor-salaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Doctor salary record created successfully!');
      setSelectedDoctor('');
      setDoctorSalary('');
      setDoctorIssueDate('');
    } else {
      alert('Failed to create doctor salary record.');
    }
  };
    

    const handleAcceptRequest = async (requestID) => {
        const response = await fetch(`${backend_url}/medicine-requests/${requestID}/accept`, { method: 'POST' });
        if (response.ok) {
            alert("Request accepted and processed!");
            fetchRequests();
        } else {
            alert("Failed to accept request.");
        }
    };

    const handleDenyRequest = async (requestID) => {
        const response = await fetch(`${backend_url}/medicine-requests/${requestID}/deny`, { method: 'DELETE' });
        if (response.ok) {
            alert("Request denied.");
            fetchRequests();
        } else {
            alert("Failed to deny request.");
        }
    };
  if (isNaN(id)) {
    console.error('Invalid admin ID');
  }
  useEffect(() => {
    if (!token || userType !== 'ADMIN') {
      navigate('/');
    }
  }, [token])
  const handleRegDoc = async (e) => {
        e.preventDefault();
        const data = {
            firstName: document.getElementById('dfirstName').value,
            lastName: document.getElementById('dlastName').value,
            dob: document.getElementById('ddob').value,
            education: document.getElementById('deducation').value,
            gender: document.getElementById('dgender').value,
            phone: document.getElementById('dphone').value,
            email: document.getElementById('demail').value,
            post: document.getElementById('dpost').value,
            department: document.getElementById('ddepartment').value,
            specialization: document.getElementById('dspecialization').value,
            password: document.getElementById('dpassword').value
        }
        if(await signup(data, "doctor")) {
            alert('Doctor registered successfully');
            document.getElementById('dfirstName').value = '';
            document.getElementById('dlastName').value = '';
            document.getElementById('ddob').value = '';
            document.getElementById('deducation').value = '';
            document.getElementById('dgender').value = 'Male';
            document.getElementById('dphone').value = '';
            document.getElementById('demail').value = '';
            document.getElementById('dpost').value = '';
            document.getElementById('ddepartment').value = '';
            document.getElementById('dspecialization').value = '';
            document.getElementById('dpassword').value = '';
        } else {
            alert('Invalid credentials');
        }
    }
    const handleRegChem = async (e) => {
        e.preventDefault();
        const data = {
            firstName: document.getElementById('cfirstName').value,
            lastName: document.getElementById('clastName').value,
            dob: document.getElementById('cdob').value,
            gender: document.getElementById('cgender').value,
            phone: document.getElementById('cphone').value,
            email: document.getElementById('cemail').value,
            password: document.getElementById('cpassword').value
        }
        if(await signup(data, "chemist")) {
            alert('Chemist registered successfully');
            document.getElementById('cfirstName').value = '';
            document.getElementById('clastName').value = '';
            document.getElementById('cdob').value = '';
            document.getElementById('cgender').value = 'M';
            document.getElementById('cphone').value = '';
            document.getElementById('cemail').value = '';
            document.getElementById('cpassword').value = '';
        } else {
            alert('Invalid credentials');
        }
    }

    const [machineryID, setMachineryID] = useState(-1);
    const handleMachinerySubmit = async (e) => {
        e.preventDefault();
        const method = machineryID === -1 ? 'POST' : 'PUT';
        const endpoint = machineryID === -1 ? `${backend_url}/machinery` : `${backend_url}/machinery/${machineryID}`;
        const reqData = {
            name: document.getElementById('mname').value,
            cost: document.getElementById('mcost').value
        }
        const response = await fetch(endpoint, {
            method,
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData)
        })
        if(response.status === 201 || response.status === 200) {
            setMachineryID(-1);
            alert('Success');
            // window.location.reload();
            fetchMachinery();
            document.getElementById('mname').value = '';
            document.getElementById('mcost').value = '';
        } else {
            alert('Error');
        }
    }
    // fetch Machinery
    const should_fetch_machinery = useRef(true);
    const [machineryList, setMachineryList] = useState([]);
    useEffect(() => {
        if(should_fetch_machinery.current) {
            fetchMachinery();
            should_fetch_machinery.current = false;
        }
    }, [])
    const fetchMachinery = async () => {
        const response = await fetch(`${backend_url}/machinery`);
        const data = await response.json();
        setMachineryList(data); 
    }
    const handleEditMachinery = (machinery) => {
        setMachineryID(machinery.machineID);
        document.getElementById('mname').value = machinery.name;
        document.getElementById('mcost').value = machinery.cost;
    }
  return (
    <div>
            <Navbar />
            <Fake />
    <div className='pdashboard'>
        <Sidebar_admin />
      
      <div className="main-content">
        {adashboardState === 0 && <>
          <center><h1 className="dashboard-header">Register Doctor</h1></center>
          <div className="login_div">
            <h1>Details</h1>
            <form onSubmit={handleRegDoc} className="login_form_horizontal">
                <div className="login_form_left">
                    <div className="login_div">
                        <label htmlFor="dfirstName" className="login_label">First Name : </label>
                        <input className='login_input' id='dfirstName' type="text" placeholder="First Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dlastName" className="login_label">Last Name : </label>
                        <input className='login_input' id='dlastName' type="text" placeholder="Last Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="ddob" className="login_label">Date of Birth : </label>
                        <input className='login_input' id='ddob' type="date" placeholder="Date of Birth" min={formattedDate(new Date())} />
                    </div>
                    <div className="login_div">
                        <label htmlFor="deducation" className="login_label">Education : </label>
                        <input type="text" className="login_input" placeholder='Education' id='deducation' />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dgender" className="login_label">Gender : </label>
                        <select className='login_select' id = 'dgender'>
                            <option value = "Male">Male</option>
                            <option value = "Female">Female</option>
                        </select>
                    </div>
                    <div className="login_div">
                        <label htmlFor="dphone" className="login_label">Phone : </label>
                        <input type="text" className="login_input" placeholder='Phone' id='dphone' />
                    </div>
                </div>
                <div className="login_form_right">
                    <div className="login_div">
                        <label htmlFor="demail" className="login_label">Email : </label>
                        <input className='login_input' id='demail' type="text" placeholder="Email" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dpost" className="login_label">Post : </label>
                        <input className='login_input' id='dpost' type="text" placeholder="Post" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="ddepartment" className="login_label">Department : </label>
                        <input className='login_input' id='ddepartment' type="text" placeholder="Department" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dspecialization" className="login_label">Specialization : </label>
                        <input className='login_input' id='dspecialization' type="text" placeholder="Specialization" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dpassword" className="login_label">Password : </label>
                        <input className='login_input' id='dpassword' type="password" placeholder="Password" required />
                    </div>
                    <button className='login_button' type="submit">Register</button>
                </div>
            </form>
          </div>
        </>}
        {adashboardState === 1 && <>
            <center><h1 className="dashboard-header">Register Chemist</h1></center>
          <div className="login_div">
            <h1>Details</h1>
            <form onSubmit={handleRegChem} className="login_form_horizontal">
                <div className="login_form_left">
                    <div className="login_div">
                        <label htmlFor="cfirstName" className="login_label">First Name : </label>
                        <input className='login_input' id='cfirstName' type="text" placeholder="First Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="clastName" className="login_label">Last Name : </label>
                        <input className='login_input' id='clastName' type="text" placeholder="Last Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cdob" className="login_label">Date of Birth : </label>
                        <input className='login_input' id='cdob' type="date" placeholder="Date of Birth" min={formattedDate(new Date())} />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cgender" className="login_label">Gender : </label>
                        <select className='login_select' id = 'cgender'>
                            <option value = "M">Male</option>
                            <option value = "F">Female</option>
                        </select>
                    </div>
                </div>
                <div className="login_form_right">
                    <div className="login_div">
                        <label htmlFor="cphone" className="login_label">Phone : </label>
                        <input type="text" className="login_input" placeholder='Phone' id='cphone' />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cemail" className="login_label">Email : </label>
                        <input className='login_input' id='cemail' type="text" placeholder="Email" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cpassword" className="login_label">Password : </label>
                        <input className='login_input' id='cpassword' type="password" placeholder="Password" required />
                    </div>
                    <button className='login_button' type="submit">Register</button>
                </div>
            </form>
          </div>
        </>}
        {adashboardState === 2 && <>
            <center><h1 className="dashboard-header">Machinery</h1></center>
            <div className="appointments">
                <div className="login_div">
                    <h1>{machineryID === -1 ? 'Add' : 'Edit'}</h1>
                    <form onSubmit={handleMachinerySubmit} className="login_form">
                        <div className="login_div">
                            <label htmlFor="mname" className="login_label">Machine Name : </label>
                            <input className='login_input' id='mname' maxLength="50" required type="text" placeholder="Machine Name" />
                        </div>
                        <div className="login_div">
                            <label htmlFor="mcost" className="login_label">Cost : </label>
                            <input className='login_input' id='mcost' type="number" placeholder="Cost" required />
                        </div>
                        <div className="login_div_horizontal">
                        <button className="login_button" type='submit'>{machineryID === -1 ? 'Add' : 'Edit'}</button>
                        {machineryID !==  -1 && <button className="login_button button_red" onClick={() => {
                            setMachineryID(-1);
                            document.getElementById('mname').value = '';
                            document.getElementById('mcost').value = '';
                        }}>Cancel</button>}
                        </div>
                    </form>
                </div>
                <center><h1>Machinery List</h1></center>
                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Machine Name</th>
                            <th>Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machineryList.map((machinery) => (
                            <tr key={machinery.machineID}>
                                <td>{machinery.machineID}</td>
                                <td>{machinery.name}</td>
                                <td>{machinery.cost}</td>
                                <td>
                                    <button className='login_button' onClick={() => handleEditMachinery(machinery)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>}
        {adashboardState === 3 && <>
            <center><h1 className="dashboard-header">Requests</h1></center>
          <div className='appointments'>
            <h2>Medicine Requests</h2>
            <table>
                <thead>
                    <tr>
                        <th>Medicine Name</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.requestID}>
                            <td>{request.medicineName}</td>
                            <td>{request.amount}</td>
                            <td className='req_table_data'>
                                <button className='login_button button_green' onClick={(e) => {e.preventDefault(); handleAcceptRequest(request.requestID)}}>Accept</button>
                                <button className='login_button button_red' onClick={(e) => {e.preventDefault(); handleDenyRequest(request.requestID)}}>Deny</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>}
        {adashboardState === 4 && ( // Dashboard state 4 for Salary Management
            <>
              <center><h1 className="dashboard-header">Manage Chemist Salaries</h1></center>
              <div className="appointments">
                <h2>Add Salary for Chemist</h2>
                <form onSubmit={handleSalarySubmit} className="login_form">
                  <div className="login_div">
                    <label htmlFor="chemistSelect" className="login_label">Select Chemist: </label>
                    <select
                        id="chemistSelect"
                        value={selectedChemist}
                        onChange={(e) => setSelectedChemist(parseInt(e.target.value, 10))}
                        className="login_input"
                        required
                        >
                        <option value="" disabled>Select Chemist</option>
                        {chemists.map((chemist) => (
                            <option key={chemist.chemistID} value={chemist.chemistID}>
                            {chemist.firstName} {chemist.lastName}
                            </option>
                        ))}
                    </select>
                  </div>
                  <div className="login_div">
                    <label htmlFor="salary" className="login_label">Salary Amount: </label>
                    <input
                      type="number"
                      id="salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="login_input"
                      placeholder="Salary Amount"
                      required
                    />
                  </div>
                  <div className="login_div">
                    <label htmlFor="issueDate" className="login_label">Issue Date: </label>
                    <input
                      type="date"
                      id="issueDate"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="login_input"
                      required
                    />
                  </div>
                  <button type="submit" className="login_button">Submit Salary</button>
                </form>
                <center><h2>Manage Doctor Salaries</h2></center>
                <>
              <form onSubmit={handleDoctorSalarySubmit} className="login_form">
                <div className="login_div">
                <label className='login_label'>Select Doctor :</label>
                <select className='login_select'
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorID} value={doctor.doctorID}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
                </div>
                <div className="login_div">
                <label className='login_label'>Salary Amount :</label>
                <input className='login_input'
                  type="number"
                  placeholder="Salary Amount"
                  value={doctorSalary}
                  onChange={(e) => setDoctorSalary(e.target.value)}
                  required
                />
                </div>
                <div className="login_div">
                <label className='login_label'>Issue Date :</label>
                <input className='login_input'
                  type="date"
                  placeholder="Issue Date"
                  value={doctorIssueDate}
                  onChange={(e) => setDoctorIssueDate(e.target.value)}
                  required
                />
                </div>
                <button type="submit" className='login_button'>Submit Salary</button>
              </form>
              </>
              </div>
            </>
          )}{adashboardState === 5 && ( 
            <>
              <center><h1 className="dashboard-header">Manage Rooms</h1></center>
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
            <center><h2>Create New Room</h2></center>
                <div className="login_div">
              <form onSubmit={handleRoomSubmit} className="login_form">
                <div className="login_div">
                <label className='login_label'>Room Type :</label>
                <input className='login_input'
                  type="text"
                  placeholder="Room Type"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                />
                </div>
                <div className="login_div">
                <label className='login_label'>Room Cost :</label>
                <input className='login_input'
                  type="number"
                  placeholder="0"
                  value={roomCost}
                  onChange={(e) => setRoomCost(e.target.value)}
                  required
                />
                </div>
                <button type="submit" className='login_button'>Add Room</button>
              </form>
              </div>
            </>
          )}
      </div>
    </div>
    </div>
  )
}

export default Admin;
