import { TherapistProfile } from './pages/therapist/TherapistProfile';
import { TherapistProfileEdit } from './pages/therapist/TherapistProfileEdit';
import { TherapistSettings } from './pages/therapist/TherapistSettings';
import { TherapistLogin } from './pages/therapist/TherapistLogin';
import { PatientLogin } from './pages/PatientLogin'; // Note: I put PatientLogin in pages/ root to separate from therapist flow

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { TherapistLanding } from './pages/therapist/TherapistLanding';
import { TherapistSignup } from './pages/therapist/TherapistSignup';
import { TherapistOnboarding } from './pages/therapist/TherapistOnboarding';
import { TherapistDashboard } from './pages/therapist/TherapistDashboard';
import { TherapistLeads } from './pages/therapist/TherapistLeads';
import { AdminServicesHub } from './pages/therapist/AdminServicesHub';
import { InsuranceWizard } from './pages/therapist/InsuranceWizard';
import { PensionWizard } from './pages/therapist/PensionWizard';
import { TaxWizard } from './pages/therapist/TaxWizard';
import { Integrations } from './pages/therapist/Integrations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TherapistLanding />} />
        <Route path="/signup" element={<TherapistSignup />} />
        <Route path="/login" element={<TherapistLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />

        <Route path="/onboarding" element={<TherapistOnboarding />} />
        <Route path="/dashboard" element={<TherapistDashboard />} />
        <Route path="/leads" element={<TherapistLeads />} />
        <Route path="/profile" element={<TherapistProfile />} />
        <Route path="/profile/edit" element={<TherapistProfileEdit />} />
        <Route path="/settings" element={<TherapistSettings />} />

        <Route path="/admin-services" element={<AdminServicesHub />} />
        <Route path="/admin-services/insurance" element={<InsuranceWizard />} />
        <Route path="/admin-services/pension" element={<PensionWizard />} />
        <Route path="/admin-services/tax" element={<TaxWizard />} />
        <Route path="/integrations" element={<Integrations />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
