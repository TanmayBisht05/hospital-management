import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Section1 from './components/section1/Section1.jsx'
import Contact from './pages/contact.jsx'
import Doctor from './components/doctor/Doctor.jsx'
import About from './components/about/About.jsx'
import Pdashboard from './pages/patient/Pdashboard.jsx'
import { AuthProvider } from './AuthContext'
import Medicines from './components/medicines/medicine.jsx'
function App() {

  return (
    <AuthProvider>
    {/* <Navbar /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Section1 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path = "/about" element = {<About />} />
        <Route path = "/patients" element = {<Pdashboard />} />
        <Route path = "/medicines" element = {<Medicines />} />        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
