'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/onboarding/SplashScreen';
import FirstOnboardingScreen from '@/components/onboarding/FirstOnboardingScreen';
import SecondOnboardingScreen from '@/components/onboarding/SecondOnboardingScreen';
import ThirdOnboardingScreen from '@/components/onboarding/ThirdOnboardingScreen';

export default function OnboardingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleNext = () => {
    // 0 -> first onboarding screen
    // 1 -> second onboarding screen
    // 2 -> third onboarding screen
    if (currentScreen === 0) {
      setCurrentScreen(1);
      return;
    }
    if (currentScreen === 1) {
      setCurrentScreen(2);
      return;
    }
    // After third screen, go to app
    router.push('/');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 0) {
    return <FirstOnboardingScreen onNext={handleNext} onSkip={handleSkip} />;
  }

  if (currentScreen === 1) {
    return <SecondOnboardingScreen onNext={handleNext} onSkip={handleSkip} />;
  }

  return <ThirdOnboardingScreen onNext={handleNext} onSkip={handleSkip} />;
}

