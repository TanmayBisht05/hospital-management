import './doctor.css'
import DoctorTiles from '../doctorTiles/DoctorTiles';
import doc1 from '../../assets/doc1.jpg';
import doc2 from '../../assets/doc2.jpg';
import doc3 from '../../assets/doc3.webp';
const Doctor = () => {
    return (
        <div>
            { <DoctorTiles params={{'img':doc1, 'name':'Dr. Anoop Misra', 'spec':'EXECUTIVE CHAIRMAN FORTIS C DOC', 'desc':'Diabetology/Endocrinology | Diabetology/Endocrinology | Endocrinology'}} />}
            { <DoctorTiles params={{'img':doc2, 'name':'Dr. Ajay Kaul', 'spec':'CHAIRMAN CARDIAC SCIENCE', 'desc':'Cardiac Sciences | Adult CTVS (Cardiothoracic and Vascular Surgery) | Heart Transplant | Heart & Lung Transplant'}} />}
            { <DoctorTiles params={{'img':doc3, 'name':'Dr. Ashok Seth', 'spec':'CHAIRMAN – LIVER TRANSPLANT & HEPATO - BILIARY SCIENCE ', 'desc':'Gastroenterology and Hepatobiliary Sciences | GI, Minimal Access and Bariatric Surgery | Liver Transplant | Metabolic & Bariatric Surgery'}} />}
        </div>
    )
}

export default Doctor;