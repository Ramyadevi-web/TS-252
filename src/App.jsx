import React, { useState } from 'react';
import ToddyLoader from './components/ToddyPourLoader.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import DetailsForm from './components/DetailsForm.jsx';
import VIPHome from './components/VIPHome.jsx';
import StandardHome from './components/StandardHome.jsx';
import './app.css';

export default function App() {
  const [step, setStep] = useState('LOADER'); // LOADER | AUTH | FORM | VIP_HOME | STANDARD_HOME
  const [authType, setAuthType] = useState('regular'); // 'vip' | 'regular'
  const [prefilledMobile, setPrefilledMobile] = useState('');

  const handleVoiceSuccess = () => {
    setAuthType('vip');
    setStep('VIP_HOME');
  };

  const handleUsernameSuccess = () => {
    setAuthType('regular');
    setStep('STANDARD_HOME');
  };

  // VIP Circle Button routing logic based on backend check
  const handleVipCheck = (identifier, isRegistered) => {
    setAuthType('vip');
    setPrefilledMobile(identifier);

    if (isRegistered) {
      // Direct access to VIP Home for registered members
      setStep('VIP_HOME');
    } else {
      // Route unregistered members to Details Form registration
      setStep('FORM');
    }
  };

  const handleFormComplete = () => {
    setStep(authType === 'vip' ? 'VIP_HOME' : 'STANDARD_HOME');
  };

  return (
    <div className="app-container">
      {step === 'LOADER' && <ToddyLoader onComplete={() => setStep('AUTH')} />}
      {step === 'AUTH' && (
        <AuthScreen 
          onVoiceSuccess={handleVoiceSuccess} 
          onUsernameSuccess={handleUsernameSuccess} 
          onVipCheck={handleVipCheck}
        />
      )}
      {step === 'FORM' && (
        <DetailsForm 
          prefilledMobile={prefilledMobile} 
          userType={authType}
          onSubmit={handleFormComplete} 
        />
      )}
      {step === 'VIP_HOME' && <VIPHome />}
      {step === 'STANDARD_HOME' && <StandardHome />}
    </div>
  );
}