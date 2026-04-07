

import { useState, useCallback } from "react"
import { rooms } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Upload, X, CheckCircle, UserPlus, FileText } from "lucide-react"
import { cn } from "../lib/utils"

export default function MoveInPage() {
  const [selectedRoom, setSelectedRoom] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [idFile, setIdFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const availableRooms = rooms.filter(r => r.status === 'available')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIdFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSelectedRoom("")
      setName("")
      setPhone("")
      setIdFile(null)
    }, 3000)
  }

  const isValid = selectedRoom && name && phone && idFile

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Registration Complete</h2>
          <p className="text-sm text-muted-foreground">Tenant has been successfully registered</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Move-in Registration</h1>
        <p className="text-muted-foreground mt-1">Register a new tenant to an available room</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-medium">Tenant Information</h2>
                <p className="text-xs text-muted-foreground">Enter the new tenant details</p>
              </div>
            </div>

            {/* Room Selector */}
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm">
                Select Room
              </Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger id="room" className="h-11 rounded-lg">
                  <SelectValue placeholder="Choose an available room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.length === 0 ? (
                    <SelectItem value="none" disabled>No rooms available</SelectItem>
                  ) : (
                    availableRooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        <span className="font-medium">Room {room.number}</span>
                        <span className="text-muted-foreground ml-2">- {room.pricePerMonth.toLocaleString()} THB/mo</span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tenant Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter tenant's full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 081-234-5678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>

            {/* National ID Upload */}
            <div className="space-y-2">
              <Label className="text-sm">
                National ID Document
              </Label>
              {idFile ? (
                <div className="flex items-center justify-between bg-secondary/50 border border-border rounded-lg p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{idFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(idFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIdFile(null)}
                    className="h-8 w-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
                    dragActive
                      ? "border-foreground/40 bg-secondary"
                      : "border-border hover:border-foreground/20 hover:bg-secondary/50"
                  )}
                >
                  <input
                    type="file"
                    id="id-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Drop file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or PDF up to 10MB
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 rounded-lg" 
            disabled={!isValid}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register Tenant
          </Button>
        </form>

        {/* Side Info */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Available Rooms</p>
            <p className="text-3xl font-semibold mt-1 text-emerald-500">{availableRooms.length}</p>
            <p className="text-sm text-muted-foreground">ready for move-in</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <h3 className="font-medium mb-3 text-sm">Required Documents</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>National ID card (both sides)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Valid phone number</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Security deposit (2 months)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
