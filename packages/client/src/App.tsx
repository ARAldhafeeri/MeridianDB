import './App.css'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {
  const location = useLocation()

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <h1 className="brand-title">
                Hono + React Stack
              </h1>
              <span className="edge-badge">
                Edge
              </span>
            </div>
            
            <div className="nav-links">
              <NavLink to="/" active={location.pathname === '/'}>
                Home
              </NavLink>
              <NavLink to="/users" active={location.pathname === '/users'}>
                Users
              </NavLink>
              <NavLink to="/location" active={location.pathname === '/location'}>
                Location
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}
    >
      {children}
    </Link>
  )
}

export default App