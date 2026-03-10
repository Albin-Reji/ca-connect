/**
 * App.jsx — Root component with React Router routes
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import ToastStack from './components/ui/Toast';

// Pages
import Home         from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import ProfileView  from './pages/ProfileView';
import NearbyPeers  from './pages/NearbyPeers';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/"                          element={<Home />} />
            <Route path="/create-profile"            element={<CreateProfile />} />
            <Route path="/profile/:userId"           element={<ProfileView />} />
            <Route path="/profile/:userId/peers"     element={<NearbyPeers />} />
            {/* Catch-all */}
            <Route path="*"                          element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastStack />
      </BrowserRouter>
    </AppProvider>
  );
}