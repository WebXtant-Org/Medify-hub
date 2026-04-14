import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Achievements from './components/Achivement'
import MedicalCodingCourses from './components/MedicalCodingCourses'
import Achievers from './components/Achievers'
import Gallery from './components/Gallery'
import AboutUs from './components/AboutUs'
import WhatWeOffer from './components/WhatWeOffer'
import MissionVision from './components/MissionVision'
import Footer from './components/Footer'
import WhatsAppFloating from './components/WhatsAppFloating'
import Certification from './components/Certification'
const App = () => {
  return (
    <div>
      <div id="home">
        <HeroSection />
      </div>
      <Achievements />
      <div id="courses">
        <MedicalCodingCourses />
      </div>
      <Achievers />
      <div id="about">
        <AboutUs />
      </div>
      <WhatWeOffer />
      <Gallery />
      <Certification />
      <MissionVision />
      <div id="contact">
        <Footer />
      </div>
      <WhatsAppFloating phone="9952188735" />
    </div>
  )
}

export default App
