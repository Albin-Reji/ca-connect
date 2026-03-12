import { useState, useEffect, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import ViewProfilePage from "./ViewProfilePage";
import CreateProfileForm from "./CreateprofileForm";

// ─── Shared CSS vars (spinner only — pages bring their own full CSS) ──────────
const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .upr-page {
    min-height: 100vh;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, #1e3a5f 0%, #0a1628 70%);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
    font-family: 'DM Sans', sans-serif; color: #ffffff;
  }
  .upr-spinner {
    width: 52px; height: 52px;
    border: 3px solid rgba(201,168,76,0.2);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
  .upr-msg { font-size: 14px; color: #7a8fa6; }
  .upr-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 14px; padding: 20px 28px;
    color: #fca5a5; font-size: 14px; text-align: center; max-width: 360px;
  }
`;

export default function UserProfileRouter() {
  const { token, tokenData } = useContext(AuthContext);

  const [status, setStatus] = useState("checking"); // "checking" | "exists" | "new" | "error"
  const [errMsg, setErrMsg] = useState("");

  const keyCloakId = tokenData?.sub;

  useEffect(() => {
    if (!keyCloakId || !token) return;

    fetch(`http://localhost:8080/api/profiles/users/${keyCloakId}/exist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        return res.json();          // returns true or false (Boolean)
      })
      .then(exists => setStatus(exists ? "exists" : "new"))
      .catch(err => { setErrMsg(err.message); setStatus("error"); });
  }, [keyCloakId, token]);

  // ── Render ──────────────────────────────────────────────────────────────────
  if (status === "exists") return <ViewProfilePage />;
  if (status === "new") return <CreateProfileForm />;

  return (
    <>
      <style>{css}</style>
      <div className="upr-page">
        {status === "checking" && (
          <>
            <div className="upr-spinner" />
            <p className="upr-msg">Checking your profile…</p>
          </>
        )}
        {status === "error" && (
          <div className="upr-error">
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Could not check profile</div>
            <div>{errMsg}</div>
          </div>
        )}
      </div>
    </>
  );
}