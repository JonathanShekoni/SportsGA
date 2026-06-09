import React from 'react'

const PlayerCard = ({name, points,rebounds,assists,fg,fg_pct,fg3_pct,ft_pct,stl,blk, playerId,to, winnerPoints, winnerAssists, winnerRebounds, winnerFg_pct,winnerFg3_pct,winnerft_pct,winnerto, winnerstl, winnerblk, winner}) => {


  return (
    <div>
      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`} className="w-32 h-32 object-cover mx-5  border-2 border-blue-400" />
      <p className={`text-center font-semibold text-base mt-2 mb-3 ${winner === name ? 'text-green-400' : winner === 'tie' ? 'text-yellow-400' : 'text-red-400'}`}>
        {name.replace(/_/g, ' ')}
      </p>
      
      <div className='space-y-2'>
        <p className={`${winnerPoints === name ? 'text-green-400' : winnerPoints === 'tie' ? 'text-yellow-400' : 'text-red-400'}  w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center `}>{points}</p>
        <p className={`${winnerRebounds === name ? 'text-green-400' : winnerRebounds === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{rebounds}</p>
        <p className={`${winnerAssists === name ? 'text-green-400' : winnerAssists === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{assists}</p>
        <p className={`${winnerFg_pct === name ? 'text-green-400' : winnerFg_pct === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{fg_pct}</p>
        <p className={`${winnerFg3_pct === name ? 'text-green-400' : winnerFg3_pct === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{fg3_pct} </p>
        <p className={`${winnerft_pct === name ? 'text-green-400' : winnerft_pct === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{ft_pct} </p>
        <p className={`${winnerto === name ? 'text-green-400' : winnerto === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{to} </p>
        <p className={`${winnerstl === name ? 'text-green-400' : winnerstl === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{stl} </p>
        <p className={`${winnerblk === name ? 'text-green-400' : winnerblk === 'tie' ? 'text-yellow-400' : 'text-red-400'} w-40 mx-auto border-2 py-1 px-3 rounded flex items-center justify-center`}>{blk} </p>
      </div>
    </div>

  )
}

export default PlayerCard