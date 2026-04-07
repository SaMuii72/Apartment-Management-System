

import { useState } from "react"
import { rooms, meterReadings } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { CheckCircle, Zap, Droplets } from "lucide-react"

const ELECTRICITY_RATE = 4.5
const WATER_RATE = 18

interface MeterData {
  electricity: { previous: number; current: string }
  water: { previous: number; current: string }
}

export default function MeterEntryPage() {
  const occupiedRooms = rooms.filter(r => r.status === 'occupied')
  const [submitted, setSubmitted] = useState(false)
  
  const [meterData, setMeterData] = useState<Record<string, MeterData>>(() => {
    const initial: Record<string, MeterData> = {}
    occupiedRooms.forEach(room => {
      const reading = meterReadings.find(r => r.roomId === room.id)
      initial[room.id] = {
        electricity: { previous: reading?.electricity.previous ?? 0, current: "" },
        water: { previous: reading?.water.previous ?? 0, current: "" },
      }
    })
    return initial
  })

  const updateMeter = (roomId: string, type: 'electricity' | 'water', value: string) => {
    setMeterData(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [type]: { ...prev[roomId][type], current: value },
      },
    }))
  }

  const calculateUsage = (previous: number, current: string) => {
    const curr = parseFloat(current)
    if (isNaN(curr) || curr < previous) return { usage: 0, valid: false }
    return { usage: curr - previous, valid: true }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Readings Saved</h2>
          <p className="text-sm text-muted-foreground">All meter readings have been recorded</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meter Entry</h1>
          <p className="text-muted-foreground mt-1">Record monthly electricity and water readings</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">{ELECTRICITY_RATE} THB/kWh</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">{WATER_RATE} THB/unit</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {occupiedRooms.map(room => {
          const data = meterData[room.id]
          if (!data) return null
          
          const elecCalc = calculateUsage(data.electricity.previous, data.electricity.current)
          const waterCalc = calculateUsage(data.water.previous, data.water.current)
          const totalCost = (elecCalc.valid ? elecCalc.usage * ELECTRICITY_RATE : 0) + (waterCalc.valid ? waterCalc.usage * WATER_RATE : 0)

          return (
            <div key={room.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Room Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                <div>
                  <h3 className="font-semibold">Room {room.number}</h3>
                  <p className="text-sm text-muted-foreground">{room.tenant?.name}</p>
                </div>
                {(elecCalc.valid || waterCalc.valid) && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Estimated</p>
                    <p className="font-semibold">{totalCost.toFixed(0)} THB</p>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Electricity */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <span className="font-medium text-sm">Electricity</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Previous</Label>
                        <div className="h-10 px-3 bg-secondary/50 border border-border rounded-lg flex items-center text-sm">
                          {data.electricity.previous} <span className="text-muted-foreground ml-1">kWh</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Current</Label>
                        <Input
                          type="number"
                          placeholder="kWh"
                          value={data.electricity.current}
                          onChange={e => updateMeter(room.id, 'electricity', e.target.value)}
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>
                    {data.electricity.current && elecCalc.valid && (
                      <div className="flex items-center justify-between bg-amber-500/10 rounded-lg px-3 py-2 text-sm">
                        <span className="text-amber-600 dark:text-amber-400">Usage: {elecCalc.usage} kWh</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">{(elecCalc.usage * ELECTRICITY_RATE).toFixed(0)} THB</span>
                      </div>
                    )}
                  </div>

                  {/* Water */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span className="font-medium text-sm">Water</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Previous</Label>
                        <div className="h-10 px-3 bg-secondary/50 border border-border rounded-lg flex items-center text-sm">
                          {data.water.previous} <span className="text-muted-foreground ml-1">units</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Current</Label>
                        <Input
                          type="number"
                          placeholder="units"
                          value={data.water.current}
                          onChange={e => updateMeter(room.id, 'water', e.target.value)}
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>
                    {data.water.current && waterCalc.valid && (
                      <div className="flex items-center justify-between bg-blue-500/10 rounded-lg px-3 py-2 text-sm">
                        <span className="text-blue-600 dark:text-blue-400">Usage: {waterCalc.usage} units</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{(waterCalc.usage * WATER_RATE).toFixed(0)} THB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-10 px-6 rounded-lg">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save All Readings
          </Button>
        </div>
      </form>
    </div>
  )
}
