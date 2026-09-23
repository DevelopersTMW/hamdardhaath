import React from "react";
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__wrap">

          <div className="footer__col">
            <img src="/footer_logo.png" alt="Hamdard Haath" className="footer__logo" />
            <p className="footer__text">
              Hamdard Haath is always welcoming hands that help others in need.
              Together we can build stronger communities.
            </p>
            <a href="#contact" className="footer__cta">
              Contact With Us <ArrowRight size={14} />
            </a>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__list">
              {['Home', 'Events', 'Cases', 'Volunteers', 'Donation', 'Careers'].map(label => (
                <li key={label}><a href="#" className="footer__link">{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Hamdard Info</h3>
            <ul className="footer__list">
              {['About Us', 'Register as Member', 'Become a Donor', 'Join as Volunteer', 'Contact'].map(label => (
                <li key={label}><a href="#" className="footer__link">{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Reach Us</h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Mail size={14} className="footer__contact-icon" />
                hamdardhaathofficial@gmail.com
              </div>
              <div className="footer__contact-item">
                <Phone size={14} className="footer__contact-icon" />
                0348 0055600
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} className="footer__contact-icon" />
                Karachi, Pakistan
              </div>
            </div>
            <div className="footer__social">
              <a href="#" aria-label="Facebook" className="footer__icon"><Facebook size={17} /></a>
              <a href="#" aria-label="Instagram" className="footer__icon"><Instagram size={17} /></a>
              <a href="#" aria-label="LinkedIn" className="footer__icon"><Linkedin size={17} /></a>
            </div>
          </div>

        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__container">
          <div className="footer__bar-inner">
            <p>© 2025 Hamdard Haath. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
