import React from 'react';
import '../styles/StandardBooking.css';

export default function StandardBooking({ onBack }) {
  return (
    <div className="std-book-container">
      <div className="std-book-card">
        <h2>TS-252 Express Booking</h2>
        <p>Order fresh Toddy for pickup or delivery</p>

        {/* Simplified View: Only the Resy Button / Icon */}
        <div className="resy-action-container" style={{ margin: '30px 0' }}>
          <button 
            className="btn-red action-btn"
            onClick={() => alert('Resy action triggered!')}
            style={{ width: '100%', padding: '16px', fontSize: '1rem', cursor: 'pointer' }}
          >
            📅 Resy
          </button>
        </div>

        <button className="btn-back" onClick={onBack}>← Return to Main Hub</button>
      </div>
    </div>
  );
}