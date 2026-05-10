'use client'

import dynamic from 'next/dynamic'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { useAuth } from '@/contexts/AuthContext'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const Reports = () => {
  const { reportsData } = useAuth()

  const revenueOptions = {
    chart: { toolbar: { show: false } },
    colors: ['var(--mui-palette-primary-main)'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
  }

  const performanceOptions = {
    chart: { type: 'radar', toolbar: { show: false } },
    series: [{ name: 'Class Avg', data: [80, 50, 30, 40, 100, 20] }],
    labels: ['Attendance', 'Grades', 'Submission', 'Engagement', 'Behavior', 'Tests']
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Revenue Report' />
          <CardContent>
            <AppReactApexCharts type='line' height={350} series={[{ name: 'Revenue', data: reportsData?.revenue || [] }]} options={revenueOptions} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Admission Report' />
          <CardContent>
            <AppReactApexCharts type='bar' height={350} series={[{ name: 'Admissions', data: reportsData?.admissions || [] }]} options={revenueOptions} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Overall Performance' />
          <CardContent className='flex justify-center'>
            <AppReactApexCharts type='radar' height={400} series={performanceOptions.series} options={performanceOptions} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Reports
