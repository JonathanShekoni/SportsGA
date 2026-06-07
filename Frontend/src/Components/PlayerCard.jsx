import React from 'react'

const PlayerCard = ({name, points,rebounds,assists,fg, playerId, winnerPoints, winnerAssists, winnerRebounds}) => {


  return (
    <div>
      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`} className="w-32 h-32 object-cover mx-auto" />
      <p className='text-center text-white font-semibold text-lg mt-2 mb-3'>{name.replace(/_/g, ' ')}</p>
      
      <div>
        <p className={`${winnerPoints === name ? 'text-green-400' : winnerPoints === 'tie' ? 'text-yellow-400' : 'text-red-400'} border-2 py-1 px-3 rounded h-10 flex items-center justify-center w-40`}>{points}</p>
        <p className={`${winnerRebounds === name ? 'text-green-400' : winnerRebounds === 'tie' ? 'text-yellow-400' : 'text-red-400'} border-2 py-1 px-3 rounded h-10 flex items-center justify-center`}>{rebounds}</p>
        <p className={`${winnerAssists === name ? 'text-green-400' : winnerAssists === 'tie' ? 'text-yellow-400' : 'text-red-400'} border-2 py-1 px-3 rounded h-10 flex items-center justify-center`}>{assists}</p>
      </div>
    </div>

  )
}

export default PlayerCard