import './doctor.css'
import DoctorTiles from '../doctorTiles/DoctorTiles';
import doc1 from '../../assets/doc1.jpg';
import doc2 from '../../assets/doc2.jpg';
import doc3 from '../../assets/doc3.webp';
import doc4 from '../../assets/doc4.webp';
import doc5 from '../../assets/doc5.jpg';
import doc6 from '../../assets/doc6.jpg';
import doc7 from '../../assets/doc7.jpg';
import doc8 from '../../assets/doc8.jpg';
import doc9 from '../../assets/doc9.jpg';
import Fake from '../../utility/Fake';
import { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer';
const Doctor = () => {


    const [Doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Fetch data from API endpoint
        const fetchDoctors = async () => {
          try {
            const response = await fetch('http://localhost:8080/doctor');
            const data = await response.json();
            setDoctors(data);  // Assuming data is an array of doctors
          } catch (error) {
            console.error('Error fetching doctor data:', error);
          }
        };
    
        fetchDoctors();
      }, []); 

    console.log(Doctors)

    return(
        <div>
            <Navbar />
            <Fake />
        <div className='doctor-page-tiles'>
        <div className='doctor-page-heading'>Doctors</div>
        <div className='doctor-page'>
        {Doctors.map((doctor, index) => (
        <DoctorTiles key={index} params={doctor} />
      ))}
        </div>
        </div>
        <Footer />
        </div>
    );
}

export default Doctor;