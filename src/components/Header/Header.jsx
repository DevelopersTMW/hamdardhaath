"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import { Menu, X } from "lucide-react"
import "./header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const close = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" onClick={close}>
              <img src="/hh_logo.png" alt="Hamdard Haath" />
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <HashLink smooth to="/#who-we-are" className="nav-link" onClick={close}>About Us</HashLink>
            <HashLink smooth to="/#events-campaigns" className="nav-link" onClick={close}>Events</HashLink>
            <HashLink smooth to="/#real-stories" className="nav-link" onClick={close}>Cases</HashLink>
            <HashLink smooth to="/#volunteer-stories" className="nav-link" onClick={close}>Volunteers</HashLink>
            <HashLink smooth to="/#donation-options" className="nav-link" onClick={close}>Donation</HashLink>
            <Link to="/careers" className="nav-link" onClick={close}>Careers</Link>
            <Link to="/login" className="nav-link login-btn" onClick={close}>Login</Link>
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
