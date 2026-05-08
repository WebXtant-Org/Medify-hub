'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'

const QuestionPalette = ({ 
  questions, 
  currentIndex, 
  answers, 
  markedForReview, 
  onJumpToQuestion 
}) => {
  
  const getStatusColor = (index) => {
    if (currentIndex === index) return 'primary' // Current
    if (markedForReview.includes(index)) return 'warning' // Marked for review
    if (answers[index]) return 'success' // Answered
    if (answers[index] === null) return 'secondary' // Not Answered (Visited)

    return 'inherit' // Not Visited
  }

  const getStatusVariant = (index) => {
    if (currentIndex === index) return 'contained'
    if (markedForReview.includes(index) || answers[index]) return 'tonal'

    return 'outlined'
  }


  const stats = {
    answered: Object.keys(answers).filter(k => answers[k] !== null).length,
    notAnswered: questions.length - Object.keys(answers).filter(k => answers[k] !== null).length,
    marked: markedForReview.length
  }

  return (
    <Card className='sticky top-20'>
      <CardHeader title='Question Palette' />
      <CardContent className='flex flex-col gap-6'>
        <Box className='grid grid-cols-5 gap-2'>
          {questions.map((_, index) => (
            <Tooltip key={index} title={`Question ${index + 1}`}>
              <Button
                variant={getStatusVariant(index)}
                color={getStatusColor(index)}
                className='min-is-0 is-10 bs-10 p-0 rounded-lg font-bold'
                onClick={() => onJumpToQuestion(index)}
              >
                {index + 1}
              </Button>
            </Tooltip>
          ))}
        </Box>

        <Divider />

        <Box className='flex flex-col gap-3'>
          <Box className='flex items-center gap-2'>
            <Box className='is-4 bs-4 rounded bg-success' />
            <Typography variant='body2'>Answered ({stats.answered})</Typography>
          </Box>
          <Box className='flex items-center gap-2'>
            <Box className='is-4 bs-4 rounded bg-warning' />
            <Typography variant='body2'>Marked for Review ({stats.marked})</Typography>
          </Box>
          <Box className='flex items-center gap-2'>
            <Box className='is-4 bs-4 rounded border' />
            <Typography variant='body2'>Not Visited ({questions.length - Object.keys(answers).length})</Typography>
          </Box>
          <Box className='flex items-center gap-2'>
            <Box className='is-4 bs-4 rounded bg-secondary' />
            <Typography variant='body2'>Not Answered ({Object.keys(answers).filter(k => answers[k] === null).length})</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QuestionPalette
