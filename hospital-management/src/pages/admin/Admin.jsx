import React, { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import './admin.css'
import AuthContext from '../../AuthContext.jsx'
import Cookies from 'js-cookie';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import Sidebar_admin from '../../components/sidebar_admin/Sidebar_admin';

const Admin = () => {
  const { adashboardState, signup, backend_url } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userType = Cookies.get('userType');
  const id = parseInt(Cookies.get('id'), 10);

  const [requests, setRequests] = useState([]);

  const [chemists, setChemists] = useState([]); // New state for chemists list
  const [selectedChemist, setSelectedChemist] = useState(''); 
  const [salary, setSalary] = useState(''); 
  const [issueDate, setIssueDate] = useState(''); 

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorSalary, setDoctorSalary] = useState('');
  const [doctorIssueDate, setDoctorIssueDate] = useState('');


    useEffect(() => {
        fetchRequests();
        fetchChemists();
        fetchDoctors();
    }, []);

    const fetchRequests = async () => {
        const response = await fetch(`${backend_url}/medicine-requests`);
        const data = await response.json();
        setRequests(data);
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
        const response = await fetch(`/medicine-requests/${requestID}/deny`, { method: 'DELETE' });
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
  const handleRegDoc = async () => {
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
            window.location.reload();
        } else {
            alert('Invalid credentials');
        }
    }
    const handleRegChem = async () => {
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
            window.location.reload();
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
            window.location.reload();
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
                        <input className='login_input' id='dfirstName' type="text" placeholder="First Name" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dlastName" className="login_label">Last Name : </label>
                        <input className='login_input' id='dlastName' type="text" placeholder="Last Name" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="ddob" className="login_label">Date of Birth : </label>
                        <input className='login_input' id='ddob' type="date" placeholder="Date of Birth" />
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
                        <input className='login_input' id='demail' type="text" placeholder="Email" />
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
                        <input className='login_input' id='dpassword' type="password" placeholder="Password" />
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
                        <input className='login_input' id='cfirstName' type="text" placeholder="First Name" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="clastName" className="login_label">Last Name : </label>
                        <input className='login_input' id='clastName' type="text" placeholder="Last Name" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cdob" className="login_label">Date of Birth : </label>
                        <input className='login_input' id='cdob' type="date" placeholder="Date of Birth" />
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
                        <input className='login_input' id='cemail' type="text" placeholder="Email" />
                    </div>
                    <div className="login_div">
                        <label htmlFor="cpassword" className="login_label">Password : </label>
                        <input className='login_input' id='cpassword' type="password" placeholder="Password" />
                    </div>
                    <button className='login_button' type="submit">Register</button>
                </div>
            </form>
          </div>
        </>}
        {adashboardState === 2 && <>
            <center><h1 className="dashboard-header">Machinery</h1></center>
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
                <button className="login_button" type='submit'>{machineryID === -1 ? 'Add' : 'Edit'}</button>
            </form>
          </div>
            <center><h1>Machinery List</h1></center>
            <ul>
                {machineryList.map((machinery) => (
                    <li key={machinery.machineID}>
                        {machinery.name} - ${machinery.cost}{' '}
                        <button onClick={() => handleEditMachinery(machinery)}>Edit</button>
                    </li>
                ))}
            </ul>
        </>}
        {adashboardState === 3 && <>
            <center><h1 className="dashboard-header">Requests</h1></center>
          <div>
            <h2>Medicine Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.requestID}>
                        <p>{request.medicineName} - {request.amount}</p>
                        <button onClick={() => handleAcceptRequest(request.requestID)}>Accept</button>
                        <button onClick={() => handleDenyRequest(request.requestID)}>Deny</button>
                    </li>
                ))}
            </ul>
        </div>
        </>}
        {adashboardState === 4 && ( // Dashboard state 4 for Salary Management
            <>
              <center><h1 className="dashboard-header">Manage Chemist Salaries</h1></center>
              <div className="login_div">
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
                <center><h1 className="dashboard-header">Manage Doctor Salaries</h1></center>
              <form onSubmit={handleDoctorSalarySubmit} className="login_form">
                <label>Select Doctor:</label>
                <select
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
                <input
                  type="number"
                  placeholder="Salary Amount"
                  value={doctorSalary}
                  onChange={(e) => setDoctorSalary(e.target.value)}
                  required
                />
                <input
                  type="date"
                  placeholder="Issue Date"
                  value={doctorIssueDate}
                  onChange={(e) => setDoctorIssueDate(e.target.value)}
                  required
                />
                <button type="submit">Submit Salary</button>
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
