import './App.css'
import Section1 from './components/section1/Section1.jsx'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer.jsx'
import DoctorTiles from './components/doctorTiles/DoctorTiles.jsx'

function App() {

  return (
    <>
      <Navbar />
      <Section1 />
      <DoctorTiles params = {{'name':'Ashish', 'age':60, 'spec':'Cardiologist'}}/>
      <Footer />
    </>
  )
}

export default App
