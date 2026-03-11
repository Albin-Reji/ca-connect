import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oauth2-code-pkce";
import { store } from "./store/store";
import { AppProvider } from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import HomePage from './pages/HomePage';
import CreateProfile from './pages/CreateProfile';
import ProfileView from './pages/ProfileView';
import NearbyPeers from './pages/NearbyPeers';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import MockTests from './pages/MockTests';
import Mentorship from './pages/Mentorship';
import Jobs from './pages/Jobs';

const authConfig = {
  clientId: "ca-connect",
  authorizationEndpoint: "http://localhost:8090/realms/ca-connect/protocol/openid-connect/auth",
  tokenEndpoint: "http://localhost:8090/realms/ca-connect/protocol/openid-connect/token",
  redirectUri: window.location.origin,
  scope: "openid profile email",
  onRefreshTokenExpire: (event) => event.logIn(),
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider authConfig={authConfig}>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/" element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } />
                <Route
                  path="/dashboard"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <Dashboard />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/study-materials"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <StudyMaterials />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/mock-tests"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <MockTests />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/mentorship"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <Mentorship />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <Jobs />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/create-profile"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <CreateProfile />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={false}>
                        <ProfileView />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route
                  path="/profile/:userId/peers"
                  element={
                    <Layout>
                      <AuthGuard requireAuth={true}>
                        <NearbyPeers />
                      </AuthGuard>
                    </Layout>
                  }
                />
                <Route path="*" element={
                  <Layout>
                    <Navigate to="/" replace />
                  </Layout>
                } />
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;