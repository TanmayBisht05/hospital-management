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
            <Fake />
        <div className='doctor-page-tiles'>
        <div className='doctor-page-heading'>Doctors</div>
        <div className='doctor-page'>
        {Doctors.map((doctor, index) => (
        <DoctorTiles key={index} params={doctor} />
      ))}
        </div>
        </div>
        </div>
    );

    // return (
    //     <div>
    //         <Fake />
    //     <div className='doctor-page-tiles'>
    //         <div className='doctor-page-heading'>Doctors</div>
    //         <div className='doctor-page'>
    //         { <DoctorTiles params={{'img':doc1, 'name':'Dr. Anoop Misra', 'spec':'EXECUTIVE CHAIRMAN FORTIS C DOC', 'desc':'Diabetology/Endocrinology | Diabetology/Endocrinology | Endocrinology'}} />}
    //         { <DoctorTiles params={{'img':doc2, 'name':'Dr. Ajay Kaul', 'spec':'CHAIRMAN CARDIAC SCIENCE', 'desc':'Cardiac Sciences | Adult CTVS (Cardiothoracic and Vascular Surgery) | Heart Transplant | Heart & Lung Transplant'}} />}
    //         { <DoctorTiles params={{'img':doc3, 'name':'Dr. Shina Seth', 'spec':'CHAIRMAN – LIVER TRANSPLANT & HEPATO - BILIARY SCIENCE ', 'desc':'Gastroenterology and Hepatobiliary Sciences | GI, Minimal Access and Bariatric Surgery | Liver Transplant | Metabolic & Bariatric Surgery'}} />}
    //         { <DoctorTiles params={{'img':doc4, 'name':'Dr. Gourdas Choudhuri', 'spec':'CHAIRMAN-GASTROENTEROLOGY | Fortis Gurgaon', 'desc':'Gastroenterology and Hepatobiliary Sciences | Gastroenterology | Gastroenterology and Hepatobiliary Sciences'}} />}
    //         { <DoctorTiles params={{'img':doc5, 'name':'Dr. Vivek Jawali', 'spec':'CHAIRMAN CARDIAC SCIENCES | Fortis BG Road', 'desc':'Cardiac Sciences | Adult CTVS (Cardiothoracic and Vascular Surgery) | Heart Transplant | Thoracic Surgery | Thoracic Surgery'}} />}
    //         { <DoctorTiles params={{'img':doc6, 'name':'Dr. Vivek Vij', 'spec':'CHAIRMAN – LIVER TRANSPLANT & HEPATO - BILIARY SCIENCE | Fortis Okhla', 'desc':'Gastroenterology and Hepatobiliary Sciences | GI, Minimal Access and Bariatric Surgery | Liver Transplant | Metabolic & Bariatric Surgery'}} />}
    //         { <DoctorTiles params={{'img':doc7, 'name':'Dr. Krishna Subramony Iyer', 'spec':'EXECUTIVE DIRECTOR PAEDIATRIC CARDIO THORACIC VASCULAR SURGERY | Fortis Okhla', 'desc':'Paediatrics | Paediatric CTVS (Cardiothoracic and Vascular Surgery)'}} />}
    //         { <DoctorTiles params={{'img':doc8, 'name':'Dr. Shiv Kumar Choudhary', 'spec':'EXECUTIVE DIRECTOR CARDIO THORACIC VASCULAR SURGERY | Fortis Okhla', 'desc':'Cardiac Sciences | Adult CTVS (Cardiothoracic and Vascular Surgery)'}} />}
    //         { <DoctorTiles params={{'img':doc9, 'name':'Dr. Subrat Kumar Acharya', 'spec':'EXECUTIVE DIRECTOR GASTROENTEROLOGY | Fortis Okhla', 'desc':'Gastroenterology and Hepatobiliary Sciences | Gastroenterology and Hepatobiliary Sciences'}} />}
    //         </div>
    //     </div>
    //     </div>
    // )
}

export default Doctor;