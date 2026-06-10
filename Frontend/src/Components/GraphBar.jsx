import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GraphBar = ({ player1_name, player2_name, points_1, rebounds_1, assists_1, fg_pct_1, fg3_pct_1, ft_pct_1, points_2, rebounds_2, assists_2, fg_pct_2, fg3_pct_2, ft_pct_2, league_avg_points, league_avg_rebounds, league_avg_assists, league_avg_fg_pct, league_avg_fg3_pct, league_avg_ft_pct}) => {

  const data = [
    { stat: 'Points', player1: (parseFloat(points_1) / 40) * 100, player2: (parseFloat(points_2) / 40) * 100, league_avg: (league_avg_points / 40) * 100, player1_raw: points_1, player2_raw: points_2, league_raw: league_avg_points },
    { stat: 'Rebounds', player1: (parseFloat(rebounds_1) / 15) * 100, player2: (parseFloat(rebounds_2) / 15) * 100, league_avg: (league_avg_rebounds / 15) * 100, player1_raw: rebounds_1, player2_raw: rebounds_2, league_raw: league_avg_rebounds },
    { stat: 'Assists', player1: (parseFloat(assists_1) / 12) * 100, player2: (parseFloat(assists_2) / 12) * 100, league_avg: (league_avg_assists / 12) * 100, player1_raw: assists_1, player2_raw: assists_2, league_raw: league_avg_assists },
    { stat: 'FG%', player1: parseFloat(fg_pct_1), player2: parseFloat(fg_pct_2), league_avg: league_avg_fg_pct * 100, player1_raw: fg_pct_1, player2_raw: fg_pct_2, league_raw: (league_avg_fg_pct * 100).toFixed(1) },
    { stat: '3P%', player1: parseFloat(fg3_pct_1), player2: parseFloat(fg3_pct_2), league_avg: league_avg_fg3_pct * 100, player1_raw: fg3_pct_1, player2_raw: fg3_pct_2, league_raw: (league_avg_fg3_pct * 100).toFixed(1) },
    { stat: 'FT%', player1: parseFloat(ft_pct_1), player2: parseFloat(ft_pct_2), league_avg: league_avg_ft_pct * 100, player1_raw: ft_pct_1, player2_raw: ft_pct_2, league_raw: (league_avg_ft_pct * 100).toFixed(1) },
]
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload
        return (
            <div className='bg-gray-800 p-3 rounded border border-gray-600 text-white text-sm'>
                <p className='font-bold mb-2'>{label}</p>
                <p style={{ color: '#3b82f6' }}>Player 1: {d.player1_raw}</p>
                <p style={{ color: '#ef4444' }}>Player 2: {d.player2_raw}</p>
                <p style={{ color: '#22c55e' }}>League Avg: {d.league_raw}</p>
            </div>
        )
    }
    return null
}


  return (
    <div className='w-full h-120 bg-transparent rounded-lg flex items-center justify-center mt-10'>
      <ResponsiveContainer  width="100%" height="100%">
        <RadarChart data= {data}>
          <PolarGrid />
          <Tooltip content={CustomTooltip} />
          <PolarAngleAxis dataKey="stat" />
          <PolarRadiusAxis tick={false} />
          <Radar name={player1_name.replace(/_/g, ' ')} dataKey="player1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          <Radar name={player2_name.replace(/_/g, ' ')} dataKey="player2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
          <Radar name="League Avg" dataKey="league_avg" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraphBar