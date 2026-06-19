import React from 'react'
import { useState,useEffect } from 'react'
import { PlayerHeader, StatBox } from './PlayerCard'
import GraphBar from './GraphBar'
import { PacmanLoader } from 'react-spinners';

// Drives the grid below: one row per stat, shared by both player columns and the label column.
const STAT_ROWS = [
    { label: 'Points/G', dataKey: 'points', winnerKey: 'points', format: (v) => v.toFixed(1) },
    { label: 'Rebounds/G', dataKey: 'rebounds', winnerKey: 'rebounds', format: (v) => v.toFixed(1) },
    { label: 'Assists/G', dataKey: 'assists', winnerKey: 'assists', format: (v) => v.toFixed(1) },
    { label: 'FG%', dataKey: 'fg_pct', winnerKey: 'fg_pct', format: (v) => (v * 100).toFixed(1) },
    { label: '3FG%', dataKey: 'fg3_pct', winnerKey: 'fg3_pct', format: (v) => (v * 100).toFixed(1) },
    { label: 'FT%', dataKey: 'ft_pct', winnerKey: 'ft_pct', format: (v) => (v * 100).toFixed(1) },
    { label: 'TO', dataKey: 'to', winnerKey: 'to', format: (v) => v.toFixed(1) },
    { label: 'STL', dataKey: 'stl', winnerKey: 'stl', format: (v) => v.toFixed(1) },
    { label: 'BLK', dataKey: 'blk', winnerKey: 'blk', format: (v) => v.toFixed(1) },
]

