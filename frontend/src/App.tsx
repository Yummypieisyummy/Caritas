import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrganizationPage from './pages/OrganizationPage'; // Public org profile page
import OrgDashboardPage from './pages/OrgDashboardPage'; // Manage org profile, posts, team, see verification status
import OrgSetupPage from './pages/OrgSetupPage'; // Initial form after email verification and no verification info submitted
import SignupSuccessPage from './pages/SignupSuccessPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { FiltersProvider } from './contexts/FiltersContext';

function App() {
  return (
    <AuthProvider>
      <FiltersProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/organization/:id" element={<OrganizationPage />} />
            <Route
              path="organization/dashboard"
              element={<OrgDashboardPage />}
            />
            <Route path="organization/setup" element={<OrgSetupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="signup-success" element={<SignupSuccessPage />} />
          </Routes>
        </Router>
      </FiltersProvider>
    </AuthProvider>
  );
}

export default App;
