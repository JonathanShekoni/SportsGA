import React from 'react'
import { useState,useEffect } from 'react'
import PlayerCard from './PlayerCard'


const PlayerComparison = () => {
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

    return (
    <div>
            <div className='flex gap-4 justify-center my-5'>
                <div>
                    <input 
                        type = "text"
                        placeholder= "Player 1"
                        value = {player1}
                        className = "text-center border-2 border-blue-400 rounded px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        onChange= {(e) => {
                            setPlayer1(e.target.value)
                            handleSuggestions(e.target.value)
                        }}
                    />
                    {suggestions.length > 0 && (
                        <div className='max-h-28 overflow-y-auto'>
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
                <div>
                    <input
                        type="text" 
                        placeholder="Player 2" 
                        value={player2}
                        className = "text-center border-2 border-blue-400 rounded px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        onChange= {(e) => {
                            setPlayer2(e.target.value)
                            handleSuggestions2(e.target.value)
                        }}
                    />

                    {suggestions2.length > 0 && (
                        <div className='max-h-28 overflow-y-auto'>
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


            </div>

            
            <button  className = ' m-2 border-2 hover:bg-blue-700 font-bold w-25 transition duration-300 hover:scale-110 cursor-pointer'onClick={handleCompare}>Compare</button>
            
            {result && (
                

                
                <div className='flex gap-6 justify-center'>
                    <div>
                        <PlayerCard
                        name={result.player1_name}
                        playerId={result.player1_id}
                        points={result.player1_points}
                        rebounds={result.player1_rebounds}
                        assists={result.player1_assists}
                        winnerPoints ={result.points}
                        winnerAssists = {result.assists}
                        winnerRebounds = {result.rebounds}
                        />

                    </div>
                    <div className='mt-39 font-bold'>
                        <p className='h-8.5 flex items-center justify-center'>Points/G</p>
                        <p className='h-8.5 flex items-center justify-center'>Rebounds/G</p>
                        <p className='h-8.5 flex items-center justify-center'>Assists/G</p>
                        <p className='flex items-center justify-center'>Overall:</p>
                        <p className=' flex items-center justify-center text-blue-400 font-bold text-lg'>{result.winner.replace(/_/g, ' ')}</p>   
                    </div>
                    <div>
                        <PlayerCard
                        name={result.player2_name}
                        playerId={result.player2_id}
                        points={result.player2_points}
                        rebounds={result.player2_rebounds}
                        assists={result.player2_assists}
                        winnerPoints ={result.points}
                        winnerAssists = {result.assists}
                        winnerRebounds = {result.rebounds}
                        />

                    </div>     
                   
                </div> 
        )}
    </div>
  )
}

export default PlayerComparison