const PlayerComparison = () => {
    const [loading, setLoading] = useState(true)
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [result, setResult] = useState(null)
    const [playerList, setPlayerList] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [suggestions2, setSuggestions2] = useState([])
    
    useEffect(() => {
        const fetchplayers = async () => {
            const res = await fetch(`https://sportsga.onrender.com/players`)
            const data = await res.json()
            setPlayerList(data)
            setLoading(false)
        }

        fetchplayers()
        
    }, [])



    const handleCompare = async () => {
        const res = await fetch(`https://sportsga.onrender.com/compare?player1=${player1}&player2=${player2}`)
        const data = await res.json()

        if(data.error) {
            alert(data.error)
            return
        }

        setResult(data)
        console.log(data)

    }

    const handleSuggestions = (typed) => {
        const updatedList = []
        const length_of_name = typed.length
        
        if (typed === ''){
            setSuggestions([])
            return
        }
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].toLowerCase().includes(typed.toLowerCase())) {
                updatedList.push(playerList[i])
            }

        }
        setSuggestions(updatedList)
    }

    const handleSuggestions2 = (typed) => {
        const updatedList = []
        const length_of_name = typed.length
        
        if (typed === ''){
            setSuggestions2([])
            return
        }
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].toLowerCase().includes(typed.toLowerCase())) {
                updatedList.push(playerList[i])
            }

        }
        setSuggestions2(updatedList)
    }


    if (loading) return <div className="fixed inset-0 flex items-center justify-center"><PacmanLoader 
        color="#60A5FA" 
        loading={loading} 
        size={25} 
        aria-label="Pacman Loader"
        data-testid="loader"
      /></div>

    return (
    <div>
            <div className='flex gap-4 justify-center my-5'>
                <div className='relative'>
                    <input 
                        type = "text"
                        placeholder= "Player 1"
                        value = {player1}
                        className = "text-center border-2 border-blue-400 rounded-2xl px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        onChange= {(e) => {
                            setPlayer1(e.target.value)
                            handleSuggestions(e.target.value)
                            
                        }}
                    />
                    {suggestions.length > 0 && (
                        <div className='absolute w-full max-h-28 overflow-y-auto z-10'>
                            {suggestions.map((player) => (
                            <p 
                                onClick={() =>{
                                    setPlayer1(player)
                                    setSuggestions([])
                                }} 
                                key ={player}
                                className='block w-full text-left hover:bg-blue-600 px-4 py-2 cursor-pointer'
                                >{player}
                            </p>
                        ))}
                        </div>
                    )}

                </div>
                <div className='relative'>
                    <input
                        type="text" 
                        placeholder="Player 2" 
                        value={player2}
                        className = "text-center border-2 border-blue-400 rounded-2xl px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        onChange= {(e) => {
                            setPlayer2(e.target.value)
                            handleSuggestions2(e.target.value)
                        }}
                    />

                    {suggestions2.length > 0 && (
                        <div className='absolute w-full max-h-28 overflow-y-auto z-10'>
                            {suggestions2.map((player) => (
                            <p 
                                onClick={() =>{
                                    setPlayer2(player)
                                    setSuggestions2([])
                                }} 
                                key ={player}
                                className='block w-full text-left hover:bg-blue-600 px-4 py-2 cursor-pointer'
                                >{player}
                            </p>
                        ))}
                        </div>
                    )}
                </div>

                    <button  className = ' m-2 border-2 rounded-2xl hover:bg-blue-700 font-bold w-25 transition duration-300 hover:scale-110 cursor-pointer'onClick={handleCompare}>Compare</button>

            </div>

            
            
            
            {result && (

                <div>

                {/*
                  CSS Grid instead of three independently-stacked columns: every stat row is a single
                  grid row shared by both PlayerHeaders' stat cells AND the label cell, so the browser
                  aligns them by construction. Row/column placement is dynamic (computed per map index),
                  so it's done via inline style rather than Tailwind classes -- Tailwind can't generate
                  CSS for class names that only exist as runtime string interpolations.
                */}
                <div
                    className='grid grid-cols-[minmax(0,320px)_auto_minmax(0,320px)] justify-center items-center gap-x-6 gap-y-2.5 my-8'
                >
                    <div style={{ gridColumn: 1, gridRow: 1 }} className='flex justify-center'>
                        <PlayerHeader name={result.player1_name} playerId={result.player1_id} winner={result.winner} />
                    </div>
                    <div style={{ gridColumn: 3, gridRow: 1 }} className='flex justify-center'>
                        <PlayerHeader name={result.player2_name} playerId={result.player2_id} winner={result.winner} />
                    </div>

                    {STAT_ROWS.map((row, i) => (
                        <React.Fragment key={row.dataKey}>
                            <div style={{ gridColumn: 1, gridRow: i + 2 }} className='flex justify-center'>
                                <StatBox
                                    value={row.format(result[`player1_${row.dataKey}`])}
                                    name={result.player1_name}
                                    winnerName={result[row.winnerKey]}
                                />
                            </div>
                            <div style={{ gridColumn: 2, gridRow: i + 2 }} className='flex justify-center'>
                                <p className='text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest'>{row.label}</p>
                            </div>
                            <div style={{ gridColumn: 3, gridRow: i + 2 }} className='flex justify-center'>
                                <StatBox
                                    value={row.format(result[`player2_${row.dataKey}`])}
                                    name={result.player2_name}
                                    winnerName={result[row.winnerKey]}
                                />
                            </div>
                        </React.Fragment>
                    ))}
                    {/*Add season averages at the bottom of the screen. Compare player1,player2 and the season average in one or multiple radar charts */}
                </div>

                <div className='text-center my-8'>
                    <p className='font-bebas text-xl text-gray-400 tracking-widest uppercase'>Winner</p>
                    <p className={`font-bebas text-5xl sm:text-6xl tracking-wide mt-1 ${result.winner === 'Tie' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {result.winner === 'Tie' ? "It's a Tie" : `${result.winner.replace(/_/g, ' ')} Wins`}
                    </p>
                </div>

                <GraphBar
                player1_name={result.player1_name}
                player2_name={result.player2_name}
                points_1={result.player1_points}
                rebounds_1={result.player1_rebounds}
                assists_1={result.player1_assists}
                fg_pct_1={(result.player1_fg_pct * 100)}
                fg3_pct_1={(result.player1_fg3_pct * 100)}
                ft_pct_1={(result.player1_ft_pct * 100)}
                points_2={result.player2_points}
                rebounds_2={result.player2_rebounds}
                assists_2={result.player2_assists}
                fg_pct_2={(result.player2_fg_pct * 100)}
                fg3_pct_2={(result.player2_fg3_pct * 100)}
                ft_pct_2={(result.player2_ft_pct * 100)}
                league_avg_points={result.league_avg_points}
                league_avg_rebounds={result.league_avg_rebounds}
                league_avg_assists={result.league_avg_assists}
                league_avg_fg_pct={(result.league_avg_fg_pct)}
                league_avg_fg3_pct={(result.league_avg_fg3_pct)}
                league_avg_ft_pct={(result.league_avg_ft_pct)}
                />
            </div>
        )}
    </div>
  )
}

export default PlayerComparison