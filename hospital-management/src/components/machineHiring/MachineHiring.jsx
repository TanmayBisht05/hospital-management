import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './machineHiring.css';

const MachineHiring = ({ doctorID }) => {
    const [machineHires, setMachineHires] = useState([]);
    const [machines, setMachines] = useState([]); // To store machine details in an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        machineID: '',
        startDate: '',
        endDate: ''
    });
    const [formError, setFormError] = useState('');

    // Fetch machine hire data and machine details
    useEffect(() => {
        const fetchMachineHires = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/machineHiring/doctor/${doctorID}`);
                setMachineHires(response.data);
            } catch (err) {
                setError('Error fetching machine hire data');
            } finally {
                setLoading(false);
            }
        };

        const fetchMachineDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8080/machinery');
                setMachines(response.data);  // Now it's an array of machinery objects
            } catch (err) {
                setError('Error fetching machine details');
            }
        };

        fetchMachineHires();
        fetchMachineDetails();
    }, [doctorID]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.machineID || !formData.startDate || !formData.endDate) {
            setFormError('All fields are required!');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/machineHiring/doctor/${doctorID}`, formData);
            const newHire = response.data;
            setMachineHires((prevHires) => [...prevHires, newHire]);
            setFormData({ machineID: '', startDate: '', endDate: '' });
            setFormError('');
            window.location.reload();
        } catch (err) {
            setFormError('Error adding new machine hire');
        }
    };

    // Handle delete machine hire
    const handleDelete = async (hiringID) => {
        try {
            await axios.delete(`http://localhost:8080/machineHiring/${hiringID}/doctor/${doctorID}`);
            setMachineHires((prevHires) => prevHires.filter(hire => hire.hiringID !== hiringID));
        } catch (err) {
            setError('Error deleting machine hire');
        }
    };

    if (loading) return <div>Loading machine hire data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {/* Form to add new machine hire */}
            <div className="form-container">
                <h2>Hire a new Machine </h2>
                {formError && <p className="error">{formError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="machineID">Select Machine</label>
                        <select
                            id="machineID"
                            name="machineID"
                            value={formData.machineID}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a machine</option>
                            {machines.map((machine) => (
                                <option key={machine.machineID} value={machine.machineID}>
                                    {machine.name} (ID: {machine.machineID})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Add Hire</button>
                </form>
            </div>

            <center><h1> Hired Machines</h1></center>

            {/* Display machine hire records */}
            {machineHires.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Hire ID</th>
                                <th>Machine ID</th>
                                <th>Machine Name</th> {/* Added column for Machine Name */}
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Action</th> {/* Added Action column for Delete button */}
                            </tr>
                        </thead>
                        <tbody>
                            {machineHires.map((hire) => (
                                <tr key={hire.hiringID}>
                                    <td>{hire.hiringID}</td>
                                    <td>{hire.machineID}</td>
                                    <td>{machines.find(machine => machine.machineID === hire.machineID)?.name || 'Unknown'}</td> {/* Display machine name */}
                                    <td>{new Date(hire.startDate).toLocaleString().split(',')[0]}</td>
                                    <td>{new Date(hire.endDate).toLocaleString().split(',')[0]}</td>
                                    <td>
                                        <button onClick={() => handleDelete(hire.hiringID)}>Delete</button> {/* Delete button */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No machine hire records found for this doctor.</p>
            )}
        </div>
    );
};

export default MachineHiring;
