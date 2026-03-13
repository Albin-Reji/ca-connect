import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oauth2-code-pkce";
import { store } from "./store/store"; // your Redux store
import HomePage from "./components/HomePage";
import StudyMaterials from "./components/pages/StudyMaterials";
import Mentorship from "./components/pages/Mentorship";
import Community from "./components/pages/Community";
import CreateProfileForm from "./components/pages/CreateprofileForm";
import UserProfileRouter from "./components/pages/UserProfileRouter";
import NearestUsersPage from "./components/pages/NearestUserPage";
import ChatPage from "./components/pages/ChatPage";

// ─── OAuth2 / PKCE Config ─────────────────────────────────────────────────────
// Replace these values with your actual OAuth provider details
const authConfig = {
  clientId: "ca-connect",              // e.g. "ca-connect-web"
  authorizationEndpoint: "http://localhost:8090/realms/ca-connect/protocol/openid-connect/auth",
  tokenEndpoint: "http://localhost:8090/realms/ca-connect/protocol/openid-connect/token",
  redirectUri: window.location.origin,     // e.g. http://localhost:3000
  scope: "openid profile email",
  onRefreshTokenExpire: (event) => event.logIn(), // auto re-login on refresh expiry
};

function App() {
  return (
    // 1. Redux store wraps everything
    <Provider store={store}>
      {/* 2. OAuth2 PKCE provider wraps Router so AuthContext is available everywhere */}
      <AuthProvider authConfig={authConfig}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes here */}
            <Route
              path="/study-materials"
              element={
                <StudyMaterials />
              }
            />
            {/* mentorship */}
            <Route
              path="/mentorship"
              element={
                <Mentorship />
              }
            />
            {/* community */}
            <Route
              path="/community"
              element={
                <Community />
              }
            />
            {/* create- profile */}
            <Route
              path="/create-profile"
              element={
                <CreateProfileForm />
              }
            />

            {/* - view user */}
            <Route
              path="/view-user"
              element={
                <UserProfileRouter />
              }
            />

            {/* - view user */}
            <Route
              path="/nearby"
              element={
                <NearestUsersPage />
              }
            />

            {/* - view user */}
            <Route
              path="/chat/:userId"
              element={<ChatPage />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;