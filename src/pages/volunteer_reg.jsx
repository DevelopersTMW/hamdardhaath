import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, CreditCard, MapPin, 
  Calendar, Globe, AlertCircle, ChevronDown, Check, X, Lock
} from 'lucide-react';
import html2canvas from 'html2canvas';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/volunteer_reg.css';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, volunteerId }) => {
  const cardRef = React.useRef(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      // Create a canvas from the ID card element
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1E293B', // Tailwind slate-800 to match typical dark cards, adjust if needed
        scale: 2 // Higher resolution
      });
      
      // Convert canvas to image data URL
      const image = canvas.toDataURL('image/png');
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = image;
      link.download = `Volunteer_ID_${volunteerId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download ID:', err);
      alert('Failed to download ID card. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button 
          onClick={onClose}
          className="modal-close-btn"
        >
          <X size={24} />
        </button>

        <div className="modal-success-icon">
          <Check className="icon-size-lg icon-white" strokeWidth={4} />
        </div>

        <h2 className="modal-title">
          Thank you for joining as a volunteer
        </h2>
        <p className="modal-description">
          Your application has been submitted successfully.
        </p>

        <div className="modal-card" ref={cardRef} style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="modal-user-icon">
            <User className="icon-size-xl icon-white icon-fill-white" />
          </div>

          <h3 className="modal-card-title">Volunteer ID</h3>
          <p className="modal-card-text">ID: {volunteerId}</p>
        </div>

        <button 
          className="modal-download-btn"
          onClick={handleDownload}
          style={{ marginTop: '20px' }}
        >
          Download Volunteer ID
        </button>
      </div>
    </div>
  );
};

const VolunteerForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    city: '',
    skills: [],
    language: '',
    emergencyAvailable: false,
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [volunteerId, setVolunteerId] = useState('');
  
  // State for time slots
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Generate random volunteer ID
  const generateVolunteerId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit random number
    return `VOL-${year}-${randomNum}`;
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCNIC = (cnic) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const validatePhone = (phone) => {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10; // After +92
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    if (name === 'cnic' || name === 'emergencyCnic') {
      processedValue = formatCNIC(value);
    }
    
    if (name === 'phone' || name === 'emergencyPhone') {
      const digits = value.replace(/\D/g, '');
      processedValue = digits.slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch(fieldName) {
      case 'fullName':
      case 'emergencyName':
        if (!value.trim()) error = 'This field is required';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Invalid email address';
        break;
      case 'phone':
      case 'emergencyPhone':
        if (!value.trim()) error = 'Phone is required';
        else if (!validatePhone(value)) error = 'Phone must be 10 digits';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (!validatePassword(value)) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (!value.trim()) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'cnic':
        if (!value.trim()) error = 'CNIC is required';
        else if (!validateCNIC(value)) error = 'CNIC format: XXXXX-XXXXXXX-X';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'emergencyRelationship':
        if (!value.trim()) error = 'Relationship is required';
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // Calculate current step based on completed fields
  useEffect(() => {
    const step1Complete = formData.fullName && formData.email && formData.phone && formData.password && formData.confirmPassword && formData.cnic && formData.city &&
                          validateEmail(formData.email) && validatePhone(formData.phone) && validatePassword(formData.password) && 
                          formData.password === formData.confirmPassword && validateCNIC(formData.cnic);
    const step2Complete = formData.skills.length > 0 || selectedSlots.length > 0;
    const step3Complete = formData.emergencyName && formData.emergencyPhone && formData.emergencyRelationship &&
                          validatePhone(formData.emergencyPhone);
    
    if (step3Complete) setCurrentStep(4);
    else if (step2Complete) setCurrentStep(3);
    else if (step1Complete) setCurrentStep(2);
    else setCurrentStep(1);
  }, [formData, selectedSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'cnic', 'city', 'emergencyName', 'emergencyPhone', 'emergencyRelationship'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });
    
    if (!isValid) {
      alert('Please fill all required fields correctly');
      return;
    }

    try {
      // Prepare data for API
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        cnic: formData.cnic,
        city: formData.city,
        skills: formData.skills,
        selectedSlots: selectedSlots,
        language: formData.language,
        emergencyAvailable: formData.emergencyAvailable,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelationship: formData.emergencyRelationship
      };

      // Send registration request to backend
      const response = await fetch('https://app.hamdardhaath.org/api/volunteer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Registration failed';
        console.error('Registration failed:', errorMsg, data);
        throw new Error(errorMsg);
      }

      // Check if registration was actually successful
      if (!data.success) {
        const errorMsg = data.message || data.error || 'Registration failed';
        console.error('Registration not successful:', errorMsg, data);
        throw new Error(errorMsg);
      }

      // Success - show modal with volunteer ID
      // Use database volunteer_id if available, otherwise generate one
      const newVolunteerId = data.volunteer_id 
        ? `VOL-${new Date().getFullYear()}-${data.volunteer_id}` 
        : generateVolunteerId();
      setVolunteerId(newVolunteerId);
      setShowModal(true);
      
      // Optionally reset form
      // setFormData({ ...initialFormData });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Failed to register. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Optionally reset form or redirect
  };

  const toggleSlot = (day, time) => {
    const id = `${day}-${time}`;
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(s => s !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  return (
    <div className="volunteer-page">
      <Header />
      
      <main className="volunteer-main">
      
      <div className="header-section">
        <h1 className="header-title">Join as a Volunteer</h1>
        <p className="header-subtitle">Help on-ground with education, relief and events.</p>
      </div>

      <div className="progress-container">
        <div className="progress-steps">
          <div className="progress-line"></div>
          
          {[
            { id: 1, label: 'Personal Info', active: currentStep >= 1 },
            { id: 2, label: 'Skills & Time', active: currentStep >= 2 },
            { id: 3, label: 'Emergency Contact', active: currentStep >= 3 },
            { id: 4, label: 'Confirmation', active: currentStep >= 4 },
          ].map((step) => (
            <div key={step.id} className="progress-step-wrapper">
              <div className={`progress-step-circle ${step.active ? 'active' : 'inactive'}`}>
                {step.id}
              </div>
              <span className="progress-step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-container">
        
        <form onSubmit={handleSubmit} className="volunteer-form">
        
        <div className="section-personal">
          <h2 className="section-title">Personal Information</h2>
          
          <div className="section-content">
            <div>
              <label className="form-label">Full Name *</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} className="icon-gray icon-size-md" />
                </div>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Enter your full name" 
                  className={`form-input ${touched.fullName && errors.fullName ? 'error' : ''}`} 
                />
              </div>
              {touched.fullName && errors.fullName && (
                <p className="error-message">{errors.fullName}</p>
              )}
            </div>

            <div className="form-grid">
              <div>
                <label className="form-label">Email *</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Mail size={18} className="icon-gray icon-size-md" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter your email" 
                    className={`form-input ${touched.email && errors.email ? 'error' : ''}`} 
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="form-label">Phone *</label>
                <div className="input-wrapper">
                  <div className="input-icon-text">
                    <span className="text-sm">+92</span>
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="XXX-XXXXXXX" 
                    className={`form-input phone-input ${touched.phone && errors.phone ? 'error' : ''}`} 
                  />
                </div>
                <p className="help-text">Pakistan only (+92)</p>
                {touched.phone && errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label className="form-label">Password *</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Lock size={18} className="icon-gray icon-size-md" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter password" 
                    className={`form-input ${touched.password && errors.password ? 'error' : ''}`} 
                  />
                </div>
                <p className="help-text">Minimum 6 characters</p>
                {touched.password && errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="form-label">Confirm Password *</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Lock size={18} className="icon-gray icon-size-md" />
                  </div>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Confirm password" 
                    className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`} 
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">CNIC *</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <CreditCard size={18} className="icon-gray icon-size-md" />
                </div>
                <input 
                  type="text" 
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('cnic')}
                  placeholder="XXXXX-XXXXXXX-X" 
                  maxLength="15"
                  className={`form-input ${touched.cnic && errors.cnic ? 'error' : ''}`} 
                />
              </div>
              {touched.cnic && errors.cnic && (
                <p className="error-message">{errors.cnic}</p>
              )}
            </div>

            <div>
              <label className="form-label">City *</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <MapPin size={18} className="icon-gray icon-size-md" />
                </div>
                <select 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('city')}
                  className={`form-select ${touched.city && errors.city ? 'error' : ''} ${formData.city ? 'has-value' : 'placeholder'}`}
                >
                  <option value="">Select your city</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
                <div className="select-arrow">
                  <ChevronDown size={16} className="icon-gray icon-size-sm" />
                </div>
              </div>
              {touched.city && errors.city && (
                <p className="error-message">{errors.city}</p>
              )}
            </div>
          </div>
        </div>

        <div className="section-skills">
          <h2 className="section-title">Skills & Availability</h2>

          <div className="skills-grid">
            {['Event Management', 'Healthcare Support', 'Education', 'Food Distribution', 'Admin Support'].map((skill) => (
              <label key={skill} className="skill-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={formData.skills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                  className="skill-checkbox" 
                />
                <span className="skill-label-text">{skill}</span>
              </label>
            ))}
          </div>

          <div className="time-slots-container">
            <h3 className="time-slots-title">Weekly Time Slots</h3>
            <div className="time-slots-wrapper">
              <table className="time-slots-table">
                <thead>
                  <tr>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Morning', 'Afternoon', 'Evening'].map((time) => (
                    <tr key={time}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                         const isSelected = selectedSlots.includes(`${day}-${time}`);
                         return (
                          <td key={day}>
                            <button
                              type="button"
                              onClick={() => toggleSlot(day, time)}
                              className={`time-slot-btn ${isSelected ? 'selected' : 'unselected'}`}
                            >
                              {time}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="language-select-wrapper">
            <label className="form-label">Language Proficiency</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Globe size={18} className="icon-gray icon-size-md" />
              </div>
              <select 
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="form-select placeholder"
              >
                <option value="">Select languages</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Sindhi">Sindhi</option>
              </select>
              <div className="select-arrow">
                <ChevronDown size={16} className="icon-gray icon-size-sm" />
              </div>
            </div>
          </div>

          <div className="toggle-container">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                name="emergencyAvailable"
                checked={formData.emergencyAvailable}
                onChange={handleInputChange}
                className="toggle-input" 
              />
              <div className="toggle-slider"></div>
              <span className="toggle-text">Available for Emergency Response</span>
            </label>
          </div>
        </div>

        <div className="section-emergency">
          <h2 className="section-title">Emergency Contact</h2>
          
          <div className="section-content">
            <div>
              <label className="form-label">Name *</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} className="icon-gray icon-size-md" />
                </div>
                <input 
                  type="text" 
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('emergencyName')}
                  placeholder="Enter contact name" 
                  className={`form-input ${touched.emergencyName && errors.emergencyName ? 'error' : ''}`} 
                />
              </div>
              {touched.emergencyName && errors.emergencyName && (
                <p className="error-message">{errors.emergencyName}</p>
              )}
            </div>

            <div>
              <label className="form-label">Phone *</label>
              <div className="input-wrapper">
                <div className="input-icon-text">
                  <span className="text-sm">+92</span>
                </div>
                <input 
                  type="tel" 
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('emergencyPhone')}
                  placeholder="XXX-XXXXXXX" 
                  className={`form-input phone-input ${touched.emergencyPhone && errors.emergencyPhone ? 'error' : ''}`} 
                />
              </div>
              <p className="help-text">Pakistan only (+92)</p>
              {touched.emergencyPhone && errors.emergencyPhone && (
                <p className="error-message">{errors.emergencyPhone}</p>
              )}
            </div>

            <div>
              <label className="form-label">Relationship *</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} className="icon-gray icon-size-md" />
                </div>
                <input 
                  type="text" 
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('emergencyRelationship')}
                  placeholder="Enter relationship" 
                  className={`form-input ${touched.emergencyRelationship && errors.emergencyRelationship ? 'error' : ''}`} 
                />
              </div>
              {touched.emergencyRelationship && errors.emergencyRelationship && (
                <p className="error-message">{errors.emergencyRelationship}</p>
              )}
            </div>
          </div>

          <div className="submit-btn-container">
            <button 
              type="submit"
              className="submit-btn"
            >
              Submit Application
            </button>
          </div>
        </div>

        </form>

      </div>
      </main>
      
      <Footer />
      
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showModal} 
        onClose={closeModal}
        volunteerId={volunteerId}
      />
    </div>
  );
};

export default VolunteerForm;



