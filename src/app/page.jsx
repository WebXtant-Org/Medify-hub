'use client'

import React from 'react'
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import Achievements from '@/components/public/Achivement'
import MedicalCodingCourses from '@/components/public/MedicalCodingCourses'
import Achievers from '@/components/public/Achievers'
import Gallery from '@/components/public/Gallery'
import AboutUs from '@/components/public/AboutUs'
import WhatWeOffer from '@/components/public/WhatWeOffer'
import MissionVision from '@/components/public/MissionVision'
import Footer from '@/components/public/Footer'
import WhatsAppFloating from '@/components/public/WhatsAppFloating'
import Certification from '@/components/public/Certification'

const PublicPage = () => {
  return (
    <div className="public-website">
      <Navbar />
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

export default PublicPage
