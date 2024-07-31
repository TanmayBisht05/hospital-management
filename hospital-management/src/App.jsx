import './App.css'
import Section1 from './components/section1/Section1.jsx'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer.jsx'
import DoctorTiles from './components/doctorTiles/DoctorTiles.jsx'
import bazad from './assets/Bazad.jpeg'

function App() {

  return (
    <>
      <Navbar />
      <Section1 />
      <DoctorTiles params = {{'img':bazad, 'name':'Ashish', 'spec':'Cardiologist', 'desc':'bla bla bla'}}/>
      <Footer />
    </>
  )
}

export default App
