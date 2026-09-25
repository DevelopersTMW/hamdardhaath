
// "use client"

// import { useState } from "react"
// import Header from "../components/Header/Header"
// import Footer from "../components/Footer/Footer"
// import { Lock, Mail, Eye, EyeOff } from "lucide-react"
// import { Link } from "react-router-dom"
// import "../styles/donor_login.css"

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false)


//   return (
//     <div className="page">
//       <Header />

//       <main className="login-main">
//         <div className="login-card">
//           <div className="login-card-header">
//             <div className="lock-circle">
//               <Lock width={24} height={24} />
//             </div>
//             <h2 className="login-title">Admin Login</h2>
//             <p className="login-subtitle">Enter your credentials to access the dashboard</p>
//           </div>

//           <div className="login-card-content">
//             {/* email */}
//             <div className="form-group">
//               <label htmlFor="email" className="label">Email Address</label>
//               <div className="input-wrapper">
//                 <Mail className="icon-left" width={16} height={16} />
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   className="input"
//                 />
//               </div>
//             </div>

//             {/* password */}
//             <div className="form-group">
//               <label htmlFor="password" className="label">Password</label>
//               <div className="input-wrapper">
//                 <Lock className="icon-left" width={16} height={16} />
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="input has-right"
//                 />
//                 <button
//                   type="button"
//                   className="icon-right btn-icon"
//                   onClick={() => setShowPassword((s) => !s)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
//                 </button>
//               </div>
//             </div>

//             <Link to="/volunteer_dashboard" className="login-btn-primary">
//             Login
//             </Link>


//             <div className="links">
//               <Link to="/forgot-password" className="link">Forgot Password?</Link>

//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/donor_login.css"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    // basic validation
    if (!email || !password) {
      alert("Email and password are required")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("https://app.hamdardhaath.org/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        alert(data.message || "Invalid email or password")
        return
      }

      // OPTIONAL: store admin session
      localStorage.setItem("admin", JSON.stringify(data.admin))

      // redirect to admin dashboard
      navigate("/admin_dashboard")

    } catch (err) {
      console.error(err)
      alert("Server error. Please try again.")
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
            <h2 className="login-title">Admin Login</h2>
            <p className="login-subtitle">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form className="login-card-content" onSubmit={handleLogin}>
            {/* Email */}
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

            {/* Password */}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="links">
              <Link to="/forgot-password" className="link">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
