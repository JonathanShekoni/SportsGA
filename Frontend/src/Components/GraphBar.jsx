import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GraphBar = ({ points_1, rebounds_1, assists_1, fg_pct_1, fg3_pct_1, ft_pct_1, points_2, rebounds_2, assists_2, fg_pct_2, fg3_pct_2, ft_pct_2, league_avg_points, league_avg_rebounds, league_avg_assists, league_avg_fg_pct, league_avg_fg3_pct, league_avg_ft_pct}) => {

  const data = [
    { stat: 'Points', player1: (points_1 / 40) * 100, player2: (points_2 / 40) * 100, league_avg: (league_avg_points / 40) * 100 },
    { stat: 'Rebounds', player1: (rebounds_1 / 15) * 100, player2: (rebounds_2 / 15) * 100, league_avg: (league_avg_rebounds / 15) * 100 },
    { stat: 'Assists', player1: (assists_1 / 12) * 100, player2: (assists_2 / 12) * 100, league_avg: (league_avg_assists / 12) * 100 },
    { stat: 'FG%', player1: fg_pct_1, player2: fg_pct_2, league_avg: league_avg_fg_pct },
    { stat: '3P%', player1: fg3_pct_1, player2: fg3_pct_2, league_avg: league_avg_fg3_pct },
    { stat: 'FT%', player1: ft_pct_1, player2: ft_pct_2, league_avg: league_avg_ft_pct },
  ]


  return (
    <div className='w-full h-120 bg-gray-200 rounded-lg flex items-center justify-center mt-10'>
      <ResponsiveContainer  width="100%" height="100%">
        <RadarChart data= {data}>
          <PolarGrid />
          <Tooltip />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis />
          <Radar name="Player 1" dataKey="player1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          <Radar name="Player 2" dataKey="player2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
          <Radar name="League Avg" dataKey="league_avg" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraphBar