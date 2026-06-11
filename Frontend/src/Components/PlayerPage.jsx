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
    <div className='flex border'>
      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerStats.id}.png`} className="w-32 h-32 object-cover   border-2 border-blue-400" />
      <div className='ml-10 mt-7'>
        
        <p>PTS:</p>
        <p>REB:</p>
        <p>AST:</p>
        <p>FG%:</p>
      </div>
      <div className='ml-20 mt-7'>
        <p>3FG%:</p>
        <p>FT%:</p>
        <p>BLK:</p>
        <p>STL:</p>
      </div>
      <div className='ml-10'>
          <p className="text-lg font-bold my-4">{playerName}</p>
          <p> Age: </p>
          <p> Draft Class: </p>
          
      </div>
      <div className='ml-20 mt-7'>
        <p>3FG%:</p>
        <p>FT%:</p>
        <p>BLK:</p>
        <p>STL:</p>
      </div>

            <div className='ml-20 mt-7'>
        <p>3FG%:</p>
        <p>FT%:</p>
        <p>BLK:</p>
        <p>STL:</p>
      </div>
    </div>
  )
}


export default PlayerPage