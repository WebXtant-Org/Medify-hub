import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Navbar from './components/Navbar'
import Contact from './components/Contact'
import Footer from './components/Footer'
const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App