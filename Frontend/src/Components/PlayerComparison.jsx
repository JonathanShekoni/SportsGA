import React from 'react'
import { useState } from 'react'

const PlayerComparison = () => {
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [result, setResult] = useState(null)

    const handleCompare = async () => {
        const res = await fetch(`http://localhost:5000/compare?player1=${player1}&player2=${player2}`)
        const data = await res.json()
        setResult(data)

    }

    return (
    <div>
            <h2>PlayerComparison</h2>
            <input
                type = "text"
                placeholder= "Player 1"
                value = {player1}
                onChange= {(e) => setPlayer1(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Player 2" 
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
            />
        <button onClick={handleCompare}>Compare</button>
        {result && (
            
            <div>
                <p>Points Winner: {result.points}</p>
                <p>Rebounds Winner: {result.rebounds}</p>
                <p>Assists Winner: {result.assists}</p>
                <p>Overall Winner: {result.winner}</p>
                <p>Name: {result.player1_name}</p>
            </div>
        )}
    </div>
  )
}

export default PlayerComparison