import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const PlayerPage = () => {

  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('name')
  const [playerStats,setplayerStats] = useState([])


  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`https://sportsga.onrender.com/player?name=${playerName}`)
      const data = await res.json()
      setplayerStats(data)
    }

    fetchStats()
  },[playerName])

  return (
    <div>
      <p className="text-lg font-bold my-4">{playerName}</p>
      <p>{playerStats.id}</p>
    </div>
  )
}


export default PlayerPage