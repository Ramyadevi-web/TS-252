import React, { useState } from 'react';
import '../styles/DetailsForm.css';

export default function DetailsForm({ prefilledMobile, userType, onSubmit }) {
  const [form, setForm] = useState({ 
    name: '', 
    mobile: prefilledMobile || '', 
    email: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userType })
      });
    } catch (err) {
      console.error('Registration API error:', err);
    } finally {
      setLoading(false);
      onSubmit(form);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Visitor Registration</h3>
        <p>Please complete your profile to enter</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            required
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button type="submit" className="btn-red" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Site'}
          </button>
        </form>
      </div>
    </div>
  );
}