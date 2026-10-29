import React, { useState } from 'react';
import ToddyLoader from './components/ToddyPourLoader.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import DetailsForm from './components/DetailsForm.jsx';
import VIPHome from './components/VIPHome.jsx';
import StandardHome from './components/StandardHome.jsx';
import VIPReservation from './components/VIPReservation.jsx';
import StandardBooking from './components/StandardBooking.jsx';
import './app.css';

export default function App() {
  // Steps: LOADER | AUTH | FORM | VIP_HOME | STANDARD_HOME | VIP_RESV | STANDARD_BOOK
  const [step, setStep] = useState('LOADER'); 
  const [authType, setAuthType] = useState('regular'); // 'vip' | 'regular'
  const [prefilledMobile, setPrefilledMobile] = useState('');

  // 1. Voice Route -> Standard Home (per your rule)
  const handleVoiceSuccess = () => {
    setAuthType('regular');
    setStep('STANDARD_HOME');
  };

  // 2. Username Route -> Standard Home (per your rule)
  const handleUsernameSuccess = () => {
    setAuthType('regular');
    setStep('STANDARD_HOME');
  };

  // 3. VIP Circle Button Route -> VIP Home (per your rule)
  const handleVipCheck = (identifier, isRegistered) => {
    setAuthType('vip');
    setPrefilledMobile(identifier);

    if (isRegistered) {
      setStep('VIP_HOME');
    } else {
      setStep('FORM');
    }
  };

  // 4. Form Completion Route based on user type
  const handleFormComplete = () => {
    setStep(authType === 'vip' ? 'VIP_HOME' : 'STANDARD_HOME');
  };

  return (
    <div className="app-container">
      {/* 1. Loader */}
      {step === 'LOADER' && (
        <ToddyLoader onComplete={() => setStep('AUTH')} />
      )}

      {/* 2. Gatekeeper / Authentication */}
      {step === 'AUTH' && (
        <AuthScreen 
          onVoiceSuccess={handleVoiceSuccess} 
          onUsernameSuccess={handleUsernameSuccess} 
          onVipCheck={handleVipCheck}
        />
      )}

      {/* 3. Unregistered User Details Form */}
      {step === 'FORM' && (
        <DetailsForm 
          prefilledMobile={prefilledMobile} 
          userType={authType}
          onSubmit={handleFormComplete} 
        />
      )}

      {/* 4. VIP Flow (VIP Home -> VIP Reservation) */}
      {step === 'VIP_HOME' && (
        <VIPHome onNavigateResv={() => setStep('VIP_RESV')} />
      )}
      {step === 'VIP_RESV' && (
        <VIPReservation onBack={() => setStep('VIP_HOME')} />
      )}

      {/* 5. Standard Flow (Standard Home -> Standard Booking) */}
      {step === 'STANDARD_HOME' && (
        <StandardHome onNavigateBook={() => setStep('STANDARD_BOOK')} />
      )}
      {step === 'STANDARD_BOOK' && (
        <StandardBooking onBack={() => setStep('STANDARD_HOME')} />
      )}
    </div>
  );
}