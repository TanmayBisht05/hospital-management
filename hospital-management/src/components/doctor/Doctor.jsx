import './doctor.css'
import DoctorTiles from '../doctorTiles/DoctorTiles';
import Fake from '../../utility/Fake';
import { useContext, useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer';
import AuthContext from '../../AuthContext';
const Doctor = () => {
  const {backend_url} = useContext(AuthContext);

    const [Doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Fetch data from API endpoint
        const fetchDoctors = async () => {
          try {
            const response = await fetch(`${backend_url}/doctor`);
            const data = await response.json();
            setDoctors(data);
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