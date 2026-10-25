import React, { useState } from 'react';
import '../styles/DetailsForm.css';

export default function DetailsForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h3>Visitor Registration</h3>
        <p>Please enter your contact information</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            required
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button type="submit" className="btn-red">Continue to Site</button>
        </form>
      </div>
    </div>
  );
}