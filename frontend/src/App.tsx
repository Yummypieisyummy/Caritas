import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrganizationPage from './pages/OrganizationPage'; // Public org profile page
import OrgOverviewPage from './pages/OrgOverviewPage'; // Manage org profile, posts, team, see verification status
import OrgVerification from './pages/OrgVerification'; // Initial form after email verification and no verification info submitted
import OrgPostsPage from './pages/OrgPostsPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { FiltersProvider } from './contexts/FiltersContext';

function App() {
  return (
    <AuthProvider>
      <FiltersProvider>
        <Router>
          <Routes>
            {/* Pages with navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/organization/:id" element={<OrganizationPage />} />
            </Route>
            {/* Pages without navbar */}

            <Route path="organization/setup" element={<OrgVerification />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="signup-success" element={<SignupSuccessPage />} />

            <Route element={<DashboardLayout />}>
              <Route
                path="organization/overview"
                element={<OrgOverviewPage />}
              />
              <Route path="/organization/myposts" element={<OrgPostsPage />} />
            </Route>
          </Routes>
        </Router>
      </FiltersProvider>
    </AuthProvider>
  );
}

export default App;
