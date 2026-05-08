'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

const QuestionCard = ({ question, index, selectedAnswer, onAnswerChange }) => {
  if (!question) return null

  return (
    <Card className='bs-full'>
      <CardContent className='flex flex-col gap-6'>
        <Box className='flex items-center justify-between'>
          <Typography variant='h5' color='primary'>
            Question {index + 1}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Marks: {question.marks || 1}
          </Typography>
        </Box>
        
        <Divider />

        <Box className='min-bs-[100px]'>
          <Typography variant='h6' className='mb-4'>
            {question.questionText}
          </Typography>

          {question.imageUrl && (
            <Box className='mb-4 flex justify-center'>
              <img src={question.imageUrl} alt='Question' style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </Box>
          )}
        </Box>

        <FormControl component='fieldset' className='is-full'>
          <RadioGroup 
            value={selectedAnswer || ''} 
            onChange={(e) => onAnswerChange(e.target.value)}
          >
            {question.options.map((option, idx) => (
              <Box 
                key={idx} 
                className={`flex items-center border rounded-lg p-2 mb-3 transition-colors ${
                  selectedAnswer === option ? 'border-primary bg-primaryLight' : 'border-divider hover:bg-actionHover'
                }`}
              >
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={<Typography variant='body1'>{option}</Typography>}
                  className='m-0 is-full'
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default QuestionCard
