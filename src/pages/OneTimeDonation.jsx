import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../styles/OneTimeDonation.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// Initialize Stripe (Replace with your actual public key)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

// We separate the form into a sub-component so it can access the Stripe hooks
const CheckoutForm = ({ amount, frequency, cause, campaignData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    try {
      // 1. Ask backend for a Stripe Payment Intent
      const { data: { clientSecret } } = await axios.post('https://khidmat.hamdardhaath.org/api/donations/create-payment-intent', {
        amount: amount
      });

      // 2. Confirm the payment on the frontend using Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: fullName, email: email },
        },
      });

      if (paymentResult.error) {
        setMessage(`Payment failed: ${paymentResult.error.message}`);
        setLoading(false);
        return;
      }

      // 3. If successful, tell backend to save to SQLite database
      if (paymentResult.paymentIntent.status === 'succeeded') {
        await axios.post('https://khidmat.hamdardhaath.org/api/donations/save-donation', {
          amount,
          frequency,
          fullName,
          email,
          causeId: cause || null // Send the selected campaign ID if any
        });
        
        setMessage('Thank you! Your donation was successful.');
        setFullName('');
        setEmail('');
        elements.getElement(CardElement).clear();
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  // Minimal inline styling for the Stripe CardElement to match your UI
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': { color: '#aab7c4' },
        padding: '10px'
      },
      invalid: { color: '#9e2146' },
    },
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Payment Details</h3>
      
      <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" required />
      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
      
      <div className="form-input" style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }}>
        <CardElement options={cardElementOptions} />
      </div>

      <button className="submit-btn" onClick={handleDonationSubmit} disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Confirm $${amount} Donation`}
      </button>

      {message && <p style={{ marginTop: '10px', color: message.includes('failed') || message.includes('error') ? 'red' : 'green' }}>{message}</p>}
      <p className="security-text">🔒 100% Secure Payments by Stripe</p>
    </div>
  );
};

const DonationCheckout = () => {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [cause, setCause] = useState('');

  const campaignData = {
    title: "Emergency Medical Aid",
    description: "Help provide critical medical care to those in need",
    raisedAmount: 32500,
    goalAmount: 50000
  };

  const currentAmount = customAmount ? parseFloat(customAmount) : amount;

  return (
    <div className="donation-page">
      <Header />

      <main className="main-content">
        {/* Campaign Card - Keeps your original UI */}
        <div className="campaign-card">
            <div className="campaign-content">
              <h2 className="campaign-title">{campaignData.title}</h2>
              <p className="campaign-description">{campaignData.description}</p>
              <div className="campaign-progress">
                <span>Raised: ${campaignData.raisedAmount.toLocaleString()}</span>
                <span>Goal: ${campaignData.goalAmount.toLocaleString()}</span>
              </div>
            </div>
        </div>

        {/* Amount Selection - Keeps your original UI */}
        <div className="form-section">
          <h3 className="section-title">Choose Amount</h3>
          <div className="amount-buttons">
            {[25, 50, 100, 250].map((val) => (
              <button key={val} onClick={() => { setAmount(val); setCustomAmount(''); }} className={`amount-btn ${amount === val && !customAmount ? 'amount-btn-active' : ''}`}>
                ${val}
              </button>
            ))}
          </div>
          <input type="number" placeholder="Custom Amount" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="custom-amount-input" />
          
          <label className="form-label" style={{marginTop: '20px'}}>Donation Frequency</label>
          <div className="frequency-buttons">
            <button onClick={() => setFrequency('one-time')} className={`frequency-btn ${frequency === 'one-time' ? 'frequency-btn-active' : ''}`}>One-Time</button>
            <button onClick={() => setFrequency('monthly')} className={`frequency-btn ${frequency === 'monthly' ? 'frequency-btn-active' : ''}`}>Monthly</button>
          </div>

          <label className="form-label" style={{marginTop: '20px'}}>Cause (Optional)</label>
          <select value={cause} onChange={(e) => setCause(e.target.value)} className="form-select">
            <option value="">Select a cause</option>
            {/* These values should ideally match your campaign_id from your DB */}
            <option value="1">Winter Ration Drive</option> 
            <option value="2">Flood Relief Emergency Fund</option>
          </select>
        </div>

        {/* Wrap the payment form in Stripe Elements */}
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            amount={currentAmount} 
            frequency={frequency} 
            cause={cause} 
            campaignData={campaignData} 
          />
        </Elements>
      </main>

      <Footer />
    </div>
  );
};

export default DonationCheckout;