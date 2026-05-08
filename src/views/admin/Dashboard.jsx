'use client'

import dynamic from 'next/dynamic'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

import { useAuth } from '@/contexts/AuthContext'
import { reportService, logService, batchService } from '@/api/adminServices'
import CardStatsHorizontal from '@components/card-statistics/Horizontal'
import { useState, useEffect } from 'react'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, faculty: 0, courses: 0, revenue: 0 })
  const [charts, setCharts] = useState({ revenue: [], admissions: [] })
  const [logs, setLogs] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, chartsData, logsData, batchesData] = await Promise.all([
          reportService.getStats(),
          reportService.getCharts(),
          logService.getActivity(),
          batchService.getAll()
        ])

        setStats(statsData)
        setCharts(chartsData)
        setLogs(logsData)
        setBatches(batchesData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Chart Options
  const revenueOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: true },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      padding: { left: 0, right: 0, bottom: 10 }
    },
    colors: ['var(--mui-palette-primary-main)'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: { style: { colors: 'var(--mui-palette-text-disabled)' } }
    },
    yaxis: {
      labels: { style: { colors: 'var(--mui-palette-text-disabled)' } }
    }
  }

  const admissionsOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%'
      }
    },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-success-main)'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: { style: { colors: 'var(--mui-palette-text-disabled)' } }
    },
    yaxis: {
      labels: { style: { colors: 'var(--mui-palette-text-disabled)' } }
    }
  }

  if (loading) return <Typography>Loading Dashboard...</Typography>

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Coaching ERP Dashboard</Typography>
        <Typography variant='body2' color='text.secondary'>Welcome back! Here{"'"}s what{"'"}s happening with your institute today.</Typography>

      </Grid>

      {/* Top Stats Row */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatsHorizontal
          title='Total Students'
          stats={stats.students.toString()}
          avatarIcon='tabler-users'
          avatarColor='primary'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatsHorizontal
          title='Faculty'
          stats={stats.faculty.toString()}
          avatarIcon='tabler-user-star'
          avatarColor='info'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatsHorizontal
          title='Fees Collected'
          stats={`$${stats.revenue}`}
          avatarIcon='tabler-currency-dollar'
          avatarColor='success'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatsHorizontal
          title='Courses'
          stats={stats.courses.toString()}
          avatarIcon='tabler-book'
          avatarColor='warning'
        />
      </Grid>

      {/* Analytics Row */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardHeader title='Revenue Growth' subheader='Monthly earnings overview' />
          <CardContent>
            <AppReactApexCharts
              type='area'
              height={300}
              series={[{ name: 'Revenue', data: charts.revenue }]}
              options={revenueOptions}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className='bs-full'>
          <CardHeader title='New Admissions' subheader='Monthly student enrollment' />
          <CardContent>
            <AppReactApexCharts
              type='bar'
              height={300}
              series={[{ name: 'Admissions', data: charts.admissions }]}
              options={admissionsOptions}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Tables Row */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card>
          <CardHeader 
            title='Recent Activity' 
            action={
              <Chip label='View All' color='primary' size='small' variant='tonal' clickable />
            } 
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.slice(0, 5).map((log, index) => (
                  <TableRow key={`log-${log._id}-${index}`}>
                    <TableCell>
                      <Typography variant='body2' className='font-medium' color='text.primary'>
                        {log.userId?.name || 'System'}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg:4 }}>
        <Card className='bs-full'>
          <CardHeader title='Upcoming Classes' />
          <CardContent className='flex flex-col gap-4'>
            {batches.slice(0, 4).map((batch, index) => (
              <div key={`batch-${batch._id}-${index}`} className='flex items-center gap-4'>
                <Avatar variant='rounded' className='bg-primary/10 text-primary'>
                  <i className='tabler-clock' />
                </Avatar>
                <div className='flex flex-col gap-0.5'>
                  <Typography variant='h6' className='text-base'>{batch.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>{batch.timing}</Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
