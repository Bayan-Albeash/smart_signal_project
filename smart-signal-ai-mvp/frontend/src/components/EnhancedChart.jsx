import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const EnhancedChart = ({ type, data, title, height = 300 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'efficiency' || entry.dataKey === 'load' ? '%' : 
               entry.dataKey === 'latency' ? 'ms' : 
               entry.dataKey === 'throughput' ? 'Mbps' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'line') {
    return (
      <div className="w-full" style={{ height: `${height}px` }}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white text-center">
          {title}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              interval={2}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 'dataMax + 20']}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#1F2937' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#10B981" 
              strokeWidth={3} 
              name="كفاءة الشبكة (%)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#EF4444" 
              strokeWidth={3} 
              name="زمن الاستجابة (ms)"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="throughput" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              name="الإنتاجية (Mbps)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="w-full" style={{ height: `${height}px` }}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white text-center">
          {title}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 100]}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#1F2937' }}
              iconType="rect"
            />
            <Bar 
              dataKey="load" 
              fill="#F59E0B" 
              name="شدة الحمل (%)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="towers" 
              fill="#3B82F6" 
              name="عدد الأبراج" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}

export default EnhancedChart
