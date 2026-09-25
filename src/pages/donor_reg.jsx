"use client"

import { useState } from "react"
import "../styles/donor_reg.css"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Link } from "react-router-dom"


const DonationForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "" ,
    phoneNumber: "",
    cnic: "",
    city: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    donationType: "one-time",
    amount: "",
    causePreferences: {
      education: false,
      health: false,
      religion: false,
    },
    notifications: {
      smsUpdates: true,
      emailNewsletters: true,
      emergencyAlerts: true,
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (category, field) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  // 1️⃣ Password check (keep this)
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match")
    return
  }

  // 2️⃣ Prepare data for backend
  const payload = {
    full_name: formData.fullName,
    email: formData.email,
    password: formData.password,
    phone_number: formData.phoneNumber,
    cnic: formData.cnic,
    city: formData.city,
    is_monthly_subscriber: formData.donationType === "monthly",
    sms_updates: formData.notifications.smsUpdates,
    email_newsletters: formData.notifications.emailNewsletters,
    emergency_alerts: formData.notifications.emergencyAlerts
  }

  try {
    // 3️⃣ Send to backend
    const res = await fetch("https://app.hamdardhaath.org/api/donor/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    // 4️⃣ Handle response
    if (data.success) {
      setShowModal(true)   // REAL success now
    } else {
      alert(data.error || data.message || "Registration failed");
    }
  } catch (error) {
    console.error(error)
    alert("Server error. Please try again.")
  }
}


  const closeModal = () => {
    setShowModal(false)
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const generateDonorId = () => {
    return `SHD${Math.floor(Math.random() * 900000) + 100000}`
  }

  return (
    <>
      <Header />

      {/* Page wrapper so footer sits at bottom */}
      <main className="donation-page with-sticky-header">
        <div className="donation-form-container">
          <div className="form-wrapper">
            {/* Progress Steps */}
            <div className="progress-steps">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-label">Personal Details</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-label">Payment Setup</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Donation Plan</div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-label">Confirmation</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="donation-form">
              {/* Personal Details Section */}
              <div className="form-section">
                <h2 className="section-title">Personal Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                   <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>CNIC</label>
                    <input
                      type="text"
                      name="cnic"
                      placeholder="Enter your CNIC"
                      value={formData.cnic}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <select name="city" value={formData.city} onChange={handleInputChange}>
                      <option value="">Select your city</option>
                      <option value="karachi">Karachi</option>
                      <option value="lahore">Lahore</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="form-section">
                <h2 className="section-title">Payment Method</h2>
                <div className="payment-method">
                  <div className="payment-option selected">
                    <div className="payment-icon">💳</div>
                    <span>Credit/Debit Card</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Donation Plan Section */}
              <div className="form-section">
                <h2 className="section-title">Donation Plan</h2>
                <div className="donation-type">
                  <label>Select Plan</label>
                  <div className="toggle-buttons">
                    <button
                      type="button"
                      className={formData.donationType === "one-time" ? "active" : ""}
                      onClick={() => setFormData((prev) => ({ ...prev, donationType: "one-time" }))}
                    >
                      One-Time
                    </button>
                    <button
                      type="button"
                      className={formData.donationType === "monthly" ? "active" : ""}
                      onClick={() => setFormData((prev) => ({ ...prev, donationType: "monthly" }))}
                    >
                      Monthly
                    </button>
                  </div>
                  <div className="plan-description">
                    {formData.donationType === "one-time" ? "Single donation" : "Recurring donation"}
                  </div>
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="cause-preferences">
                  <label>Cause Preference</label>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.causePreferences.education}
                        onChange={() => handleCheckboxChange("causePreferences", "education")}
                      />
                      <span>Education</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.causePreferences.health}
                        onChange={() => handleCheckboxChange("causePreferences", "health")}
                      />
                      <span>Health</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.causePreferences.religion}
                        onChange={() => handleCheckboxChange("causePreferences", "religion")}
                      />
                      <span>Religion</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Preferences Section */}
              <div className="form-section">
                <h2 className="section-title">Notification Preferences</h2>
                <div className="notification-item">
                  <span>SMS Updates</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.notifications.smsUpdates}
                      onChange={() => handleCheckboxChange("notifications", "smsUpdates")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span>Email Newsletters</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.notifications.emailNewsletters}
                      onChange={() => handleCheckboxChange("notifications", "emailNewsletters")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span>Emergency Alerts</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.notifications.emergencyAlerts}
                      onChange={() => handleCheckboxChange("notifications", "emergencyAlerts")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-button">
                Submit Application
              </button>
            </form>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">
                <div className="checkmark">✓</div>
              </div>
              <h2 className="modal-title">You're now registered as a verified donor</h2>
              <div className="donor-info">
                <div className="donor-id-label">Donor ID</div>
                <div className="donor-id">{generateDonorId()}</div>
                <div className="registration-date">{getCurrentDate()}</div>
              </div>
              <Link to="/m_card" className="download-button">
                <span className="download-icon">⬇</span>
                Download Digital Donor Card
                </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default DonationForm