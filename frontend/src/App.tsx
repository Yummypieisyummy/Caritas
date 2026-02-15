import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrganizationProfilePage from './pages/OrganizationProfilePage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import SetupVerificationPage from './pages/SetupVerificationPage';
import ManagePostsPage from './pages/ManagePostsPage';
import CreatePostPage from './pages/CreatePostPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { FiltersProvider } from './contexts/FiltersContext';
import TeamAccessPage from './pages/TeamAccessPage';

function App() {
  return (
    <AuthProvider>
      <FiltersProvider>
        <Router>
          <Routes>
            {/* Pages with navbar + Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/organizations/:id"
                element={<OrganizationProfilePage />}
              />
            </Route>

            {/* Pages without navbar */}
            <Route
              path="/dashboard/setup"
              element={<SetupVerificationPage />}
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/signup-success" element={<SignupSuccessPage />} />

            {/* Organization dashboard pages + Private routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard/overview"
                element={<DashboardOverviewPage />}
              />
              <Route path="/dashboard/posts" element={<ManagePostsPage />} />
              <Route
                path="/dashboard/posts/create"
                element={<CreatePostPage />}
              />
              <Route path="/dashboard/team" element={<TeamAccessPage />} />
            </Route>
          </Routes>
        </Router>
      </FiltersProvider>
    </AuthProvider>
  );
}

export default App;
