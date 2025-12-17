'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/storage/authStorage';
import SplashScreen from '@/components/onboarding/SplashScreen';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import FirstOnboardingScreen from '@/components/onboarding/FirstOnboardingScreen';
import SecondOnboardingScreen from '@/components/onboarding/SecondOnboardingScreen';
import ThirdOnboardingScreen from '@/components/onboarding/ThirdOnboardingScreen';

const ONBOARDING_STEPS = [
  {
    title: 'Refresh, Renew, Rejuvenate',
    description: 'Experience the Ultimate Revival of Mind, Body, and Soul',
    design: <FirstOnboardingScreen />,
  },
  {
    title: 'Discover Your Radiance',
    description: 'Unveil the Glow Within and Shine Brighter Than Ever',
    design: <SecondOnboardingScreen />,
  },
  {
    title: 'Unlock Your Inner Goddess',
    description: 'Embrace Your True Power and Beauty with Confidence',
    design: <ThirdOnboardingScreen />,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleSkip = () => {
    // User chose to skip onboarding, don't show again
    authStorage.removeOnboardingFlag();
    router.push('/');
  };

  const handleNext = () => {
    if (currentScreen < ONBOARDING_STEPS.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // After last screen, mark onboarding as completed and go to app
      authStorage.removeOnboardingFlag();
      router.push('/');
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const currentStep = ONBOARDING_STEPS[currentScreen];

  return (
    <OnboardingLayout
      currentStep={currentScreen}
      totalSteps={ONBOARDING_STEPS.length}
      title={currentStep.title}
      description={currentStep.description}
      onNext={handleNext}
      onSkip={handleSkip}
    >
      {currentStep.design}
    </OnboardingLayout>
  );
}

