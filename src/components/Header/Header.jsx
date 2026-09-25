import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import { Menu, X } from "lucide-react"
import "./header.css"

const getDonor = () => {
  try {
    return JSON.parse(localStorage.getItem("donor"))
  } catch {
    return null
  }
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [donor, setDonor] = useState(getDonor())
  const navigate = useNavigate()
  const location = useLocation()

  // Re-check login state on every route change
  useEffect(() => {
    setDonor(getDonor())
  }, [location.pathname])

  const close = () => setIsMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem("donor")
    setDonor(null)
    close()
    navigate("/login")
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <Link to="/landing" onClick={close}>
              <img src="/hh_logo.png" alt="Hamdard Haath" />
            </Link>
          </div>

          {/* Menu */}
          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <HashLink smooth to="/landing#who-we-are" className="nav-link" onClick={close}>About Us</HashLink>
            <HashLink smooth to="/landing#events-campaigns" className="nav-link" onClick={close}>Events</HashLink>
            <HashLink smooth to="/landing#real-stories" className="nav-link" onClick={close}>Cases</HashLink>
            <HashLink smooth to="/landing#volunteer-stories" className="nav-link" onClick={close}>Volunteers</HashLink>
            <HashLink smooth to="/landing#donation-options" className="nav-link" onClick={close}>Donation</HashLink>
            <Link to="/careers" className="nav-link" onClick={close}>Careers</Link>

            {donor ? (
              <button type="button" className="nav-link login-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link login-btn" onClick={close}>
                Login
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header