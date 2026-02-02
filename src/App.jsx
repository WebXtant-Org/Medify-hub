import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App