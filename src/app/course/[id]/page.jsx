'use client'

import React from 'react'
import Navbar from '@/components/public/Navbar'
import CourseDetails from '@/components/public/CourseDetails'
import Footer from '@/components/public/Footer'

const CourseDetailsPage = () => {
  return (
    <div className="public-website">
      <Navbar />
      <CourseDetails />
      <Footer />
    </div>
  )
}

export default CourseDetailsPage
