"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import "../styles/donor_login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("https://khidmat.hamdardhaath.org/api/donor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      // ✅ TEMP: store donor info (simple auth)
      localStorage.setItem("donor", JSON.stringify(data.donor))

      // ✅ Redirect after successful login
      navigate("/DonorDashboard")

    } catch (err) {
      console.error(err)
      setError("Server error. Please try again.")
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
            <h2 className="login-title">Donor Login</h2>
            <p className="login-subtitle">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="login-card-content">
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
              className="login-btn-primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="links">
              <Link to="/forgot-password" className="link">
                Forgot Password?
              </Link>

              <p className="login-muted">
                Not registered?{" "}
                <Link to="/donor_reg" className="link">
                  Register as a Donor
                </Link>
              </p>

              <p className="login-muted">
                Login as{" "}
                <Link to="/volunteer_login" className="link">
                  Volunteer
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
