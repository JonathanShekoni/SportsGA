import React from 'react'
import { useState,useEffect } from 'react'
import PlayerCard from './PlayerCard'
import GraphBar from './GraphBar'
import { PacmanLoader } from 'react-spinners';


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
        color="#60A5FA" // Yellow color typical for Pacman
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
                
                <div className='flex gap-6 justify-around my-15'>
                    <div>
                        <PlayerCard
                        name={result.player1_name}
                        playerId={result.player1_id}
                        points={result.player1_points.toFixed(1)}
                        rebounds={result.player1_rebounds.toFixed(1)}
                        assists={result.player1_assists.toFixed(1)}
                        fg_pct={(result.player1_fg_pct * 100).toFixed(1)}
                        fg3_pct={(result.player1_fg3_pct * 100).toFixed(1)}
                        ft_pct={(result.player1_ft_pct * 100).toFixed(1)}
                        to={result.player1_to.toFixed(1)}
                        stl={result.player1_stl.toFixed(1)}
                        blk={result.player1_blk.toFixed(1)}
                        winnerPoints ={result.points}
                        winnerAssists = {result.assists}
                        winnerRebounds = {result.rebounds}
                        winnerFg_pct = {result.fg_pct}
                        winnerFg3_pct = {result.fg3_pct}
                        winnerft_pct = {result.ft_pct}
                        winnerto = {result.to}
                        winnerstl = {result.stl}
                        winnerblk = {result.blk}
                        winner = {result.winner}
                        />

                    </div>
                    <div className='mt-38 font-bold'>
                        <p className='h-9 flex items-center justify-center'>Points/G</p>
                        <p className='h-9 flex items-center justify-center'>Rebounds/G</p>
                        <p className='h-9 flex items-center justify-center'>Assists/G</p>
                        <p className='h-9 flex items-center justify-center'>FG%</p>
                        <p className='h-9 flex items-center justify-center'>3FG%</p>
                        <p className='h-9 flex items-center justify-center'>FT%</p>
                        <p className='h-9 flex items-center justify-center'>TO</p>
                        <p className='h-9 flex items-center justify-center'>STL</p>
                        <p className='h-9 flex items-center justify-center'>BLK</p>

                        {/*
                        <p className=' flex items-center justify-center text-blue-400 font-bold text-lg'>{result.winner.replace(/_/g, ' ')}</p>  
*/}
                    </div>
                    <div>
                        <PlayerCard
                        name={result.player2_name}
                        playerId={result.player2_id}
                        points={result.player2_points.toFixed(1)}
                        rebounds={result.player2_rebounds.toFixed(1)}
                        assists={result.player2_assists.toFixed(1)}
                        fg_pct={(result.player2_fg_pct * 100).toFixed(1)}
                        fg3_pct={(result.player2_fg3_pct * 100).toFixed(1)}
                        ft_pct={(result.player2_ft_pct * 100).toFixed(1)}
                        to={result.player2_to.toFixed(1)}
                        stl={result.player2_stl.toFixed(1)}
                        blk={result.player2_blk.toFixed(1)}
                        winnerPoints ={result.points}
                        winnerAssists = {result.assists}
                        winnerRebounds = {result.rebounds}
                        winnerFg_pct = {result.fg_pct}
                        winnerFg3_pct = {result.fg3_pct}
                        winnerft_pct = {result.ft_pct}
                        winnerto = {result.to}
                        winnerstl = {result.stl}
                        winnerblk = {result.blk}
                        winner = {result.winner}
                        />

                    </div>    
                    {/*Add season averages at the bottom of the screen. Compare player1,player2 and the season average in one or multiple radar charts */} 
                   
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