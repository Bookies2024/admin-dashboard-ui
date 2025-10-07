import React from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { useGetStatsQuery } from '../store/app/app-api-slice'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Stats = () => {
  const { city } = useSelector((state: RootState) => state.auth);
  const { data: stats, isLoading } = useGetStatsQuery({ city });

  const cardStyles = {
    bgcolor: 'whitesmoke',
    width: '100%',
    p: '1.5rem',
    borderRadius: '15px',
    minWidth: '200px'
  }

  const pieChartStyles = {
    "& .MuiChartsLegend-root": {
      display: "grid",
      gridTemplateColumns: "repeat(2, auto)",
      rowGap: 0.5,
      columnGap: 1,
      ml: 2
    },
    "& .MuiChartsLegend-series": {
      mb: '2px',
    },
    "& .MuiChartsLegend-mark": {
      width: 10,
      height: 10,
      borderRadius: '50%',
    },
    "& .MuiChartsLegend-label": {
      fontSize: "0.75rem",
      ml: 0.5
    }
  }

  const StatCard = ({ title, value }) => (
    <Box sx={cardStyles}>
      <Typography>{title}</Typography>
      {isLoading ? (
        <Skeleton variant="text" width={80} height={50} />
      ) : (
        <Typography fontSize={38} color='grey' fontWeight='bold'>
          {value}
        </Typography>
      )}
    </Box>
  )

  const DemographicCard = ({ title, data, showLegend = false }) => (
    <Box sx={cardStyles}>
      <Typography>{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        {isLoading ? (
          <Skeleton variant="circular" width={100} height={100} />
        ) : (
          <PieChart
            width={100}
            height={100}
            sx={showLegend ? pieChartStyles : {}}
            series={[
              {
                highlightScope: { fade: 'global', highlight: 'item' },
                data
              },
            ]}
          />
        )}
      </Box>
    </Box>
  )

  const genderData = stats?.genderRatio
    ? Object.entries(stats.genderRatio).map(([label, value], i) => ({
      id: i,
      value,
      label: label.charAt(0).toUpperCase() + label.slice(1)
    }))
    : []

  const ageData = stats?.ageRatio
    ? Object.entries(stats.ageRatio).map(([label, value], i) => ({
      id: i,
      value,
      label
    }))
    : []

  const statsCards = [
    { title: "Total Members", value: stats?.totalMembers },
    { title: "Total Sessions", value: stats?.totalSessions }
  ]

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 2,
      flexWrap: 'nowrap',
      overflowX: 'auto',
    }}>
      {statsCards.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}

      <DemographicCard
        title="Demographics - Age"
        data={ageData}
        showLegend={true}
      />

      <DemographicCard
        title="Demographics - Gender"
        data={genderData}
      />
    </Box>
  )
}

export default Stats
