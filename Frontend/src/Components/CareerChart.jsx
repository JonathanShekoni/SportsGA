import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CareerChart = ({ careerData }) => {


  return (
    <div>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={careerData}>
                <XAxis dataKey="SEASON_ID" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="PTS" stroke="#3b82f6" />
                <Line type="monotone" dataKey="REB" stroke="#ef4444" />
                <Line type="monotone" dataKey="AST" stroke="#22c55e" />
            </LineChart>
        </ResponsiveContainer>


    </div>
  )
}

export default CareerChart