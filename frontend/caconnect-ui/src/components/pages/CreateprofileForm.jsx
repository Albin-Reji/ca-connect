import { useState, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useNavigate } from "react-router-dom";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0a1628;
    --navy2: #0f2040;
    --navy3: #162a50;
    --gold: #c9a84c;
    --gold2: #e8c97a;
    --gold3: #f5dfa0;
    --slate: #1e3a5f;
    --muted: #7a8fa6;
    --white: #ffffff;
    --card-bg: #0d1e38;
    --border: rgba(201,168,76,0.2);
    --border-subtle: rgba(255,255,255,0.08);
    --red: #ef4444;
    --green: #10b981;
    --font-head: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .cp-page {
    min-height: 100vh;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--slate) 0%, var(--navy) 70%);
    font-family: var(--font-body);
    color: var(--white);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 60px 24px 80px;
  }

  .cp-shell {
    width: 100%;
    max-width: 640px;
    animation: fadeUp 0.6s ease both;
  }

  /* ── Back Button ── */
  .cp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
  }
  .cp-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50px;
    padding: 10px 20px 10px 14px;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.75);
    transition: all 0.22s ease;
  }
  .cp-back-btn:hover {
    background: rgba(201,168,76,0.1);
    border-color: var(--gold);
    color: var(--gold);
    transform: translateX(-3px);
    box-shadow: 0 4px 20px rgba(201,168,76,0.15);
  }
  .cp-back-btn:active { transform: translateX(-1px); }
  .cp-back-arrow {
    display: flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    font-size: 13px; flex-shrink: 0;
    transition: background 0.2s;
  }
  .cp-back-btn:hover .cp-back-arrow { background: rgba(201,168,76,0.2); }

  /* ── Breadcrumb ── */
  .cp-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--muted); font-weight: 500;
  }
  .cp-breadcrumb-sep { opacity: 0.4; }
  .cp-breadcrumb-current { color: var(--gold); font-weight: 600; }

  /* ── Header ── */
  .cp-header { margin-bottom: 32px; }
  .cp-label {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }
  .cp-title {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 900; line-height: 1.1; color: var(--white);
  }
  .cp-title span {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold3) 50%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
  .cp-subtitle { font-size: 14px; color: var(--muted); margin-top: 10px; line-height: 1.6; }

  /* ── Alerts ── */
  .cp-alert {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 18px; border-radius: 14px; margin-bottom: 20px;
    font-size: 14px; font-weight: 500; line-height: 1.5;
    animation: fadeUp 0.4s ease both;
  }
  .cp-alert.success {
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.3);
    color: #6ee7b7;
  }
  .cp-alert.error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5;
  }
  .cp-alert-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }

  /* ── Form Card ── */
  .cp-card {
    background: rgba(13,30,56,0.8);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 36px 40px;
    backdrop-filter: blur(14px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.4);
  }

  /* ── Section Dividers ── */
  .cp-section-label {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--gold);
    margin: 28px 0 18px;
  }
  .cp-section-label:first-of-type { margin-top: 0; }
  .cp-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border);
  }

  /* ── Field Grids ── */
  .cp-grid-2   { display: grid; grid-template-columns: 1fr 1fr;     gap: 16px; }
  .cp-grid-1-2 { display: grid; grid-template-columns: 1fr 2fr;     gap: 16px; }
  .cp-grid-3   { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ── Field ── */
  .cp-field { display: flex; flex-direction: column; gap: 7px; }
  .cp-field-label {
    font-size: 12px; font-weight: 600;
    color: rgba(255,255,255,0.6); letter-spacing: 0.3px;
  }
  .err-msg { font-weight: 400; color: #fca5a5; margin-left: 4px; }

  .cp-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-subtle);
    border-radius: 10px; padding: 10px 14px;
    font-size: 14px; font-family: var(--font-body);
    color: var(--white); outline: none; width: 100%;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .cp-input::placeholder { color: rgba(255,255,255,0.22); }
  .cp-input:focus {
    border-color: var(--gold);
    background: rgba(201,168,76,0.06);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }
  .cp-input.has-error {
    border-color: rgba(239,68,68,0.6);
    background: rgba(239,68,68,0.05);
  }
  .cp-input.has-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
  .cp-input[type=number]::-webkit-inner-spin-button,
  .cp-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  .cp-input[type=number] { -moz-appearance: textfield; }

  /* ── Select ── */
  .cp-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-subtle);
    border-radius: 10px; padding: 10px 14px;
    font-size: 14px; font-family: var(--font-body);
    color: var(--white); outline: none; cursor: pointer; width: 100%;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8fa6' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }
  .cp-select option { background: var(--navy2); color: var(--white); }
  .cp-select:focus {
    border-color: var(--gold);
    background-color: rgba(201,168,76,0.06);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }
  .cp-select.has-error { border-color: rgba(239,68,68,0.6); }

  /* ── Actions ── */
  .cp-actions {
    display: flex; gap: 12px; margin-top: 32px;
    padding-top: 24px; border-top: 1px solid var(--border-subtle);
  }
  .cp-btn-submit {
    flex: 1;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: var(--navy); font-family: var(--font-body);
    font-weight: 700; font-size: 15px;
    padding: 13px 28px; border: none; border-radius: 50px;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.35);
  }
  .cp-btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201,168,76,0.5);
  }
  .cp-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cp-btn-reset {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent; color: rgba(255,255,255,0.6);
    font-family: var(--font-body); font-weight: 600; font-size: 14px;
    padding: 13px 24px;
    border: 1.5px solid rgba(255,255,255,0.15); border-radius: 50px;
    cursor: pointer; transition: all 0.2s;
  }
  .cp-btn-reset:hover { border-color: var(--gold); color: var(--gold); }

  .cp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(10,22,40,0.3);
    border-top-color: var(--navy); border-radius: 50%;
    animation: spin 0.75s linear infinite; display: inline-block;
  }

  @media (max-width: 580px) {
    .cp-card { padding: 28px 20px; }
    .cp-grid-2, .cp-grid-1-2, .cp-grid-3 { grid-template-columns: 1fr; }
    .cp-actions { flex-direction: column; }
    .cp-btn-submit, .cp-btn-reset { width: 100%; }
    .cp-breadcrumb { display: none; }
  }
