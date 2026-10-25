import React from 'react';
import '../styles/ToddyLoader.css';

function ToddyLoader({ onComplete }) {
  return (
    <div className="loader-wrapper">
      <video
        autoPlay
        muted
        playsInline
        className="loader-video"
        onEnded={onComplete}
      >
        <source src="/assets/toddy-pour.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="loader-brand">
        <h1>TS252</h1>
        <div className="red-underline"></div>
      </div>
    </div>
  );
}

export default ToddyLoader;