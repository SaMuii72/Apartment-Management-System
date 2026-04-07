

import { useState } from "react"
import { invoices as initialInvoices } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { Download, CheckCircle, Zap, Droplets, FileText } from "lucide-react"
import type { Invoice } from "../lib/types"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all')

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter)

  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    totalAmount: invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.totalAmount, 0),
  }

  const handleMarkPaid = (invoiceId: string) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
      )
    )
  }

  const handleDownload = (invoice: Invoice) => {
    const content = `
INVOICE - ${invoice.month}
================================
Room: ${invoice.roomNumber}
Tenant: ${invoice.tenantName}

CHARGES
--------------------------------
Base Rent:          ${invoice.baseRent.toLocaleString().padStart(10)} THB
Electricity:        ${invoice.electricity.cost.toLocaleString().padStart(10)} THB
  (${invoice.electricity.usage} kWh)
Water:              ${invoice.water.cost.toLocaleString().padStart(10)} THB
  (${invoice.water.usage} units)
--------------------------------
TOTAL:              ${invoice.totalAmount.toLocaleString().padStart(10)} THB
================================
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.roomNumber}-${invoice.month.replace(' ', '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filters: { value: 'all' | 'pending' | 'paid'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'paid', label: 'Paid', count: stats.paid },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">View and manage monthly billing invoices</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Pending Amount</p>
          <p className="text-xl font-semibold">{stats.totalAmount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">THB</span></p>
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

      {/* Invoice Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInvoices.map(invoice => (
          <div key={invoice.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div>
                <h3 className="font-semibold">Room {invoice.roomNumber}</h3>
                <p className="text-sm text-muted-foreground">{invoice.tenantName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{invoice.month}</p>
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1",
                  invoice.status === 'paid'
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-amber-500/15 text-amber-500"
                )}>
                  {invoice.status === 'paid' && <CheckCircle className="h-3 w-3" />}
                  {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Base Rent</span>
                <span className="font-medium">{invoice.baseRent.toLocaleString()} THB</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Electricity
                  <span className="text-xs opacity-60">{invoice.electricity.usage} kWh</span>
                </span>
                <span className="font-medium">{invoice.electricity.cost.toLocaleString()} THB</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  Water
                  <span className="text-xs opacity-60">{invoice.water.usage} units</span>
                </span>
                <span className="font-medium">{invoice.water.cost.toLocaleString()} THB</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="text-xl font-semibold">{invoice.totalAmount.toLocaleString()} THB</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 h-9 rounded-lg"
                onClick={() => handleDownload(invoice)}
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download
              </Button>
              {invoice.status === 'pending' && (
                <Button 
                  size="sm"
                  className="flex-1 h-9 rounded-lg"
                  onClick={() => handleMarkPaid(invoice.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Mark Paid
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No invoices found</h3>
          <p className="text-sm text-muted-foreground">No invoices match the selected filter</p>
        </div>
      )}
    </div>
  )
}
