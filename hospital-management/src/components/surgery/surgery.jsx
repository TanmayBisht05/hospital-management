import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To capture the URL parameter
import "./surgery.css";
import Fake from '../../utility/Fake';
import Navbar from "../navbar/navbar";

const Surgery = () => {
  const { doctorId } = useParams(); // Capture doctorId from the URL
  const [surgeries, setSurgeries] = useState([]);
  const [newSurgery, setNewSurgery] = useState({
    surgeryID: "",       // Added surgeryID to the state
    patientID: "",
    doctorID: doctorId,  // Initialize with the captured doctorId
    type: "",
    criticalLevel: "",
  });

  // Fetch all surgeries for a specific doctor
  const fetchSurgeries = async () => {
    try {
      const response = await fetch(`http://localhost:8080/surgery/doctor/${doctorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch surgeries");
      }
      const data = await response.json();
      setSurgeries(data);
    } catch (error) {
      console.error("Error fetching surgeries:", error);
    }
  };

  useEffect(() => {
    fetchSurgeries();
  }, [doctorId]); // Re-fetch surgeries if doctorId changes

  // Add a new surgery for the current doctor
  const addSurgery = async () => {
    try {
      const surgeryData = {
        ...newSurgery,
        doctorID: doctorId, // Ensure doctorId from URL is added here
      };

      // Update the URL to include doctorId
      const response = await fetch(`http://localhost:8080/surgery/${doctorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surgeryData),
      });

      // Log the response for debugging
      const responseBody = await response.json();
      console.log("Response:", responseBody);

      if (response.status === 201) {
        fetchSurgeries(); // Refresh the list
        setNewSurgery({
          surgeryID: "",    // Resetting all fields
          patientID: "",
          doctorID: doctorId,
          type: "",
          criticalLevel: "",
        });
      } else {
        console.error("Failed to add surgery. Status:", response.status, "Response:", responseBody);
      }
    } catch (error) {
      console.error("Error adding surgery:", error);
    }
  };

  // Delete a surgery
  const deleteSurgery = async (surgeryID) => {
    try {
      const response = await fetch(`http://localhost:8080/surgery/${surgeryID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSurgeries(); // Refresh the list
      } else {
        console.error("Failed to delete surgery. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting surgery:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Fake />
      <div className="surgery-container">
        <div className="surgery-list">
          <h2 className="surgery-list-heading">Surgeries for Doctor {doctorId}</h2>
          <ul>
            {surgeries.map((surgery) => (
              <li key={surgery.surgeryID} className="surgery-item">
                <div className="surgery-item-type">{surgery.type}</div>
                <div className="surgery-item-details">
                  Surgery ID: {surgery.surgeryID} |Patient ID: {surgery.patientID} | Doctor ID: {surgery.doctorID} | Type: {surgery.type} | Critical Level: {surgery.criticalLevel}
                </div>
                <button
                  className="delete-button"
                  onClick={() => deleteSurgery(surgery.surgeryID)}
                >
                  Delete Surgery
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="actions-container">
          <h2>Add Surgery for Doctor {doctorId}</h2>
          <input
            type="text"
            placeholder="Surgery ID"
            value={newSurgery.surgeryID}
            onChange={(e) => setNewSurgery({ ...newSurgery, surgeryID: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Surgery Type"
            value={newSurgery.type}
            onChange={(e) => setNewSurgery({ ...newSurgery, type: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Patient ID"
            value={newSurgery.patientID}
            onChange={(e) => setNewSurgery({ ...newSurgery, patientID: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Critical Level"
            value={newSurgery.criticalLevel}
            onChange={(e) => setNewSurgery({ ...newSurgery, criticalLevel: e.target.value })}
            className="input-field"
          />
          <button className="add-button" onClick={addSurgery}>
            Add Surgery
          </button>
        </div>
      </div>
    </div>
  );
};

export default Surgery;
