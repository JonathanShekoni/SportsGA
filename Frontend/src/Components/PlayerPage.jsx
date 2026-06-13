import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PacmanLoader } from 'react-spinners';
import CareerChart from './CareerChart';

const PlayerPage = () => {

  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('name')
  const [playerStats,setplayerStats] = useState(null)
  const [careerStats,setcareerStats] = useState([])



  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`https://sportsga.onrender.com/player?name=${playerName}`)
      const data = await res.json()

      const res2 = await fetch(`https://sportsga.onrender.com/player/career?name=${playerName}`)
      const data2 = await res2.json()
      

      if (data.error) {
        console.log('Player not found')
        setLoading(false)
        return
    }

      if (data2.error) {
        console.log('Career Stats not found')
        setLoading(false)
        return
    }

      setplayerStats(data)
      setcareerStats(data2)
      setLoading(false)
    }

    fetchStats()
  },[playerName])

  console.log(playerStats)
  console.log(careerStats)



  if (loading) return <div className="fixed inset-0 flex items-center justify-center"><PacmanLoader 
          color="#60A5FA" // Yellow color typical for Pacman
          loading={loading} 
          size={25} 
          aria-label="Pacman Loader"
          data-testid="loader"
        /></div>

  
  return (
      <>
      { playerStats && (
        <div>
        <div className='flex justify-center border'>
        
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
        </div>
        <div className='justify-center border'>
          <p className="text-lg font-bold my-4 justify-between">Career Stats</p>
        </div>
        <div className='flex justify-center mx-auto gap-6'>
          {playerStats.awards.MVP > 0 && (<p>{playerStats.awards.MVP}xMVP</p>)}
          {playerStats.awards.Finals_MVP > 0 && (<p>{playerStats.awards.Finals_MVP}xFinals MVP</p>)}
          {playerStats.awards.All_NBA > 0 && (<p>{playerStats.awards.All_NBA}xALL NBA</p>)}
          {playerStats.awards.All_Star > 0 && (<p>{playerStats.awards.All_Star}xALL STAR</p>)}
          {playerStats.awards.DPOY > 0 && (<p>{playerStats.awards.DPOY}xDPOY</p>)}
          {playerStats.awards.Rookie_of_the_Year > 0 && (<p>{playerStats.awards.Rookie_of_the_Year}xROY</p>)}
          {playerStats.awards.CPOY > 0 && (<p>{playerStats.awards.CPOY}xCPOY</p>)}
          {playerStats.awards.WFMVP > 0 && (<p>{playerStats.awards.WFMVP}xWFMVP</p>)}
          {playerStats.awards.EFMVP > 0 && (<p>{playerStats.awards.EFMVP}xEFMVP</p>)}



        </div>
        
        

        <div className='mt-30'>         
          <CareerChart
          careerData={careerStats}
          ></CareerChart>
        
        
        </div>


        </div>
        
      )}
    </>
  )
}


export default PlayerPage