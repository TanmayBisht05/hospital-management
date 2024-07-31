import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Section1 from './components/section1/Section1.jsx'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer.jsx'
import DoctorTiles from './components/doctorTiles/DoctorTiles.jsx'
import bazad from './assets/Bazad.jpeg'

import Contact from './pages/contact.jsx'

function App() {

  return (
    <>
      <Section1 />
    </>
  )
}

export default App
