"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", leads: 400, verified: 240 },
  { name: "Tue", leads: 300, verified: 139 },
  { name: "Wed", leads: 550, verified: 480 },
  { name: "Thu", leads: 420, verified: 390 },
  { name: "Fri", leads: 700, verified: 610 },
  { name: "Sat", leads: 250, verified: 150 },
  { name: "Sun", leads: 320, verified: 280 },
]

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="leads" 
            stroke="#4f46e5" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
          <Line 
            type="monotone" 
            dataKey="verified" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
