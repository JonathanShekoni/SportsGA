import React from 'react'
import { useState } from 'react'
import PlayerCard from './PlayerCard'


const PlayerComparison = () => {
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [result, setResult] = useState(null)

    const handleCompare = async () => {
        const res = await fetch(`http://localhost:5000/compare?player1=${player1}&player2=${player2}`)
        const data = await res.json()
        setResult(data)
        console.log(data)

    }


    return (
    <div>
            <h2>PlayerComparison</h2>
            <div className='flex gap-4 justify-center'>
                <div>
                    <input className='border-2'
                        type = "text"
                        placeholder= "Player 1"
                        value = {player1}
                        className = "text-center border-2"
                        onChange= {(e) => setPlayer1(e.target.value)}
                    />

                </div>
                <div>
                    <input className='border-2'
                        type="text" 
                        placeholder="Player 2" 
                        value={player2}
                        className = "text-center border-2"
                        onChange={(e) => setPlayer2(e.target.value)}
                    />
                </div>


            </div>

            
            <button className = 'border-2 hover:bg-blue-700 font-bold w-25'onClick={handleCompare}>Compare</button>
            
            {result && (
                

                
                <div className='flex gap-0.5 justify-center'>
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
                        <p className='h-9.5 flex items-center justify-center'>Points</p>
                        <p className='h-9.5 flex items-center justify-center'>Rebounds</p>
                        <p className='h-9.5 flex items-center justify-center'>Assists</p>
                        <p className='h-9.5 flex items-center justify-center'>Overall:</p>
                        <p className='h-9.5 flex items-center justify-center'>{result.winner.replace(/_/g, ' ')}</p>   
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