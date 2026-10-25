import React, { useState, useEffect, useRef } from 'react';
import '../styles/AuthScreen.css';

export default function AuthScreen({ onVoiceSuccess, onUsernameSuccess, onVipCheck }) {
  const [mode, setMode] = useState(null); // null | 'voice' | 'username' | 'vip_direct'
  const [usernameInput, setUsernameInput] = useState('');
  const [vipInput, setVipInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Tap mic & speak secret command');
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase();
        verifyVoice(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        verifyVoice('');
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [attempts]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatusMsg('Speech recognition not supported in this browser.');
      return;
    }
    setIsListening(true);
    setStatusMsg('Listening...');
    recognitionRef.current.start();
  };

  const verifyVoice = (spokenText) => {
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);

    if (nextAttempt >= 3) {
      setStatusMsg('Access Granted (Override)');
      setTimeout(() => onVoiceSuccess(), 800);
      return;
    }

    const SECRET_PHRASE = 'secret toddy';
    if (spokenText.includes(SECRET_PHRASE)) {
      setStatusMsg('Voice Verified. Welcome VIP.');
      setTimeout(() => onVoiceSuccess(), 800);
    } else {
      setStatusMsg(`Incorrect phrase. Attempt ${nextAttempt}/2 failed.`);
    }
  };

  // Standard Username Form Submit
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) onUsernameSuccess(usernameInput);
  };

  // VIP Quick-Button Submit (Queries Backend)
  const handleVipSubmit = async (e) => {
    e.preventDefault();
    if (!vipInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: vipInput })
      });
      const data = await response.json();

      setLoading(false);
      // Callback to parent to handle routing (Registered -> VIP Home, Unregistered -> Details Form)
      onVipCheck(vipInput, data.isRegistered);
    } catch (err) {
      console.error('Backend connection failed:', err);
      setLoading(false);
      // Fallback behavior if backend server is offline
      onVipCheck(vipInput, false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* VIP Circle Badge Button on Top Right Corner */}
        <button 
          className="vip-circle-btn" 
          title="VIP Member Direct Access"
          onClick={() => setMode('vip_direct')}
        >
          VIP
        </button>

        <h2>TS252</h2>
        <div className="red-underline"></div>

        {!mode ? (
          <div className="auth-options">
            <button className="btn-red" onClick={() => setMode('voice')}>
              🎤 Enter via Voice (VIP)
            </button>
            <button className="btn-outline" onClick={() => setMode('username')}>
              👤 Enter via Username
            </button>
          </div>
        ) : mode === 'voice' ? (
          <div className="voice-section">
            <p className="status-label">{statusMsg}</p>
            <button 
              className={`mic-trigger ${isListening ? 'active' : ''}`} 
              onClick={startListening}
              disabled={isListening}
            >
              {isListening ? '🎙 Listening...' : 'Speak Now'}
            </button>
            <button className="btn-back" onClick={() => setMode(null)}>← Back</button>
          </div>
        ) : mode === 'username' ? (
          <form className="username-form" onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              placeholder="Username or Mobile"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-red">Proceed</button>
            <button type="button" className="btn-back" onClick={() => setMode(null)}>← Back</button>
          </form>
        ) : (
          /* VIP Direct Entry Form */
          <form className="username-form" onSubmit={handleVipSubmit}>
            <p className="vip-form-subtitle">VIP Fast-Track Verification</p>
            <input
              type="text"
              placeholder="Enter Mobile / Username"
              value={vipInput}
              onChange={(e) => setVipInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-red" disabled={loading}>
              {loading ? 'Checking...' : 'Verify VIP Access'}
            </button>
            <button type="button" className="btn-back" onClick={() => setMode(null)}>← Back</button>
          </form>
        )}
      </div>
    </div>
  );
}