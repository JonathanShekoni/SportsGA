import React from 'react'
import { useState,useEffect } from 'react'
import PlayerCard from './PlayerCard'


const PlayerComparison = () => {
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [result, setResult] = useState(null)
    const [playerList, setPlayerList] = useState([])
    
    useEffect(() => {
        const fetchplayers = async () => {
            const res = await fetch(`http://localhost:5000/players`)
            const data = await res.json()
            setPlayerList(data)
        }

        fetchplayers()
    }, [])



    const handleCompare = async () => {
        const res = await fetch(`http://localhost:5000/compare?player1=${player1}&player2=${player2}`)
        const data = await res.json()

        if(data.error) {
            alert(data.error)
            return
        }

        setResult(data)
        console.log(data)

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
                        onChange= {(e) => setPlayer1(e.target.value)}
                    />

                </div>
                <div>
                    <input
                        type="text" 
                        placeholder="Player 2" 
                        value={player2}
                        className = "text-center border-2 border-blue-400 rounded px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setPlayer2(e.target.value)}
                    />
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
                        <p className='h-9.5 flex items-center justify-center'>Points/G</p>
                        <p className='h-9.5 flex items-center justify-center'>Rebounds/G</p>
                        <p className='h-9.5 flex items-center justify-center'>Assists/G</p>
                        <p className='h-9.5 flex items-center justify-center'>Overall:</p>
                        <p className='h-9.5 flex items-center justify-center text-blue-400 font-bold text-lg'>{result.winner.replace(/_/g, ' ')}</p>   
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