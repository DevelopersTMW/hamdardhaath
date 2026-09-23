"use client";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/m_card.css";

export default function MembershipCard({
  name = "Tom Cruise",
  memberId = "GYM-10234",
  photoUrl = "https://via.placeholder.com/160x160.png?text=Photo",
  qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=GYM-10234",
}) {
  return (
    <div className="page">
      {/* header at top */}
      <Header />
        <div className="header-spacer" /> 

      <main className="membership-main">
        <div className="card-wrap">
          <div className="card">
            <div className="card-header">
              <span className="brand-pill">MEMBERSHIP CARD</span>
            </div>

            <div className="card-body">
              <div className="profile">
                <img className="avatar" src={photoUrl} alt={`${name} profile`} />
                <div className="identity">
                  <h2 className="member-name">{name}</h2>
                  <p className="member-id">
                    <span>ID:</span> {memberId}
                  </p>
                </div>
              </div>

              <div className="qr-wrap" aria-label="Membership QR">
                <img className="qr" src={qrSrc} alt="QR code for membership" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* footer at bottom */}
      <Footer />
    </div>
  );
}
