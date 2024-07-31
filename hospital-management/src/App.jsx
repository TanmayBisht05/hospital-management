import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Section1 from './components/section1/Section1.jsx'
import Navbar from './components/navbar/navbar.jsx'
import About from './components/about/About.jsx'
import Footer from './components/footer.jsx'
import DoctorTiles from './components/doctorTiles/DoctorTiles.jsx'
import bazad from './assets/Bazad.jpeg'
import Contact from './pages/contact.jsx'

function App() {

  return (
    <>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Section1 />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
    <Footer />
    </>
  )
}

export default App
