import React from 'react'

export const PlayerHeader = ({ name, playerId, winner }) => (
  <div className="flex flex-col items-center mb-3">
    <img
      src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`}
      className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-2xl border-4 border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.2)]"
    />
    <p className={`font-bebas text-3xl sm:text-4xl tracking-wide text-center leading-tight mt-4 ${winner === name ? 'text-green-400' : winner === 'tie' ? 'text-yellow-400' : 'text-red-400'}`}>
      {name.replace(/_/g, ' ')}
    </p>
  </div>
)

export const StatBox = ({ value, name, winnerName }) => (
  <p className={`${winnerName === name ? 'text-green-400 border-green-400/50' : winnerName === 'tie' ? 'text-yellow-400 border-yellow-400/50' : 'text-red-400 border-red-400/50'} h-12 w-full max-w-50 border-2 rounded-xl flex items-center justify-center text-lg font-semibold`}>
    {value}
  </p>
)
