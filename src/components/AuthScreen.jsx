import React, { useState, useEffect, useRef } from 'react';
import '../styles/AuthScreen.css'

export default function AuthScreen({ onVoiceSuccess, onUsernameSuccess }) {
  const [mode, setMode] = useState(null); // null | 'voice' | 'username'
  const [usernameInput, setUsernameInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Tap mic & speak secret command');
  
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

    // Rule: Third attempt grants access regardless of speech accuracy
    if (nextAttempt >= 3) {
      setStatusMsg('Access Granted (Override)');
      setTimeout(() => onVoiceSuccess(), 800);
      return;
    }

    const SECRET_PHRASE = 'shop';
    if (spokenText.includes(SECRET_PHRASE)) {
      setStatusMsg('Voice Verified. Welcome.');
      setTimeout(() => onVoiceSuccess(), 800);
    } else {
      setStatusMsg(`Incorrect phrase. Attempt ${nextAttempt}/2 failed.`);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) onUsernameSuccess();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>TS252</h2>
        <div className="red-underline"></div>
        <h3>Saadhanam Kalithu undoo?</h3>

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
        ) : (
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
        )}
      </div>
    </div>
  );
}