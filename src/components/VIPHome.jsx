import React from 'react';
import '../styles/VIPHome.css';

export default function VIPHome({ onNavigateResv }) {
  return (
    <div className="home-screen vip-bg">
      <div className="home-content">
        <h1>👑 TS252 VIP Lounge</h1>
        <p>Exclusive Secret Toddy Experience</p>
        <button className="btn-red action-btn" onClick={onNavigateResv}>
          Resv (Reservation)
        </button>
      </div>
    </div>
  );
}