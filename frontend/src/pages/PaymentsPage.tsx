

import { useState, useCallback } from "react"
import { payments as initialPayments } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { Upload, Check, X, Image as ImageIcon, Clock, CheckCircle, XCircle } from "lucide-react"
import type { PaymentStatus } from "../lib/types"

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all')
  const [dragActive, setDragActive] = useState<string | null>(null)

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter)

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    paid: payments.filter(p => p.status === 'paid').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  }

  const handleDrag = useCallback((e: React.DragEvent, paymentId: string | null) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(paymentId)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, paymentId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const url = URL.createObjectURL(file)
      setPayments(prev => 
        prev.map(p => p.id === paymentId ? { ...p, slipUrl: url } : p)
      )
    }
  }, [])

  const handleFileUpload = (paymentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setPayments(prev => 
        prev.map(p => p.id === paymentId ? { ...p, slipUrl: url } : p)
      )
    }
  }

  const handleStatusChange = (paymentId: string, status: PaymentStatus) => {
    setPayments(prev => 
      prev.map(p => p.id === paymentId ? { ...p, status } : p)
    )
  }

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30" },
    paid: { label: "Approved", icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30" },
    rejected: { label: "Rejected", icon: XCircle, bg: "bg-red-500/15", text: "text-red-500", border: "border-red-500/30" },
  }

  const filters: { value: PaymentStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'paid', label: 'Approved', count: stats.paid },
    { value: 'rejected', label: 'Rejected', count: stats.rejected },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Verification</h1>
        <p className="text-muted-foreground mt-1">Review and verify tenant payment slips</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
          <p className="text-2xl font-semibold mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-amber-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-semibold mt-1">{stats.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-emerald-500 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-semibold mt-1">{stats.paid}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-red-500 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-semibold mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              filter === f.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Payment Cards Grid - Vertical Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPayments.map(payment => {
          const config = statusConfig[payment.status]
          const StatusIcon = config.icon
          
          return (
            <div 
              key={payment.id} 
              className="bg-card border border-border rounded-xl overflow-hidden flex flex-col"
            >
              {/* Slip Upload Area */}
              <div className="relative">
                {payment.slipUrl ? (
                  <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Slip uploaded</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={(e) => handleDrag(e, payment.id)}
                    onDragLeave={(e) => handleDrag(e, null)}
                    onDragOver={(e) => handleDrag(e, payment.id)}
                    onDrop={(e) => handleDrop(e, payment.id)}
                    className={cn(
                      "aspect-[4/3] border-2 border-dashed flex flex-col items-center justify-center transition-all",
                      dragActive === payment.id
                        ? "border-foreground/40 bg-secondary"
                        : "border-border bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <input
                      type="file"
                      id={`slip-${payment.id}`}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(payment.id, e)}
                      className="hidden"
                    />
                    <label htmlFor={`slip-${payment.id}`} className="cursor-pointer text-center p-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Upload payment slip</p>
                      <p className="text-xs text-muted-foreground mt-1">Drag & drop or click</p>
                    </label>
                  </div>
                )}
                
                {/* Status Badge - Positioned on image */}
                <div className={cn(
                  "absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                  config.bg, config.text, config.border
                )}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Room & Tenant */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Room {payment.roomNumber}</h3>
                  <p className="text-sm text-muted-foreground">{payment.tenantName}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">{payment.amount.toLocaleString()} THB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span>{payment.submittedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                {payment.status === 'pending' && (
                  <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                    <Button
                      size="sm"
                      className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                      onClick={() => handleStatusChange(payment.id, 'paid')}
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-9 text-red-500 border-red-500/30 hover:bg-red-500/10 rounded-lg"
                      onClick={() => handleStatusChange(payment.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No payments found</h3>
          <p className="text-sm text-muted-foreground">No payments match the selected filter</p>
        </div>
      )}
    </div>
  )
}
