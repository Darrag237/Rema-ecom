"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Mock data for the chart
const data = [
  { name: "1 مايو", total: 1200 },
  { name: "5 مايو", total: 2100 },
  { name: "10 مايو", total: 1800 },
  { name: "15 مايو", total: 2800 },
  { name: "20 مايو", total: 2000 },
  { name: "25 مايو", total: 2500 },
  { name: "30 مايو", total: 3200 },
]

export default function SalesChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} ر.س`}
        />
        <Tooltip
          formatter={(value: number) => [`${value} ر.س`, "المبيعات"]}
          labelFormatter={(label) => `التاريخ: ${label}`}
        />
        <Bar dataKey="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
