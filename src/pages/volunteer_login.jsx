"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import "../styles/donor_login.css"

export default function VolunteerLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("https://khidmat.hamdardhaath.org/api/volunteer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        const errorMessage = data.message || data.error || "Login failed. Please check your credentials."
        setError(errorMessage)
        setLoading(false)
        return
      }

      // Store volunteer info in localStorage
      localStorage.setItem("volunteer", JSON.stringify(data.volunteer))

      // Redirect to volunteer dashboard after successful login
      navigate("/volunteer_dashboard")

    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Server error. Please check if the backend server is running and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Header />

      <main className="login-main">
        <div className="login-card">
          <div className="login-card-header">
            <div className="lock-circle">
              <Lock width={24} height={24} />
            </div>
            <h2 className="login-title">Volunteer Login</h2>
            <p className="login-subtitle">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="login-card-content">
            <form onSubmit={handleLogin}>
              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email" className="label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="icon-left" width={16} height={16} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="password" className="label">Password</label>
                <div className="input-wrapper">
                  <Lock className="icon-left" width={16} height={16} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input has-right"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="icon-right btn-icon"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && <p className="error-text">{error}</p>}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-btn-primary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="links">
              <Link to="/forgot-password" className="link">
                Forgot Password?
              </Link>

              <p className="login-muted">
                Not registered?{" "}
                <Link to="/volunteer_reg" className="link">
                  Register as a Volunteer
                </Link>
              </p>

              <p className="login-muted">
                Login as{" "}
                <Link to="/login" className="link">
                  Donor
                </Link>
              </p>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <Link
                  to="/volunteer_reg"
                  className="login-btn-primary"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #0f4c75, #1eb2a6)', marginTop: 0 }}
                >
                  Apply to be a Volunteer
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
