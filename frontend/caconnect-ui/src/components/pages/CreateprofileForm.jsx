import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";

const EXAM_STAGES = [
    { value: "FOUNDATION", label: "Foundation" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "FINAL", label: "Final" },
    { value: "ARTICLESHIP", label: "Articleship" },
    { value: "QUALIFIED", label: "Qualified CA" },
];

const INIT = {
    userId: "", fullName: "", age: "", examStage: "",
    streetAddress: "", city: "", state: "", country: "",
    email: "", phoneNumber: "",
};

function validate(f) {
    const e = {};
    if (!f.userId.trim()) e.userId = "Required";
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

export default function CreateProfileForm() {
    const [form, setForm] = useState(INIT);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
    const [serverMsg, setServerMsg] = useState("");

    // Access authentication token
    const { token, tokenData } = useContext(AuthContext);

    const set = (field) => (e) => {
        setForm((p) => ({ ...p, [field]: e.target.value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setStatus("loading");
        try {
            const requestBody = {
                keyCloakId:  tokenData.sub, // Use userId from localStorage or fallback to tokenData
                fullName: form.fullName.trim(),
                age: Number(form.age),
                examStage: form.examStage,
                address: {
                    city: form.city.trim(),
                    state: form.state.trim(),
                    country: form.country.trim(),
                },
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
            };

            console.log("Sending profile creation request:", requestBody);
            console.log("Auth token present:", !! token);

            const res = await fetch("http://localhost:8080/api/profiles/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
                    message: errorMessage
                });

                throw new Error(errorMessage || `HTTP ${res.status} - ${res.statusText}`);
            }

            const data = await res.json();
            setStatus("success");
            setServerMsg(`Profile created! userId: ${data.userId}`);
            setForm(INIT);
        } catch (err) {
            setStatus("error");
            setServerMsg(err.message);
        }
    };

    const F = ({ label, name, type = "text", ...rest }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
                {label} {errors[name] && <span style={{ color: "red", fontWeight: 400 }}>— {errors[name]}</span>}
            </label>
            <input
                type={type}
                value={form[name]}
                onChange={set(name)}
                style={{
                    padding: "7px 10px", border: errors[name] ? "1px solid red" : "1px solid #ccc",
                    borderRadius: 6, fontSize: 14, outline: "none",
                }}
                {...rest}
            />
        </div>
    );

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
            <h2 style={{ marginBottom: 24 }}>Create Profile</h2>

            {status === "success" && (
                <div style={{ background: "#d4edda", color: "#155724", padding: "10px 14px", borderRadius: 6, marginBottom: 16 }}>
                    ✅ {serverMsg}
                </div>
            )}
            {status === "error" && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px 14px", borderRadius: 6, marginBottom: 16 }}>
                    ❌ {serverMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                <p style={{ fontWeight: 600, margin: "4px 0 -4px", color: "#333" }}>Basic Info</p>
                <div style={{  gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <F label="Full Name" name="fullName" placeholder="" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                    <F label="Age" name="age" type="number" placeholder="22" min={16} max={70} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
                            Exam Stage {errors.examStage && <span style={{ color: "red", fontWeight: 400 }}>— {errors.examStage}</span>}
                        </label>
                        <select
                            value={form.examStage}
                            onChange={set("examStage")}
                            style={{
                                padding: "7px 10px", border: errors.examStage ? "1px solid red" : "1px solid #ccc",
                                borderRadius: 6, fontSize: 14, background: "#fff",
                            }}
                        >
                            <option value="">— Select —</option>
                            {EXAM_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                <p style={{ fontWeight: 600, margin: "4px 0 -4px", color: "#333" }}>Contact</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <F label="Email" name="email" type="email" placeholder="priya@example.com" />
                    <F label="Phone Number" name="phoneNumber" type="tel" placeholder="9876543210" />
                </div>


                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <F label="City" name="city" placeholder="Mumbai" />
                    <F label="State" name="state" placeholder="Maharashtra" />
                    <F label="Country" name="country" placeholder="India" />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        style={{
                            padding: "9px 24px", background: "#2563eb", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600,
                            cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1,
                        }}
                    >
                        {status === "loading" ? "Submitting…" : "Create Profile"}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setForm(INIT); setErrors({}); setStatus(null); }}
                        style={{
                            padding: "9px 20px", background: "#f1f5f9", color: "#555",
                            border: "1px solid #ccc", borderRadius: 6, fontSize: 14, cursor: "pointer",
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}