`;

const EXAM_STAGES = [
    { value: "FOUNDATION",   label: "Foundation"  },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "FINAL",        label: "Final"        },
    { value: "ARTICLESHIP",  label: "Articleship"  },
    { value: "QUALIFIED",    label: "Qualified CA" },
];

const INIT = {
    fullName: "", age: "", examStage: "",
    streetAddress: "", city: "", state: "", country: "",
    email: "", phoneNumber: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(f) {
    const e = {};
    if (!f.fullName.trim()) e.fullName = "Required";
    if (!f.age) e.age = "Required";
    else if (f.age < 16 || f.age > 70) e.age = "Must be 16–70";
    if (!f.examStage) e.examStage = "Required";
    if (!f.city.trim()) e.city = "Required";
    if (!f.state.trim()) e.state = "Required";
    if (!f.country.trim()) e.country = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Invalid email";
    if (!f.phoneNumber.trim()) e.phoneNumber = "Required";
    else if (!/^[6-9]\d{9}$/.test(f.phoneNumber.replace(/\s+/g, "")))
        e.phoneNumber = "Must be a valid 10-digit Indian mobile";
    return e;
}

// ─── F — outside component to prevent remount bug ────────────────────────────
function F({ label, name, type = "text", form, errors, onChange, ...rest }) {
    return (
        <div className="cp-field">
            <label className="cp-field-label">
                {label}
                {errors[name] && <span className="err-msg">— {errors[name]}</span>}
            </label>
            <input
                className={`cp-input ${errors[name] ? "has-error" : ""}`}
                type={type}
                value={form[name]}
                onChange={onChange(name)}
                {...rest}
            />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateProfileForm() {
    const [form, setForm]           = useState(INIT);
    const [errors, setErrors]       = useState({});
    const [status, setStatus]       = useState(null);
    const [serverMsg, setServerMsg] = useState("");

    const { token, tokenData } = useContext(AuthContext);
    const navigate             = useNavigate();

    const set = (field) => (e) => {
        setForm((p)   => ({ ...p, [field]: e.target.value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setStatus("loading");
        try {
            const requestBody = {
                keyCloakId:  tokenData.sub,
                fullName:    form.fullName.trim(),
                age:         Number(form.age),
                examStage:   form.examStage,
                address: {
                    city:    form.city.trim(),
                    state:   form.state.trim(),
                    country: form.country.trim(),
                },
                email:       form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
            };

            console.log("Sending profile creation request:", requestBody);
            console.log("Auth token present:", !!token);

            const res = await fetch("http://localhost:8080/api/profiles/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                let errorMessage;
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } else {
                    errorMessage = await res.text();
                }
                console.error("Server error details:", {
                    status: res.status,
                    statusText: res.statusText,
                    message: errorMessage,
                });
                throw new Error(errorMessage || `HTTP ${res.status} - ${res.statusText}`);
            }

            const data = await res.json();
            setStatus("success");
            setServerMsg(`Profile created! userId: ${data.keyCloakId}`);
            setForm(INIT);
        } catch (err) {
            setStatus("error");
            setServerMsg(err.message);
        }
    };

    const fieldProps = { form, errors, onChange: set };

    return (
        <>
            <style>{css}</style>
            <div className="cp-page">
                <div className="cp-shell">

                    {/* ── Top Bar ── */}
                    <div className="cp-topbar">
                        <button className="cp-back-btn" onClick={() => navigate(-1)}>
                            <span className="cp-back-arrow">←</span>
                            <span>Back</span>
                        </button>
                        <nav className="cp-breadcrumb">
                            <span>Home</span>
                            <span className="cp-breadcrumb-sep">›</span>
                            <span>Dashboard</span>
                            <span className="cp-breadcrumb-sep">›</span>
                            <span className="cp-breadcrumb-current">Create Profile</span>
                        </nav>
                    </div>

                    {/* ── Header ── */}
                    <div className="cp-header">
                        <div className="cp-label">🎓 CA Connect</div>
                        <h1 className="cp-title">
                            Create Your <span>Profile</span>
                        </h1>
                        <p className="cp-subtitle">
                            Set up your CA Connect profile to connect with mentors, find study partners, and unlock resources.
                        </p>
                    </div>

                    {/* ── Alerts ── */}
                    {status === "success" && (
                        <div className="cp-alert success">
                            <span className="cp-alert-icon">✅</span>
                            <span>{serverMsg}</span>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="cp-alert error">
                            <span className="cp-alert-icon">⚠️</span>
                            <span>{serverMsg}</span>
                        </div>
                    )}

                    {/* ── Form Card ── */}
                    <div className="cp-card">
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>

                            {/* Basic Info */}
                            <div className="cp-section-label">👤 Basic Info</div>
                            <F label="Full Name" name="fullName" placeholder="Priya Sharma" {...fieldProps} />

                            <div className="cp-grid-1-2" style={{ marginTop: 16 }}>
                                <F label="Age" name="age" type="number" placeholder="22" min={16} max={70} {...fieldProps} />
                                <div className="cp-field">
                                    <label className="cp-field-label">
                                        Exam Stage
                                        {errors.examStage && <span className="err-msg">— {errors.examStage}</span>}
                                    </label>
                                    <select
                                        className={`cp-select ${errors.examStage ? "has-error" : ""}`}
                                        value={form.examStage}
                                        onChange={set("examStage")}
                                    >
                                        <option value="">— Select Stage —</option>
                                        {EXAM_STAGES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="cp-section-label" style={{ marginTop: 28 }}>📞 Contact</div>
                            <div className="cp-grid-2">
                                <F label="Email"        name="email"       type="email" placeholder="priya@example.com" {...fieldProps} />
                                <F label="Phone Number" name="phoneNumber" type="tel"   placeholder="9876543210"        {...fieldProps} />
                            </div>

                            {/* Location */}
                            <div className="cp-section-label" style={{ marginTop: 28 }}>📍 Location</div>
                            <div className="cp-grid-3">
                                <F label="City"    name="city"    placeholder="Mumbai"      {...fieldProps} />
                                <F label="State"   name="state"   placeholder="Maharashtra" {...fieldProps} />
                                <F label="Country" name="country" placeholder="India"       {...fieldProps} />
                            </div>

                            {/* Actions */}
                            <div className="cp-actions">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="cp-btn-submit"
                                >
                                    {status === "loading"
                                        ? <><span className="cp-spinner" /> Submitting…</>
                                        : "Create Profile →"}
                                </button>
                                <button
                                    type="button"
                                    className="cp-btn-reset"
                                    onClick={() => { setForm(INIT); setErrors({}); setStatus(null); }}
                                >
                                    Reset
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}