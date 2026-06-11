import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const PlayerPage = () => {

  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('name')
  const [playerStats,setplayerStats] = useState(null)


  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`https://sportsga.onrender.com/player?name=${playerName}`)
      const data = await res.json()
      setplayerStats(data)
    }

    fetchStats()
  },[playerName])

  console.log(playerStats)
  return (
    <div className='flex justify-center border'>
      { playerStats && (
        <>
        <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerStats.id}.png`} className="w-32 h-32 object-cover   border-2 border-blue-400" />
        
        
        <div className='mx-auto mt-7'>
          
          <p>PTS: {playerStats.points.toFixed(1)}</p>
          <p>REB: {playerStats.rebounds.toFixed(1)}</p>
          <p>AST: {playerStats.assists.toFixed(1)}</p>
          <p>FG%: {(playerStats.fg_pct * 100).toFixed(1)}</p>
        </div>
        <div className='mx-auto mt-7'>
          <p>3FG%: {(playerStats.fg3_pct * 100).toFixed(1)}</p>
          <p>FT%: {(playerStats.ft_pct * 100).toFixed(1)}</p>
          <p>BLK: {playerStats.blk.toFixed(1)}</p>
          <p>STL: {playerStats.stl.toFixed(1)}</p>
        </div>
        <div className='mx-auto '>
            <p className="text-lg font-bold my-4 justify-between">{playerName}</p>
        </div>
        <div className='mx-auto mt-7'>
          <p>Draft Year: {playerStats.draft_year}</p>
          <p>Height: {playerStats.height}</p>
          <p>Team: {playerStats.team}</p>
          <p>School: {playerStats.school}</p>
        </div>

        <div className='mx-auto mt-7'>
          <p>DOB: {playerStats.birth_date}</p>
          <p>WEIGHT: {playerStats.weight}</p>
          <p>POSITION: {playerStats.position}</p>
          <p>COUNTRY: {playerStats.country}</p>
        </div>
        </>
      )}
    </div>
  )
}


export default PlayerPage