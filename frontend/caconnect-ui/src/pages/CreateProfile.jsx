/**
 * CreateProfile.jsx
 * ─────────────────────────────────────────────────────────────────
 * Form page for creating a new CAConnect user profile.
 * Integrates with POST /api/profiles/
 *
 * Validation rules:
 *  - userId, fullName, age, examStage, city, state, country,
 *    email, phoneNumber are all required.
 *  - Age must be 16–70.
 *  - Email must be valid format.
 *  - Phone must be a valid 10-digit Indian mobile number.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../api/profileApi';
import { useApp } from '../context/AppContext';
import { Field, Input, Select } from '../components/ui/FormField';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { EXAM_STAGES, isValidEmail, isValidPhone } from '../utils/helpers';

const STAGE_OPTIONS = EXAM_STAGES.map((s) => ({ value: s.value, label: `${s.icon} ${s.label}` }));

// ── Initial form state ────────────────────────────────────────────
const INITIAL = {
  userId: '', fullName: '', age: '', examStage: '',
  streetAddress: '', city: '', state: '', country: '',
  email: '', phoneNumber: '',
};

// ── Validation ────────────────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.userId.trim())     errs.userId     = 'User ID is required';
  if (!form.fullName.trim())   errs.fullName   = 'Full name is required';

  const age = Number(form.age);
  if (!form.age)               errs.age        = 'Age is required';
  else if (age < 16 || age > 70) errs.age = 'Age must be between 16 and 70';

  if (!form.examStage)         errs.examStage  = 'Please select your exam stage';
  if (!form.city.trim())       errs.city       = 'City is required';
  if (!form.state.trim())      errs.state      = 'State is required';
  if (!form.country.trim())    errs.country    = 'Country is required';

  if (!form.email.trim())      errs.email      = 'Email is required';
  else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address';

  if (!form.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
  else if (!isValidPhone(form.phoneNumber)) errs.phoneNumber = 'Enter a valid 10-digit Indian mobile number';

  return errs;
}

// ── Section heading ───────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 20, marginTop: 8 }}>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.1rem',
        color: 'var(--navy)', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {children}
      </h3>
      <div style={{ height: 2, background: 'linear-gradient(90deg, var(--amber), transparent)', marginTop: 6, borderRadius: 2 }} />
    </div>
  );
}

export default function CreateProfile() {
  const { showToast, setUserId } = useApp();
  const navigate = useNavigate();

  const [form, setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: form.userId.trim(),
        fullName: form.fullName.trim(),
        age: Number(form.age),
        examStage: form.examStage,
        address: {
          streetAddress: form.streetAddress.trim() || null,
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
        },
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
      };

      const profile = await createProfile(payload);
      setUserId(profile.userId || form.userId.trim());
      setSubmitted(true);
      showToast('Profile created successfully! 🎉', 'success');
      setTimeout(() => navigate(`/profile/${profile.userId || form.userId.trim()}`), 1200);
    } catch (err) {
      showToast(err.message || 'Failed to create profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeUp 0.5s ease' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', marginBottom: 8 }}>
          Profile Created!
        </h2>
        <p style={{ color: 'var(--slate)' }}>Redirecting you to your profile…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }} className="fade-up">
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Join the Network
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--navy)', lineHeight: 1.15 }}>
          Create Your Profile
        </h1>
        <p style={{ color: 'var(--slate)', marginTop: 12, maxWidth: 480 }}>
          Set up your CAConnect profile to discover other CA exam candidates studying near you.
        </p>
      </div>

      <Card style={{ padding: '36px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* ── Basic Info ── */}
          <SectionTitle>👤 Basic Information</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Field label="User ID" required error={errors.userId} hint="Unique identifier (from auth service)">
              <Input value={form.userId} onChange={set('userId')} placeholder="e.g. user_abc123" error={errors.userId} />
            </Field>
            <Field label="Full Name" required error={errors.fullName}>
              <Input value={form.fullName} onChange={set('fullName')} placeholder="Priya Sharma" error={errors.fullName} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 18 }}>
            <Field label="Age" required error={errors.age}>
              <Input type="number" value={form.age} onChange={set('age')} placeholder="24" min={16} max={70} error={errors.age} />
            </Field>
            <Field label="Exam Stage" required error={errors.examStage}>
              <Select
                value={form.examStage}
                onChange={set('examStage')}
                options={STAGE_OPTIONS}
                placeholder="— Select your stage —"
                error={errors.examStage}
              />
            </Field>
          </div>

          {/* ── Contact ── */}
          <SectionTitle>📬 Contact Details</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Field label="Email" required error={errors.email}>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="priya@example.com" error={errors.email} />
            </Field>
            <Field label="Phone Number" required error={errors.phoneNumber} hint="10-digit Indian mobile">
              <Input type="tel" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+91 98765 43210" error={errors.phoneNumber} />
            </Field>
          </div>

          {/* ── Address ── */}
          <SectionTitle>📍 Address</SectionTitle>
          <Field label="Street Address" error={errors.streetAddress} hint="Optional — used for precise geolocation">
            <Input value={form.streetAddress} onChange={set('streetAddress')} placeholder="123 MG Road" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
            <Field label="City" required error={errors.city}>
              <Input value={form.city} onChange={set('city')} placeholder="Mumbai" error={errors.city} />
            </Field>
            <Field label="State" required error={errors.state}>
              <Input value={form.state} onChange={set('state')} placeholder="Maharashtra" error={errors.state} />
            </Field>
            <Field label="Country" required error={errors.country}>
              <Input value={form.country} onChange={set('country')} placeholder="India" error={errors.country} />
            </Field>
          </div>

          {/* ── Geocoding notice ── */}
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 'var(--radius-sm)', padding: '12px 16px',
            fontSize: '0.8rem', color: 'var(--slate)', display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span>🌐</span>
            <span>Your address will be geocoded using OpenCage to help match you with nearby peers. Location data is stored securely.</span>
          </div>

          {/* ── Submit ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setForm(INITIAL)} disabled={loading}>
              Reset
            </Button>
            <Button variant="primary" size="lg" loading={loading} onClick={handleSubmit}>
              Create Profile →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}