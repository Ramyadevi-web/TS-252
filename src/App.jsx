import React, { useState } from 'react';
import ToddyLoader from './components/ToddyPourLoader';
import AuthScreen from './components/AuthScreen';
import DetailsForm from './components/DetailsForm';
import VIPHome from './components/VIPHome';
import StandardHome from './components/StandardHome';
import './app.css';

export default function App() {
  const [step, setStep] = useState('LOADER'); // LOADER | AUTH | FORM | VIP_HOME | STANDARD_HOME
  const [authType, setAuthType] = useState(null); // 'voice' | 'username'
  const [isFirstTime, setIsFirstTime] = useState(true); // Toggle based on backend/storage

  const handleVoiceSuccess = () => {
    setAuthType('voice');
    setStep(isFirstTime ? 'FORM' : 'VIP_HOME');
  };

  const handleUsernameSuccess = () => {
    setAuthType('username');
    setStep(isFirstTime ? 'FORM' : 'STANDARD_HOME');
  };

  const handleFormComplete = () => {
    setStep(authType === 'voice' ? 'STANDARD_HOME' : 'VIP_HOME');
  };

  return (
    <div className="app-container">
      {step === 'LOADER' && <ToddyLoader onComplete={() => setStep('AUTH')} />}
      {step === 'AUTH' && (
        <AuthScreen 
          onVoiceSuccess={handleVoiceSuccess} 
          onUsernameSuccess={handleUsernameSuccess} 
        />
      )}
      {step === 'FORM' && <DetailsForm onSubmit={handleFormComplete} />}
      {step === 'VIP_HOME' && <VIPHome />}
      {step === 'STANDARD_HOME' && <StandardHome />}
    </div>
  );
}