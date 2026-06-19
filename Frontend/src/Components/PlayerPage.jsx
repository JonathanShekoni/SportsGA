import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PacmanLoader } from 'react-spinners';
import CareerChart from './CareerChart';

const StatTile = ({ label, value }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl py-4 px-3 text-center">
    <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">{label}</p>
    <p className="text-white text-2xl font-bold mt-1">{value}</p>
  </div>
)

const BioField = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">{label}</p>
    <p className="text-white font-medium mt-1">{value}</p>
  </div>
)

const AWARD_BADGES = [
  { key: 'MVP', label: 'MVP', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  { key: 'Finals_MVP', label: 'Finals MVP', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { key: 'All_NBA', label: 'All-NBA', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { key: 'All_Star', label: 'All-Star', color: 'bg-sky-500/20 text-sky-400 border-sky-500/40' },
  { key: 'DPOY', label: 'DPOY', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  { key: 'Rookie_of_the_Year', label: 'ROY', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
  { key: 'CPOY', label: 'CPOY', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  { key: 'WFMVP', label: 'WCF MVP', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  { key: 'EFMVP', label: 'ECF MVP', color: 'bg-pink-500/20 text-pink-400 border-pink-500/40' },
]

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
          color="#60A5FA" 
          loading={loading} 
          size={25} 
          aria-label="Pacman Loader"
          data-testid="loader"
        />
        </div>

  
  const totalAwards = playerStats
    ? Object.values(playerStats.awards).reduce((sum, count) => sum + count, 0)
    : 0

  return (
      <>
      { playerStats && (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

          {/* Hero */}
          <div className="flex flex-col items-center text-center">
            <img
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerStats.id}.png`}
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl border-4 border-blue-400 shadow-[0_0_50px_rgba(96,165,250,0.25)]"
            />
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wide text-white mt-6">
              {playerName}
            </h1>
            <p className="text-blue-400 text-lg font-medium mt-1">
              {playerStats.position} &bull; {playerStats.team}
            </p>
          </div>

          {/* Per game stats */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="font-bebas text-2xl text-blue-400 tracking-wide mb-4">Per Game Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatTile label="PTS" value={playerStats.points.toFixed(1)} />
              <StatTile label="REB" value={playerStats.rebounds.toFixed(1)} />
              <StatTile label="AST" value={playerStats.assists.toFixed(1)} />
              <StatTile label="FG%" value={(playerStats.fg_pct * 100).toFixed(1)} />
              <StatTile label="3FG%" value={(playerStats.fg3_pct * 100).toFixed(1)} />
              <StatTile label="FT%" value={(playerStats.ft_pct * 100).toFixed(1)} />
              <StatTile label="STL" value={playerStats.stl.toFixed(1)} />
              <StatTile label="BLK" value={playerStats.blk.toFixed(1)} />
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="font-bebas text-2xl text-blue-400 tracking-wide mb-4">Bio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <BioField label="Draft Year" value={playerStats.draft_year} />
              <BioField label="Height" value={playerStats.height} />
              <BioField label="Weight" value={playerStats.weight} />
              <BioField label="Position" value={playerStats.position} />
              <BioField label="Team" value={playerStats.team} />
              <BioField label="School" value={playerStats.school} />
              <BioField label="Country" value={playerStats.country} />
              <BioField label="DOB" value={playerStats.birth_date} />
            </div>
          </div>

          {/* Awards */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="font-bebas text-2xl text-blue-400 tracking-wide mb-4">Awards</h2>
            {totalAwards > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {AWARD_BADGES.map(({ key, label, color }) => (
                  playerStats.awards[key] > 0 && (
                    <span
                      key={key}
                      className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${color}`}
                    >
                      {playerStats.awards[key] > 1 ? `${playerStats.awards[key]}x ` : ''}{label}
                    </span>
                  )
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No major awards yet.</p>
            )}
          </div>

          {/* Career stats */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="font-bebas text-2xl text-blue-400 tracking-wide mb-4">Career Stats</h2>
            <CareerChart careerData={careerStats} />
          </div>

        </div>

      )}
    </>
  )
}


export default PlayerPage