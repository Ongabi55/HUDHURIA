import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black mb-4" style={{ color: 'var(--text-subtle)' }}>404</div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Page not found</h1>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/discover"  element={<Discover />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
