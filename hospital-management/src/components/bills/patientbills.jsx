import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './patientbills.css';
const PatientBills = ({ patientID }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bill/patient/${patientID}`);
                setBills(response.data);

                // Calculate the total cost of all bills
                const total = response.data.reduce((sum, bill) => sum + bill.totalCost, 0);
                setTotalCost(total);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, [patientID]);

    if (loading) return <p>Loading bills...</p>;
    if (error) return <p>Error fetching bills: {error}</p>;

    return (
        <div className='patient_bills'>
            <h2>Patient Bills</h2>
            <table className='patient_bills_table'>
                <thead>
                    <tr>
                        <th>Bill ID</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.billID}>
                            <td>{bill.billID}</td>
                            <td>{bill.totalCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <strong>Total Cost: </strong>&nbsp; &nbsp;${totalCost.toFixed(2)}
            </div>
        </div>
    );
};

export default PatientBills;
