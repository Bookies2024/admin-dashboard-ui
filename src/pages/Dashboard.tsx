import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/mail')
  }, [navigate]);

  return <div>Dashboard</div>
}

export default Dashboard