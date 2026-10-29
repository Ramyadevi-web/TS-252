import React from 'react';
import '../styles/StandardHome.css';

export default function StandardHome({onNavigateBook}) {
  return (
    <div className="home-screen standard-bg">
      <div className="home-content">
        <h1>TS252 Main Hub</h1>
        <p>Welcome to the Toddy Secret Place</p>
        <button className="btn-red action-btn" onClick={onNavigateBook}>Book Now</button>
      </div>
    </div>
  );
}