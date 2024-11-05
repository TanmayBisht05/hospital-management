import React, { useEffect, useState } from 'react';

const DoctorSalaries = ({ doctorID }) => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalaries();
    }, [doctorID]);

    const fetchSalaries = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/doctor-salaries/take/${doctorID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch salary data');
            }
            const data = await response.json();
            setSalaries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (dsID) => {
        try {
            const response = await fetch(`http://localhost:8080/doctor-salaries/${dsID}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete salary entry');
            }
            // Remove the deleted entry from the state
            setSalaries(salaries.filter((salary) => salary.dsID !== dsID));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <center><h3>Loading...</h3></center>;
    if (error) return <center><h3>{error}</h3></center>;

    return (
        <div>
            <center><h2>Salary Records</h2></center>
            <ul>
                {salaries.map((salary) => (
                    <li key={salary.dsID}>
                        <p><strong>Salary:</strong> {salary.salary}</p>
                        <p><strong>Issue Date:</strong> {new Date(salary.issueDate).toLocaleDateString()}</p>
                        <button onClick={() => handleAccept(salary.dsID)}>Accept</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorSalaries;
