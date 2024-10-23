import React, { useEffect, useState } from 'react';
import './medicines.css';
import Fake from '../../utility/Fake';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [medicineID, setMedicineID] = useState('');
    const [medicineDetails, setMedicineDetails] = useState({});

    const fetchMedicines = async () => {
        const response = await fetch('http://localhost:8080/medicines');
        const data = await response.json();
        setMedicines(data);
    };

    const fetchMedicineById = async () => {
        const response = await fetch(`http://localhost:8080/medicines/${medicineID}`);
        const data = await response.json();
        setMedicineDetails(data);
    };

    const handleAddMedicine = async () => {
        const maxID = medicines.reduce((max, medicine) => Math.max(max, medicine.medicineID), 0);
        const newMedicine = {
            ...medicineDetails,
            medicineID: maxID + 1
        };

        const response = await fetch('http://localhost:8080/medicines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMedicine),
        });

        if (response.ok) {
            fetchMedicines();
            setMedicineDetails({});
        }
    };

    const handleUpdateMedicine = async () => {
        const response = await fetch(`http://localhost:8080/medicines/${medicineDetails.medicineID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicineDetails),
        });
        if (response.ok) {
            fetchMedicines();
            setMedicineDetails({});
        }
    };

    const handleDeleteMedicine = async (medicineID) => {
        const response = await fetch(`http://localhost:8080/medicines/${medicineID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchMedicines(); // Refresh the list after deletion
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    return (
        <div>
            <Fake />
        <div className='medicines-container'>
            <div className='medicines-list'>
                <div className='medicines-list-heading'>Medicines</div>
                <div className='header-row'>
                    <div className='header-cell'>Medicine ID</div>
                    <div className='header-cell'>Medicine Name</div>
                    <div className='header-cell'>Cost</div>
                    <div className='header-cell'>Type</div>
                    <div className='header-cell'>Company Name</div>
                    <div className='header-cell'>Actions</div> {/* New column for delete button */}
                </div>
                <ul>
                    {medicines.map(medicine => (
                        <li key={medicine.medicineID} className='medicine-item'>
                            <div className='header-row'>
                                <div className='header-cell'>{medicine.medicineID}</div>
                                <div className='header-cell'>{medicine.medicineName}</div>
                                <div className='header-cell'>{medicine.cost}</div>
                                <div className='header-cell'>{medicine.type}</div>
                                <div className='header-cell'>{medicine.companyName}</div>
                                <div className='header-cell'>
                                    <button 
                                        className='button delete-button' 
                                        onClick={() => handleDeleteMedicine(medicine.medicineID)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='actions-container'>
                <input
                    type='number'
                    value={medicineID}
                    onChange={(e) => setMedicineID(e.target.value)}
                    placeholder='Enter Medicine ID'
                />
                <button className='button' onClick={fetchMedicineById}>Search Medicine</button>
                <input
                    type='text'
                    placeholder='Medicine Name'
                    value={medicineDetails.medicineName || ''}
                    onChange={(e) => setMedicineDetails({ ...medicineDetails, medicineName: e.target.value })}
                />
                <input
                    type='number'
                    placeholder='Cost'
                    value={medicineDetails.cost || ''}
                    onChange={(e) => setMedicineDetails({ ...medicineDetails, cost: parseFloat(e.target.value) })}
                />
                <input
                    type='text'
                    placeholder='Type'
                    value={medicineDetails.type || ''}
                    onChange={(e) => setMedicineDetails({ ...medicineDetails, type: e.target.value })}
                />
                <input
                    type='text'
                    placeholder='Company Name'
                    value={medicineDetails.companyName || ''}
                    onChange={(e) => setMedicineDetails({ ...medicineDetails, companyName: e.target.value })}
                />
                <button className='button' onClick={handleAddMedicine}>Add Medicine</button>
                <button className='button' onClick={handleUpdateMedicine}>Update Medicine</button>
            </div>
        </div>
        </div>
    );
};

export default Medicines;
