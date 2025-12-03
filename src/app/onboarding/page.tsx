'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/onboarding/SplashScreen';

export default function OnboardingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNext = () => {
    // TODO: Navigate to next onboarding screen
    // For now, redirect to dashboard when all screens are done
    // setCurrentScreen((prev) => prev + 1);
    router.push('/');
  };

  const handleSkip = () => {
    // Skip entire onboarding and go to dashboard
    router.push('/');
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Onboarding screens will be added here
  // Each screen will be a component similar to SplashScreen
  return null;
}
