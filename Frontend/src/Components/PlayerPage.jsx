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
      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerStats.id}.png`} className="w-32 h-32 object-cover mx-5  border-2 border-blue-400" />
      <p>{playerStats.id}</p>
    </div>
  )
}


export default PlayerPage