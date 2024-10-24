import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./treatmentProcedure.css";

const TreatmentProcedure = () => {
    const { doctorId } = useParams(); // Get doctorId from the route parameters
    const [treatmentProcedures, setTreatmentProcedures] = useState([]);
    const [searchId, setSearchId] = useState(""); // State for search input
    const navigate = useNavigate(); // To navigate programmatically

    useEffect(() => {
        // Fetch treatment procedures for the specific doctor or all if no ID provided
        const fetchTreatmentProcedures = async () => {
            try {
                const url = doctorId 
                    ? `http://localhost:8080/treatmentProcedure/${doctorId}` 
                    : `http://localhost:8080/treatmentProcedure`; // Fetch all if no ID
                const response = await fetch(url);
                const data = await response.json();
                setTreatmentProcedures(data);
            } catch (error) {
                console.error("Error fetching treatment procedures:", error);
            }
        };

        fetchTreatmentProcedures();
    }, [doctorId]); // Run effect when doctorId changes

    // Handle search
    const handleSearch = () => {
        if (searchId) {
            navigate(`/treatmentProcedure/${searchId}`); // Navigate to the new route
        }
    };

    return (
        <div className="treatment-procedure-container">
            <h2 className="treatment-procedure-list-heading">
                Treatment Procedures {doctorId ? `for Doctor ID: ${doctorId}` : ""}
            </h2>
            <div className="search-container">
                <input
                    type="number"
                    placeholder="Search by Doctor ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
            <div className="treatment-procedure-list">
                {treatmentProcedures.map((procedure) => (
                    <div key={procedure.patientID} className="treatment-procedure-item">
                        <div className="treatment-procedure-item-details">
                            Patient ID: {procedure.patientID} | Critical Level: {procedure.critical}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TreatmentProcedure;
