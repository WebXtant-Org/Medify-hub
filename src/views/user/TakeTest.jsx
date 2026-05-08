'use client'

import { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import { showToast } from '@/utils/toast'

import { studentTestService } from '@/api/studentServices'
import Timer from './test-components/Timer'
import QuestionCard from './test-components/QuestionCard'
import QuestionPalette from './test-components/QuestionPalette'
import SubmitConfirmationDialog from './test-components/SubmitConfirmationDialog'

const TakeTest = ({ id }) => {
  const router = useRouter()
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionIndex: answer }
  const [markedForReview, setMarkedForReview] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)

      const [testData, questionsData] = await Promise.all([
        studentTestService.getTestDetails(id),
        studentTestService.getQuestions(id)
      ])

      setTest(testData)
      setQuestions(questionsData)
      
      // Initialize answers state if needed (visited tracking)
      const initialAnswers = {}

      initialAnswers[0] = null // Mark first question as visited but not answered
      setAnswers(initialAnswers)
    } catch (err) {
      console.error('Failed to load test:', err)
      toast.error('Failed to load test questions')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAnswerChange = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
    
    // Auto-save logic
    studentTestService.saveAnswer({
      testId: id,
      questionId: questions[currentIndex]._id,
      answer
    }).catch(err => console.error('Failed to auto-save answer:', err))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1

      setCurrentIndex(nextIdx)

      if (answers[nextIdx] === undefined) {
        setAnswers(prev => ({ ...prev, [nextIdx]: null }))
      }
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => 
      prev.includes(currentIndex) 
        ? prev.filter(i => i !== currentIndex) 
        : [...prev, currentIndex]
    )
    handleNext()
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const payload = {
        testId: id,
        answers: questions.map((q, idx) => ({
          questionId: q._id,
          answer: answers[idx] || null
        }))
      }

      await studentTestService.submitTest(payload)
      showToast('Test submitted successfully!')
      router.push('/dashboard/tests')
    } catch (err) {
      console.error('Submission failed:', err)
      showToast('Failed to submit test. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
      setOpenSubmitDialog(false)
    }
  }

  if (isLoading) {
    return (
      <Box className='flex items-center justify-center min-bs-[400px]'>
        <CircularProgress />
      </Box>
    )
  }

  if (!test || questions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color='error'>Test data not found or no questions available.</Typography>
        </CardContent>
      </Card>
    )
  }

  const stats = {
    total: questions.length,
    answered: Object.values(answers).filter(v => v !== null).length,
    unanswered: questions.length - Object.values(answers).filter(v => v !== null).length
  }

  return (
    <Box className='p-6'>
      {/* Top Header Section */}
      <Card className='mb-6 sticky top-0 z-10'>
        <CardContent className='flex items-center justify-between py-4'>
          <Box>
            <Typography variant='h4' color='primary' className='font-bold'>
              {test.title}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              Course: {test.courseId?.title || 'General'}
            </Typography>
          </Box>
          
          <Box className='flex items-center gap-6'>
            <Timer initialMinutes={test.duration || 60} onTimeUp={handleSubmit} />
            <Button 
              variant='contained' 
              color='primary' 
              size='large'
              onClick={() => setOpenSubmitDialog(true)}
              className='px-8'
            >
              Finish Test
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={6}>
        {/* Left Side: Question Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box className='flex flex-col gap-6 bs-full'>
            <QuestionCard 
              question={questions[currentIndex]} 
              index={currentIndex}
              selectedAnswer={answers[currentIndex]}
              onAnswerChange={handleAnswerChange}
            />
            
            <Card>
              <CardContent className='flex items-center justify-between'>
                <Button 
                  variant='tonal' 
                  color='secondary' 
                  startIcon={<i className='tabler-chevron-left' />}
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                >
                  Previous
                </Button>
                
                <Box className='flex gap-4'>
                  <Button 
                    variant='tonal' 
                    color='warning' 
                    onClick={handleMarkForReview}
                  >
                    {markedForReview.includes(currentIndex) ? 'Unmark Review' : 'Mark for Review'}
                  </Button>
                  
                  <Button 
                    variant='contained' 
                    color='primary' 
                    endIcon={<i className='tabler-chevron-right' />}
                    disabled={currentIndex === questions.length - 1}
                    onClick={handleNext}
                  >
                    Save & Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Side: Question Palette */}
        <Grid size={{ xs: 12, md: 4 }}>
          <QuestionPalette 
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onJumpToQuestion={(idx) => {
              setCurrentIndex(idx)

              if (answers[idx] === undefined) {
                setAnswers(prev => ({ ...prev, [idx]: null }))
              }
            }}
          />
        </Grid>
      </Grid>

      <SubmitConfirmationDialog 
        open={openSubmitDialog}
        handleClose={() => setOpenSubmitDialog(false)}
        handleSubmit={handleSubmit}
        stats={stats}
      />
    </Box>
  )
}

export default TakeTest
