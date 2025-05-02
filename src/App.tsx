import { Container } from 'react-bootstrap'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./Pages/Home"
import Store from "./Pages/Store"
import FoodNavbar from './Components/FoodNavbar'
import Contact from './Pages/Contact'
import FoodFooter from './Components/FoodFooter'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermsOfService from './Pages/TermsOfService'
function App() {

  return (
    <>
    <FoodNavbar/>
      <Container className='mb-4 mt-4'>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/menu-items" element={<Store/>} />
            <Route path="/contact" element = {<Contact/>}/>
            <Route path="/privacy" element={<PrivacyPolicy/>} />
            <Route path='/terms' element={<TermsOfService/>} />
        </Routes>
    </Container>
    <FoodFooter/>
    </>
  )
}

export default App
