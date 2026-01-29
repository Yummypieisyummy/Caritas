import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrganizationPage from './pages/OrganizationPage';
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
          </Routes>
        </Router>
      </FiltersProvider>
    </AuthProvider>
  );
}

export default App;
