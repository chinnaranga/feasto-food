import { useEffect, useRef } from 'react';
import { useSecurityStore } from '../../store/security/securityStore';

export const useIdleWarning = (idleThresholdSeconds = 600) => {
  const {
    sessionStatus,
    idleTimeRemaining,
    setSessionStatus,
    tickIdleWarning,
    resetIdleTimer,
  } = useSecurityStore();

  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetActivityTimer = () => {
    // 1. Clear any active warning/countdown states
    if (sessionStatus === 'warning' || sessionStatus === 'expired') {
      resetIdleTimer();
    }

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // 2. Set timeout to enter warning state
    activityTimeoutRef.current = setTimeout(() => {
      setSessionStatus('warning');
    }, idleThresholdSeconds * 1000);
  };

  useEffect(() => {
    // Monitor user activities
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      if (sessionStatus !== 'warning' && sessionStatus !== 'expired') {
        resetActivityTimer();
      }
    };

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetActivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [sessionStatus]);

  // Handle warning countdown tick loop
  useEffect(() => {
    if (sessionStatus === 'warning') {
      countdownIntervalRef.current = setInterval(() => {
        tickIdleWarning();
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [sessionStatus, tickIdleWarning]);

  const keepSessionAlive = () => {
    resetIdleTimer();
    resetActivityTimer();
  };

  return {
    isIdleWarningOpen: sessionStatus === 'warning',
    secondsRemaining: idleTimeRemaining,
    keepSessionAlive,
  };
};
