import React from 'react'
import './doctorTiles.css'
// import image from '../../assets/Bazad.jpeg'

const DoctorTiles = ({params}) => {
  return (
    <div>
        <div className="tile_container">
            <div className="tile">
                <div className="tile_image">
                    <img src="#" alt="doctor" />
                </div>
                <div className='tile_details'>
                    <center>
                    <span className='tile_name'>{params.firstName} {params.lastName}</span><br />
                    <span className='tile_spec'>{params.specialization}</span>
                    </center>
                </div>
                <div className='tile_desc'>
                    <p>{params.phone}</p>
                    <p>{params.mail}</p>
                    <p>{params.education}</p>
                    <p>{params.post}</p>
                    <p>{params.department}</p>
                    <p>{params.specialization}</p>


                    {/* <p>Dr. Ashish is a Cardiologist with 10 years of experience.</p>
                    <p>He is available at XYZ hospital on Monday, Wednesday and Friday.</p>
                    <p>He is available for online consultation.</p> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default DoctorTiles
