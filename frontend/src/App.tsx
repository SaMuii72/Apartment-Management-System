import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Navigation } from './components/navigation'
import RoomsPage from './pages/RoomsPage'
import MoveInPage from './pages/MoveInPage'
import MeterPage from './pages/MeterPage'
import InvoicesPage from './pages/InvoicesPage'
import PaymentsPage from './pages/PaymentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Navigation />
        <main className="min-h-screen pt-14 md:pt-0 md:pl-56">
          <div className="p-4 md:p-6 lg:p-8 max-w-6xl">
            <Routes>
              <Route path="/" element={<RoomsPage />} />
              <Route path="/move-in" element={<MoveInPage />} />
              <Route path="/meter" element={<MeterPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
            </Routes>
          </div>
        </main>
      </ThemeProvider>
    </BrowserRouter>
  )
}
