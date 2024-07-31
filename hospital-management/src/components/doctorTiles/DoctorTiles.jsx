import React from 'react'
import './doctorTiles.css'
import image from '../../assets/Bazad.jpeg'

const DoctorTiles = ({params}) => {
  return (
    <div>
        <div className="tile_container">
            <div className="tile">
                <div className="tile_image">
                    <img src={image} alt="doctor" />
                </div>
                <div className="tile_name">
                    <p className="tile_name">{params.name}</p>
                    <p className="tile_speciality">{params.spec}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DoctorTiles
