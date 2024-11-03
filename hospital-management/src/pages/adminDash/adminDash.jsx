import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function AdminDash() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const userType = Cookies.get('userType');
    const id = parseInt(Cookies.get('id'), 10);
    if (isNaN(id)) {
        console.error('Invalid chemist ID');
    }
    useEffect(() => {
        if (!token || userType!='ADMIN') {
            navigate('/');
          }
    }, [token])
    const [doctorFormData, setDoctorFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        education: '',
        gender: '',
        phone: '',
        email: '',
        post: '',
        department: '',
        specialization: '',
        password: ''
    });

    const [machineryFormData, setMachineryFormData] = useState({
        machineID: '',
        name: '',
        cost: ''
    });

    const [chemistData, setChemistData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        email: '',
        phone: '',
        password: ''
    });

    const [machineryList, setMachineryList] = useState([]);
    const [selectedMachinery, setSelectedMachinery] = useState(null);

    useEffect(() => {
        fetchMachinery();
    }, []);

    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setDoctorFormData({ ...doctorFormData, [name]: value });
    };

    const handleChemistChange = (e) => {
        const { name, value } = e.target;
        setChemistData({ ...chemistData, [name]: value });
    };

    const handleMachineryChange = (e) => {
        const { name, value } = e.target;
        setMachineryFormData({ ...machineryFormData, [name]: value });
    };

    const handleChemistSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/chemist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chemistData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            console.log(result);

            setChemistData({
                firstName: '',
                lastName: '',
                dob: '',
                gender: '',
                email: '',
                phone: '',
                password: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            console.log(result);

            setDoctorFormData({
                firstName: '',
                lastName: '',
                dob: '',
                education: '',
                gender: '',
                phone: '',
                email: '',
                post: '',
                department: '',
                specialization: '',
                password: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMachinery = async () => {
        try {
            const response = await fetch('http://localhost:8080/machinery');
            const data = await response.json();
            setMachineryList(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMachinerySubmit = async (e) => {
        e.preventDefault();

        const method = machineryFormData.machineID ? 'PUT' : 'POST';
        const endpoint = machineryFormData.machineID
            ? `http://localhost:8080/machinery/${machineryFormData.machineID}`
            : 'http://localhost:8080/machinery';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(machineryFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);

            setMachineryFormData({ machineID: '', name: '', cost: '' });
            fetchMachinery(); // Refresh list
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditMachinery = (machinery) => {
        setMachineryFormData(machinery);
    };

    return (
        <div>
            <Navbar />
            <Fake />
            <h1>Admin Dashboard</h1>
            
            {/* Doctor Registration Section */}
            <div className="doctor-registration">
                <h2>Doctor Registration</h2>
                <form onSubmit={handleDoctorSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            maxLength="50"
                            value={doctorFormData.firstName}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            maxLength="50"
                            value={doctorFormData.lastName}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={doctorFormData.dob}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Education:
                        <input
                            type="text"
                            name="education"
                            maxLength="100"
                            value={doctorFormData.education}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Gender:
                        <input
                            type="text"
                            name="gender"
                            maxLength="10"
                            value={doctorFormData.gender}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="phone"
                            maxLength="15"
                            value={doctorFormData.phone}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={doctorFormData.email}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Post:
                        <input
                            type="text"
                            name="post"
                            maxLength="50"
                            value={doctorFormData.post}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Department:
                        <input
                            type="text"
                            name="department"
                            maxLength="50"
                            value={doctorFormData.department}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Specialization:
                        <input
                            type="text"
                            name="specialization"
                            maxLength="50"
                            value={doctorFormData.specialization}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={doctorFormData.password}
                            onChange={handleDoctorChange}
                            required
                        />
                    </label>
                    <button type="submit">Register Doctor</button>
                </form>
            </div>

            {/* Chemist Registration Form */}
            <div className="chemist-registration">
                <h2>Chemist Registration</h2>
                <form onSubmit={handleChemistSubmit}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" maxLength="50" value={chemistData.firstName} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" maxLength="50" value={chemistData.lastName} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="dob" value={chemistData.dob} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Gender:
                        <input type="text" name="gender" maxLength="10" value={chemistData.gender} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={chemistData.email} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Phone:
                        <input type="text" name="phone" maxLength="15" value={chemistData.phone} onChange={handleChemistChange} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" value={chemistData.password} onChange={handleChemistChange} required />
                    </label>
                    <button type="submit">Register Chemist</button>
                </form>
            </div>
            {/* Machinery Management Section */}
            <div className="machinery-management">
                <h2>{machineryFormData.machineID ? 'Update Machinery' : 'Add New Machinery'}</h2>
                <form onSubmit={handleMachinerySubmit}>
                    <label>
                        Machine Name:
                        <input
                            type="text"
                            name="name"
                            maxLength="50"
                            value={machineryFormData.name}
                            onChange={handleMachineryChange}
                            required
                        />
                    </label>
                    <label>
                        Cost:
                        <input
                            type="number"
                            name="cost"
                            value={machineryFormData.cost}
                            onChange={handleMachineryChange}
                            required
                        />
                    </label>
                    <button type="submit">
                        {machineryFormData.machineID ? 'Update Machinery' : 'Add Machinery'}
                    </button>
                </form>

                <h2>Machinery List</h2>
                <ul>
                    {machineryList.map((machinery) => (
                        <li key={machinery.machineID}>
                            {machinery.name} - ${machinery.cost}{' '}
                            <button onClick={() => handleEditMachinery(machinery)}>Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDash;
