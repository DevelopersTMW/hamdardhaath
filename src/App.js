import { Routes, Route, Navigate } from "react-router-dom";

import CreateCase from "./pages/create_case";
import DonorLogin from "./pages/donor_login";
import VolunteerLogin from "./pages/volunteer_login";
import AdminLogin from "./pages/admin_login";
import MembershipCard from "./pages/m_card"; 
import LandingPage from "./pages/landing"; 
import DonorRegister from "./pages/donor_reg" ;
import VolunteerRegister from "./pages/volunteer_reg" ;
import DonorDashboard from "./pages/DonorDashboard";
import DonorAnalytics from "./pages/donor_analytics";
import EventManagementPanel from "./pages/EventManagementPanel";
import FundraiserPanel from "./pages/FundraiserPanel";
import DonationCheckout from "./pages/OneTimeDonation";
import VolunteerDashboard from "./pages/volunteer_dashboard" ;
import VolunteerManagement from "./pages/volunteer_management" ;
import SystemAdministration from "./pages/system_administration" ;
import Careers from "./pages/careers" ;
import AdminDashboard from "./pages/admin_dashboard" ;



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<DonorLogin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path= "/volunteer_login" element={<VolunteerLogin />} />
      <Route path= "/admin_login" element={<AdminLogin />} />
      <Route path= "/m_card" element={<MembershipCard />} />
      <Route path= "/donor_reg" element={<DonorRegister />} />
      <Route path= "/volunteer_reg" element={<VolunteerRegister />} />
      <Route path="/donationcheckout" element={<DonationCheckout />} /> 
      <Route path="/donordashboard" element={<DonorDashboard />} /> 
      <Route path="/donor_analytics" element={<DonorAnalytics />} /> 
      <Route path="/eventmanagement" element={<EventManagementPanel />} />
      <Route path="/fundraiserpanel" element={<FundraiserPanel />} />  
      <Route path="/admin_dashboard" element={<AdminDashboard />} />  
      <Route path="/volunteer_dashboard" element={<VolunteerDashboard />} />  
      <Route path="/volunteer_management" element={<VolunteerManagement />} />  
      <Route path="/system_administration" element={<SystemAdministration />} /> 
      <Route path="/careers" element={<Careers />} />  
      <Route path="/create_case" element={<CreateCase />} />  


    </Routes>
  );
}
