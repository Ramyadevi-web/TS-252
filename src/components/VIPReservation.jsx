import React, { useState } from 'react';
import '../styles/VIPReservation.css';

export default function VIPReservation({ onBack }) {
  const [resvData, setResvData] = useState({ date: '', time: '', guests: '2', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleReservation = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="vip-resv-container">
      <div className="vip-resv-card">
        <h2>👑 VIP Reservation</h2>
        <p>Exclusive Private Seating at TS-252</p>

        {!submitted ? (
          <form onSubmit={handleReservation} className="vip-resv-form">
            <div className="input-group">
              <label>Date</label>
              <input 
                type="date" 
                required 
                onChange={(e) => setResvData({ ...resvData, date: e.target.value })} 
              />
            </div>
            <div className="input-group">
              <label>Preferred Time Slot</label>
              <input 
                type="time" 
                required 
                onChange={(e) => setResvData({ ...resvData, time: e.target.value })} 
              />
            </div>
            <div className="input-group">
              <label>Number of VIP Guests</label>
              <select 
                value={resvData.guests}
                onChange={(e) => setResvData({ ...resvData, guests: e.target.value })}
              >
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="4">4 Persons</option>
                <option value="6+">6+ (Private Booth)</option>
              </select>
            </div>
            <button type="submit" className="btn-red">Confirm Reservation</button>
          </form>
        ) : (
          <div className="success-msg">
            <h3>Reservation Confirmed!</h3>
            <p>Your exclusive VIP table has been secured.</p>
          </div>
        )}

        <button className="btn-back" onClick={onBack}>← Return to VIP Lounge</button>
      </div>
    </div>
  );
}