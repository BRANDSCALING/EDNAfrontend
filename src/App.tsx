import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { NewEDNAQuiz } from './components/NewEDNAQuiz';
import { EDNAResults } from './lib/scoring';
import { QuizResults } from './components/QuizResults';
import { EDNAResultsPage } from './components/EDNAResultsPage';
import { LMSDashboard } from './components/LMSDashboard';
import { PersonalizedLMS } from './components/PersonalizedLMS';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AIChat } from './components/AIChat';
import { PersonalizedAIChat } from './components/PersonalizedAIChat';
import { AIMentorHub } from './components/AIMentorHub';
import { ProfileInsights } from './components/ProfileInsights';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AuthScreens } from './components/AuthScreens';
import { EmailVerificationPage } from './components/EmailVerificationPage';
import { CompleteResultsPage } from './components/CompleteResultsPage';
import { PDFResultsPage } from './components/PDFResultsPage';
import { QuizCooldownMessage } from './components/QuizCooldownMessage';
import { SignupPage } from './components/SignupPage';
import { authHelpers } from './utils/supabase/client';
import { checkBackendStatus } from './utils/supabase/backend-status';
import { BACKEND_URL, GHL_CHECKOUT_URL } from './config';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ContactSupport } from './components/ContactSupport';
import { DeleteAccountPage } from './components/DeleteAccountPage';
import { clearAgentToken } from './utils/agentToken';
import { User, FileText, MessageSquare, BookOpen } from 'lucide-react';

interface User {
  email: string;
  name: string;
  id?: string;
}

export default function App() {
  // Safe pathname (avoids SSR "window is not defined" errors)
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // PDF Generation Route - must be first
  if (pathname === '/pdf-results') {
    return <PDFResultsPage />;
  }

  // Test Routes for viewing result pages separately
  if (
    pathname === '/test/alchemist' ||
    pathname === '/test/architect' ||
    pathname === '/test/mixed'
  ) {
    let mockResults: EDNAResults;
    
    if (pathname === '/test/alchemist') {
      mockResults = {
        core_type: 'alchemist',
        core_type_mastery: 85,
        opposite_awareness: { R: 70, T: 65, I: 60, G: 55, C: 50, overall: 60 },
        mirror_awareness_level: 'moderate',
        mirror_awareness_score: 60,
        subtype: ['Visionary Oracle'],
        subtype_mastery: 80,
        subtype_display: 'Visionary Oracle',
        learning_style: {
          dominant: 'Visual',
          percentages: { visual: 40, auditory: 20, readWrite: 20, kinesthetic: 20 },
        },
        neurodiversity: { indicators: ['ADHD'], score: 6 },
        mindset: { traits: ['Growth'], score: 8 },
        personality: { traits: ['Confident'], score: 7 },
      } as unknown as EDNAResults;
    } else if (pathname === '/test/architect') {
      mockResults = {
        core_type: 'architect',
        core_type_mastery: 90,
        opposite_awareness: { R: 75, T: 70, I: 65, G: 60, C: 55, overall: 65 },
        mirror_awareness_level: 'high',
        mirror_awareness_score: 70,
        subtype: ['Master Strategist'],
        subtype_mastery: 85,
        subtype_display: 'Master Strategist',
        learning_style: {
          dominant: 'Kinesthetic',
          percentages: { visual: 25, auditory: 25, readWrite: 25, kinesthetic: 25 },
        },
        neurodiversity: { indicators: [], score: 2 },
        mindset: { traits: ['Growth'], score: 9 },
        personality: { traits: ['Confident'], score: 8 },
      } as unknown as EDNAResults;
    } else {
      // mixed
      mockResults = {
        core_type: 'blurred',
        core_type_mastery: 50,
        opposite_awareness: { R: 50, T: 50, I: 50, G: 50, C: 50, overall: 50 },
        mirror_awareness_level: 'low',
        mirror_awareness_score: 40,
        subtype: ['Mixed'],
        subtype_mastery: 45,
        subtype_display: 'Mixed',
        learning_style: {
          dominant: 'Visual',
          percentages: { visual: 30, auditory: 25, readWrite: 25, kinesthetic: 20 },
        },
        neurodiversity: { indicators: [], score: 4 },
        mindset: { traits: ['Growth'], score: 6 },
        personality: { traits: ['Confident'], score: 5 },
      } as unknown as EDNAResults;
    }
    
    return (
      <CompleteResultsPage
        results={mockResults}
        userEmail="test@example.com"
        isStandalone={true}
      />
    );
  }

  // Signup Route - direct access to registration
  if (pathname === '/signup') {
    return (
      <SignupPage
        onSuccess={() => {
          // Mark that user just signed up - will show onboarding flow after auth
          localStorage.setItem('justSignedUp', 'true');
          // Clear onboarding flag so user sees the onboarding flow
          localStorage.removeItem('edna-onboarding-completed');
        }}
      />
    );
  }

  // Reset Password Route - for password reset flow
  const isResetPasswordRoute =
    pathname === '/reset-password' || pathname === '/reset-password/';
  
  if (isResetPasswordRoute) {
    return <ResetPasswordPage />;
  }

  // Privacy Policy Route - direct access for iOS App Store
  if (pathname === '/privacy-policy' || pathname === '/privacy-policy/') {
    return (
      <div className="min-h-screen bg-white">
        <PrivacyPolicy onViewChange={(view) => {
          window.location.href = view === 'home' ? '/' : `/${view}`;
        }} />
      </div>
    );
  }

  // Terms of Service Route - direct access for iOS App Store
  if (pathname === '/termsandservices' || pathname === '/termsandservices/' || pathname === '/terms-of-service' || pathname === '/terms-of-service/') {
    return (
      <div className="min-h-screen bg-white">
        <TermsOfService onViewChange={(view) => {
          window.location.href = view === 'home' ? '/' : `/${view}`;
        }} />
      </div>
    );
  }

  // Contact & Support Route - direct access
  if (pathname === '/contact' || pathname === '/contact/') {
    return (
      <div className="min-h-screen bg-white">
        <ContactSupport onViewChange={(view) => {
          window.location.href = view === 'home' ? '/' : `/${view}`;
        }} />
      </div>
    );
  }

  // Account deletion (Google Play web link) — public, no login
  if (pathname === '/delete-account' || pathname === '/delete-account/') {
    return (
      <div className="min-h-screen bg-white">
        <DeleteAccountPage
          onViewChange={(view) => {
            window.location.href = view === 'home' ? '/' : `/${view}`;
          }}
        />
      </div>
    );
  }

  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [quizResults, setQuizResults] = useState<EDNAResults | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [showShortResults, setShowShortResults] = useState(false);
  const [activeDashboardView, setActiveDashboardView] = useState<string>('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showShortResultsRef = useRef(false);
  const [quizCompletedAt, setQuizCompletedAt] = useState<Date | null>(null);

  // Memoize backend URL to avoid redeclaration issues (React best practice)
  const backendUrl = useMemo(() => {
    return BACKEND_URL.replace(/\/+$/, ''); // Remove trailing slashes
  }, []);

  // Sync ref with state
  useEffect(() => {
    showShortResultsRef.current = showShortResults;
  }, [showShortResults]);

  useEffect(() => {
    // Restore pending quiz results from localStorage if they exist
    const pendingResults = localStorage.getItem('pendingQuizResults');
    const pendingEmail = localStorage.getItem('pendingVerifiedEmail');
    
    if (pendingResults && pendingEmail) {
      try {
        const results = JSON.parse(pendingResults);
        if (results && typeof results === 'object' && results.core_type) {
          setQuizResults(results);
          setVerifiedEmail(pendingEmail);
          setShowShortResults(true);
          showShortResultsRef.current = true;
          console.log('✅ Restored pending quiz results from localStorage');
        } else {
          console.warn(
            '⚠️ Invalid quiz results format in localStorage, clearing...',
          );
          localStorage.removeItem('pendingQuizResults');
          localStorage.removeItem('pendingVerifiedEmail');
        }
      } catch (err) {
        console.error('⚠️ Failed to restore quiz results:', err);
        localStorage.removeItem('pendingQuizResults');
        localStorage.removeItem('pendingVerifiedEmail');
      }
    }

    // Restore quiz completion timestamp from localStorage
    const savedQuizCompletedAt = localStorage.getItem('quizCompletedAt');
    if (savedQuizCompletedAt) {
      try {
        const completedDate = new Date(savedQuizCompletedAt);
        if (!isNaN(completedDate.getTime())) {
          setQuizCompletedAt(completedDate);
          console.log(
            '✅ Restored quiz completion timestamp from localStorage:',
            completedDate,
          );
        }
      } catch (err) {
        console.error('⚠️ Failed to restore quiz completion timestamp:', err);
        localStorage.removeItem('quizCompletedAt');
      }
    }

    // Check backend status (non-blocking, just for logging)
    checkBackendStatus();
    
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authHelpers.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          setUser(null);
          setIsAuthenticated(false);
          if (!showShortResultsRef.current) {
            setQuizResults(null);
          }
          console.log('👋 User signed out');
        }
      }
      
      if (session?.user) {
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          id: session.user.id,
        });
        setIsAuthenticated(true);
        
        // Check if user just signed up - show onboarding first
        const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
        if (justSignedUp) {
          localStorage.removeItem('justSignedUp');
          // Clear onboarding flag so user sees the onboarding flow
          localStorage.removeItem('edna-onboarding-completed');
          // Show onboarding flow first, then quiz
          setShowOnboarding(true);
          // Don't load quiz results for new signups - they need to take the quiz first
          return; // Exit early
        } else {
          // If user is authenticated and on home page, redirect to dashboard
          setCurrentView((prevView) => {
            if (prevView === 'home') {
              return 'dashboard';
            }
            return prevView;
          });
        }

        // Check localStorage first for immediate results (before async backend call)
        if (session.user.email) {
          const normalizedEmail = session.user.email.toLowerCase().trim();
          const savedResults = localStorage.getItem(`quizResults_${normalizedEmail}`);
          const savedQuizCompletedAt = localStorage.getItem('quizCompletedAt');
          
          if (savedResults) {
            try {
              const results = JSON.parse(savedResults);
              if (results && results.core_type) {
                setQuizResults(results);
                console.log('✅ Restored quiz results from localStorage immediately (auth change)');
                
                if (savedQuizCompletedAt) {
                  try {
                    const completedDate = new Date(savedQuizCompletedAt);
                    if (!isNaN(completedDate.getTime())) {
                      setQuizCompletedAt(completedDate);
                    }
                  } catch (e) {
                    // ignore
                  }
                }
              }
            } catch (e) {
              console.error('Failed to parse saved results:', e);
            }
          }
        }
        
        // Then try to load from backend (will update if newer data exists)
        if (session.user.email) {
          await loadUserQuizResults(session.user.email).catch((err) => {
            console.log(
              '⚠️ Failed to load quiz results on auth state change:',
              err,
            );
          });
        }
      } else if (event !== 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        if (!showShortResultsRef.current) {
          setQuizResults(null);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    setIsLoadingAuth(true);
    
    try {
      const { session, error } = await authHelpers.getSession();
      
      if (error) {
        console.log('⚠️ Session check error (handled):', error.message);
        setUser(null);
        setIsAuthenticated(false);
        if (!showShortResultsRef.current) {
          setQuizResults(null);
        }
        setIsLoadingAuth(false);
        return;
      }
      
      if (session?.user) {
        console.log('✅ Session restored for:', session.user.email);
        
        // Check if user just signed up - show onboarding first
        const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
        if (justSignedUp) {
          // User just signed up, show onboarding flow
          localStorage.removeItem('justSignedUp');
          // Clear onboarding flag so user sees the onboarding flow
          localStorage.removeItem('edna-onboarding-completed');
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
            id: session.user.id,
        });
        setIsAuthenticated(true);
          setShowOnboarding(true);
          setIsLoadingAuth(false);
          return; // Exit early - don't load results
        }
        
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          id: session.user.id,
        });
        setIsAuthenticated(true);
        
        // Check localStorage first for immediate results (before async backend call)
        if (session.user.email) {
          const normalizedEmail = session.user.email.toLowerCase().trim();
          const savedResults = localStorage.getItem(`quizResults_${normalizedEmail}`);
          const savedQuizCompletedAt = localStorage.getItem('quizCompletedAt');
          
          if (savedResults) {
            try {
              const results = JSON.parse(savedResults);
              if (results && results.core_type) {
                setQuizResults(results);
                console.log('✅ Restored quiz results from localStorage immediately');
                
                if (savedQuizCompletedAt) {
                  try {
                    const completedDate = new Date(savedQuizCompletedAt);
                    if (!isNaN(completedDate.getTime())) {
                      setQuizCompletedAt(completedDate);
                    }
                  } catch (e) {
                    // ignore
                  }
                }
              }
            } catch (e) {
              console.error('Failed to parse saved results:', e);
            }
          }
        }
        
        // If user is authenticated and on home page, redirect to dashboard
        if (currentView === 'home') {
          setCurrentView('dashboard');
        }

        // Then try to load from backend (will update if newer data exists)
        if (session.user.email) {
          await loadUserQuizResults(session.user.email).catch((err) => {
            console.log(
              '⚠️ Failed to load quiz results on session restore:',
              err,
            );
          });
        }
      } else {
        console.log('ℹ️ No active session found');
      }
    } catch (err: any) {
      console.log('⚠️ Session check failed:', err.message);
      setUser(null);
      setIsAuthenticated(false);
      if (!showShortResultsRef.current) {
        setQuizResults(null);
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loadUserQuizResults = async (userEmail: string): Promise<boolean> => {
      const normalizedEmail = userEmail.toLowerCase().trim();
      
    try {
      const apiUrl = `${backendUrl}/api/quiz/results-by-email?email=${encodeURIComponent(
        normalizedEmail,
      )}`;
      console.log(`🔍 Loading quiz results from backend for: ${normalizedEmail}`);
      console.log(`🔗 Backend URL: ${backendUrl}`);
      console.log(`🔗 Full API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results) {
          setQuizResults(data.results);
          if (data.createdAt) {
            const completedDate = new Date(data.createdAt);
            setQuizCompletedAt(completedDate);
            localStorage.setItem(
              'quizCompletedAt',
              completedDate.toISOString(),
            );
            localStorage.setItem(
              `quizResults_${normalizedEmail}`,
              JSON.stringify(data.results),
            );
            console.log(
              '✅ Loaded quiz results from backend for',
              normalizedEmail,
              'Completed at:',
              completedDate,
            );
          } else {
            console.log('⚠️ Results loaded but no createdAt timestamp');
          }
          return true;
        } else {
          console.log('ℹ️ Backend returned success but no results data');
          return false;
        }
      } else if (response.status === 404) {
        console.log(
          `❌ No quiz results found in backend for "${normalizedEmail}" (404)`,
        );
        console.log(`   Response status: ${response.status}`);
        try {
          const errorData = await response.json();
          console.log(`   Error details:`, errorData);
        } catch (e) {
          console.log(`   No error details available`);
        }
        return false;
      } else {
        console.error(
          '❌ Backend returned error:',
          response.status,
          response.statusText,
        );
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (err: any) {
      console.error('⚠️ Failed to load quiz results from backend:', err);
      console.error('   Error type:', err.constructor?.name);
      console.error('   Error message:', err.message);
      const savedResults = localStorage.getItem(
        `quizResults_${normalizedEmail}`,
      );
      const savedQuizCompletedAt = localStorage.getItem('quizCompletedAt');
      
      if (savedResults) {
        try {
          const results = JSON.parse(savedResults);
          if (results && results.core_type) {
            setQuizResults(results);
            console.log(
              '✅ Restored quiz results from localStorage (backend unavailable)',
            );
            
            if (savedQuizCompletedAt) {
              try {
                const completedDate = new Date(savedQuizCompletedAt);
                if (!isNaN(completedDate.getTime())) {
                  setQuizCompletedAt(completedDate);
                  console.log(
                    '✅ Restored quiz completion timestamp from localStorage',
                  );
                }
              } catch (e) {
                console.error(
                  'Failed to parse saved cooldown timestamp:',
                  e,
                );
              }
            }
            return true;
          }
        } catch (e) {
          console.error('Failed to parse saved results:', e);
        }
      }
      
      return false;
    }
  };

  const handleAuthenticate = async (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
    setShowShortResults(false);
    
    // Check if user just signed up (was in register mode)
    const justSignedUp = authMode === 'register';
    const savedJustSignedUp = localStorage.getItem('justSignedUp') === 'true';
    const wasJustSignedUp = justSignedUp || savedJustSignedUp;
    
    if (wasJustSignedUp) {
      // Clear onboarding flag so user sees the onboarding flow
      localStorage.removeItem('edna-onboarding-completed');
      localStorage.removeItem('justSignedUp');
      // Show onboarding flow first, then quiz
      setShowOnboarding(true);
      setAuthMode('login'); // Reset auth mode
      return; // Exit early - don't load quiz results
    } else {
      // Immediately redirect to dashboard to avoid showing home page
      setCurrentView('dashboard');
    }

    if (userData.email) {
      let hasResults = false;
      
      const pendingResults = localStorage.getItem('pendingQuizResults');
      if (pendingResults) {
        try {
          const results = JSON.parse(pendingResults);
          if (results && results.core_type) {
            localStorage.setItem(
              `quizResults_${userData.email}`,
              pendingResults,
            );
            console.log(
              '✅ Migrated pending results to email-keyed storage',
            );
          }
        } catch (e) {
          console.error('Failed to migrate pending results:', e);
        }
      }
      
      localStorage.removeItem('pendingQuizResults');
      localStorage.removeItem('pendingVerifiedEmail');
      
      const normalizedEmail = userData.email.toLowerCase().trim();
      
      console.log(`🔍 Login: Loading quiz results for: ${normalizedEmail}`);
      console.log(`🔗 Backend URL: ${backendUrl}`);
      
      const resultsLoaded = await loadUserQuizResults(normalizedEmail);
      hasResults = resultsLoaded;
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      if (!hasResults) {
        const emailKeyed = localStorage.getItem(
          `quizResults_${normalizedEmail}`,
        );
        if (emailKeyed) {
          try {
            const results = JSON.parse(emailKeyed);
            if (results && results.core_type) {
              hasResults = true;
              console.log(
                '✅ Found results in localStorage after backend load',
              );
            }
          } catch (e) {
            // ignore
          }
        }
      }
      
      if (!hasResults) {
        try {
          const apiUrl = `${backendUrl}/api/quiz/results-by-email?email=${encodeURIComponent(
            normalizedEmail,
          )}`;
          console.log(`🔄 Fallback: Trying direct fetch to: ${apiUrl}`);
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.results) {
              setQuizResults(data.results);
              if (data.createdAt) {
                const completedDate = new Date(data.createdAt);
                setQuizCompletedAt(completedDate);
                localStorage.setItem(
                  'quizCompletedAt',
                  completedDate.toISOString(),
                );
                localStorage.setItem(
                  `quizResults_${userData.email}`,
                  JSON.stringify(data.results),
                );
                console.log(
                  '✅ Quiz results loaded via direct fetch for',
                  userData.email,
                );
              }
              hasResults = true;
            }
          } else if (response.status === 404) {
            console.log(
              'ℹ️ No quiz results found in backend for',
              userData.email,
            );
          }
        } catch (err) {
          console.error(
            '⚠️ Backend connection failed, checking localStorage for saved state:',
            err,
          );
        
          const savedQuizCompletedAt =
            localStorage.getItem('quizCompletedAt');
          const savedResults =
            localStorage.getItem(`quizResults_${userData.email}`) ||
                            localStorage.getItem('pendingQuizResults');
        
        if (savedQuizCompletedAt) {
          try {
            const completedDate = new Date(savedQuizCompletedAt);
            if (!isNaN(completedDate.getTime())) {
              setQuizCompletedAt(completedDate);
                console.log(
                  '✅ Restored quiz completion timestamp from localStorage:',
                  completedDate,
                );
            }
          } catch (e) {
              console.error(
                'Failed to parse saved cooldown timestamp:',
                e,
              );
          }
        }
        
        if (savedResults) {
          try {
            const results = JSON.parse(savedResults);
            if (results && results.core_type) {
              setQuizResults(results);
              hasResults = true;
                localStorage.setItem(
                  `quizResults_${userData.email}`,
                  savedResults,
                );
              console.log('✅ Restored quiz results from localStorage');
            }
          } catch (e) {
            console.error('Failed to parse saved results:', e);
          }
        }
      }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const finalResults =
        quizResults ||
        (() => {
          const emailKeyed = localStorage.getItem(
            `quizResults_${userData.email}`,
          );
        if (emailKeyed) {
          try {
            return JSON.parse(emailKeyed);
          } catch (e) {
            return null;
          }
        }
        return null;
      })();
      
      const finalCooldown =
        quizCompletedAt ||
        (() => {
        const saved = localStorage.getItem('quizCompletedAt');
        return saved ? new Date(saved) : null;
      })();
      
      // After signup/login, always go to dashboard
      // Dashboard will show EDNA Profile section (with prompt to take quiz if no results)
      const wasJustSignedUp = justSignedUp || savedJustSignedUp;
      console.log(
        '✅ User authenticated, redirecting to dashboard',
      );
      setCurrentView('dashboard');
    } else {
      // No email - show onboarding
      setShowOnboarding(true);
    }
  };

  const handleLogout = async () => {
    await authHelpers.signOut();
    clearAgentToken();
    setUser(null);
    setIsAuthenticated(false);
    setQuizResults(null);
    setCurrentView('home');
  };

  const handleAuthToggle = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      setShowAuth(true);
    }
  };

  const handleViewChange = (view: string) => {
    if (showShortResults) {
      setShowShortResults(false);
    }

    // If clicking EDNA Quiz button on home page and not authenticated, show signup
    if (view === 'quiz' && !isAuthenticated && currentView === 'home') {
      // Show auth screen in register mode
      setAuthMode('register');
      localStorage.setItem('justSignedUp', 'true'); // Mark that user is signing up from quiz button
      localStorage.removeItem('edna-onboarding-completed'); // Clear flag so onboarding shows
      setShowAuth(true);
      return;
    }

    if (!isAuthenticated && (view === 'dashboard' || view === 'chat')) {
      setShowAuth(true);
      return;
    }

    if (view === 'quiz') {
      const checkDate =
        quizCompletedAt ||
        (() => {
        const saved = localStorage.getItem('quizCompletedAt');
        return saved ? new Date(saved) : null;
      })();
      
      const hasCompletedQuiz =
        quizResults ||
                                localStorage.getItem('pendingQuizResults') ||
        (user?.email &&
          localStorage.getItem(`quizResults_${user.email}`));
      
      if (hasCompletedQuiz && checkDate) {
        const daysSinceCompletion =
          (new Date().getTime() - checkDate.getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysSinceCompletion < 7) {
          const daysRemaining = Math.ceil(7 - daysSinceCompletion);
          console.log(
            `⏳ Quiz cooldown active. ${daysRemaining} days remaining`,
          );
          if (!quizCompletedAt && checkDate) {
            setQuizCompletedAt(checkDate);
          }
          if (!quizResults && user?.email) {
            const savedResults =
              localStorage.getItem(`quizResults_${user.email}`) ||
                                 localStorage.getItem('pendingQuizResults');
            if (savedResults) {
              try {
                const results = JSON.parse(savedResults);
                if (results && results.core_type) {
                  setQuizResults(results);
                  console.log(
                    '✅ Restored quiz results from localStorage for cooldown check',
                  );
                }
              } catch (e) {
                console.error('Failed to parse saved results:', e);
              }
            }
          }
        } else {
          console.log(
            '✅ Quiz cooldown expired, allowing retake',
          );
          setQuizCompletedAt(null);
          localStorage.removeItem('quizCompletedAt');
        }
      }
    }

    if (view === 'quiz' && isAuthenticated && !quizResults) {
      // Check if onboarding was just completed in this session
      const hasSeenOnboarding = localStorage.getItem('edna-onboarding-completed') === 'true';
      if (!hasSeenOnboarding) {
        // Show onboarding for users without quiz results who haven't seen it yet
        setShowOnboarding(true);
        return;
      }
      // If onboarding was completed, proceed to quiz
    }

    setCurrentView(view);
  };

  const handleQuizComplete = async (results: EDNAResults) => {
    console.log('🎯 [App] Quiz complete! Received results:', results);
    console.log('🎯 [App] Results structure check:', {
      core_type: results.core_type,
      subtype: results.subtype,
      learning_style: results.learning_style,
      neurodiversity: results.neurodiversity,
      mindset: results.mindset,
      personality: results.personality
    });
    
    setQuizResults(results);
    
    const completedDate = new Date();
    setQuizCompletedAt(completedDate);
    localStorage.setItem('quizCompletedAt', completedDate.toISOString());
    
    if (isAuthenticated && user?.email) {
      localStorage.setItem(
        `quizResults_${user.email}`,
        JSON.stringify(results),
      );
      console.log(
        '✅ Quiz results saved to localStorage for authenticated user:',
        user.email,
      );
    } else {
      localStorage.setItem('pendingQuizResults', JSON.stringify(results));
      console.log('✅ Quiz results saved to pendingQuizResults in localStorage');
    }
    
    console.log('✅ Quiz completion timestamp saved:', completedDate);
    
    if (isAuthenticated && user?.email) {
      console.log(
        '✅ User already authenticated, skipping email verification',
      );
      await handleEmailVerified(user.email);
      return;
    }
    
    setShowEmailVerification(true);
  };

  const handleRetakeQuiz = () => {
    if (quizCompletedAt) {
      const daysSinceCompletion =
        (new Date().getTime() - quizCompletedAt.getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceCompletion < 7) {
        console.log(
          `⏳ Cannot retake quiz yet. ${(7 - daysSinceCompletion).toFixed(
            1,
          )} days remaining`,
        );
        setCurrentView('quiz');
        return;
      }
    }
    setQuizResults(null);
    setQuizCompletedAt(null);
    localStorage.removeItem('quizCompletedAt');
    localStorage.removeItem('pendingQuizResults');
    localStorage.removeItem('pendingVerifiedEmail');
    setVerifiedEmail(null);
    setShowShortResults(false);
    setCurrentView('quiz');
  };

  const handleEmailVerified = async (email: string) => {
    showShortResultsRef.current = true;
    console.log(
      '✅ showShortResultsRef set to true IMMEDIATELY (before any async operations)',
    );
    
    setVerifiedEmail(email);
    setShowEmailVerification(false);
    setShowShortResults(true);

    if (quizResults) {
      localStorage.setItem('pendingQuizResults', JSON.stringify(quizResults));
      localStorage.setItem('pendingVerifiedEmail', email);
    }

    if (quizResults) {
      try {
        const response = await fetch(
          `${backendUrl}/api/quiz/save-results`,
          {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: email.split('@')[0],
              results: quizResults,
            }),
          },
        );

        const data = await response.json();

        if (data.success) {
          console.log(
            '✅ Results saved, PDF generating in background',
          );
          localStorage.setItem('resultId', data.resultId);
          localStorage.setItem('userEmail', email);
          const completedDate = new Date();
          setQuizCompletedAt(completedDate);
          localStorage.setItem(
            'quizCompletedAt',
            completedDate.toISOString(),
          );
          if (quizResults) {
            localStorage.setItem(
              `quizResults_${email}`,
              JSON.stringify(quizResults),
            );
            localStorage.setItem(
              'pendingQuizResults',
              JSON.stringify(quizResults),
            );
          }
          console.log(
            '✅ Quiz completion timestamp and results saved to localStorage:',
            completedDate,
          );
        } else {
          const completedDate = new Date();
          setQuizCompletedAt(completedDate);
          localStorage.setItem(
            'quizCompletedAt',
            completedDate.toISOString(),
          );
          if (quizResults) {
            localStorage.setItem(
              `quizResults_${email}`,
              JSON.stringify(quizResults),
            );
            localStorage.setItem(
              'pendingQuizResults',
              JSON.stringify(quizResults),
            );
          }
          console.log(
            '⚠️ Backend save failed, but saved to localStorage as backup',
          );
        }
      } catch (error) {
        console.error('Failed to save results:', error);
      }
    }
  };

  const handleGetFullReport = () => {
    if (verifiedEmail) {
      localStorage.setItem('purchaseEmail', verifiedEmail);
    }
    window.location.href = GHL_CHECKOUT_URL;
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={() => {
          // Mark onboarding as completed so it doesn't show again
          localStorage.setItem('edna-onboarding-completed', 'true');
          setShowOnboarding(false);
          setCurrentView('quiz');
        }}
      />
    );
  }

  if (showAuth) {
    return (
      <AuthScreens
        onAuthenticate={handleAuthenticate}
        onCancel={() => {
          setShowAuth(false);
          setAuthMode('login'); // Reset to login mode when canceling
        }}
        initialMode={authMode}
      />
    );
  }

  if (showEmailVerification && quizResults) {
    return (
      <EmailVerificationPage
        onVerified={handleEmailVerified}
        onCancel={() => {
          setShowEmailVerification(false);
          setCurrentView('home');
        }}
      />
    );
  }

  if (showShortResults && quizResults && verifiedEmail) {
    return (
      <CompleteResultsPage
        results={quizResults}
        userEmail={verifiedEmail}
        onGetFullReport={handleGetFullReport}
        onViewChange={handleViewChange}
        quizCompletedAt={quizCompletedAt}
        isStandalone={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        isAuthenticated={isAuthenticated}
        onAuthToggle={handleAuthToggle}
        isSticky={currentView === 'dashboard' || (currentView === 'home' && isAuthenticated)}
        dashboardMenuItems={(currentView === 'dashboard' || (currentView === 'home' && isAuthenticated)) ? [
          { id: 'profile', label: 'EDNA Profile', icon: User, view: 'profile' },
          { id: 'workbooks', label: 'Workbooks', icon: FileText, view: 'workbooks', disabled: false },
          { id: 'chat', label: 'AI Mentor', icon: MessageSquare, view: 'chat' },
          { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses', disabled: true },
        ] : undefined}
        activeDashboardView={(currentView === 'dashboard' || (currentView === 'home' && isAuthenticated)) ? activeDashboardView : undefined}
        onDashboardViewChange={(currentView === 'dashboard' || (currentView === 'home' && isAuthenticated)) ? setActiveDashboardView : undefined}
        onMobileMenuToggle={setIsMobileMenuOpen}
        onLogoClick={() => {
          if (isAuthenticated) {
            // Navigate to dashboard and set EDNA Profile as active view
            setCurrentView('dashboard');
            setActiveDashboardView('profile');
          } else {
            // Navigate to home for non-authenticated users
            handleViewChange('home');
          }
        }}
      />
      
      {currentView === 'home' && !isAuthenticated && <Home onViewChange={handleViewChange} />}
      
      {/* If authenticated user is on home, show dashboard instead */}
      {currentView === 'home' && isAuthenticated && (
        <CompleteResultsPage 
          results={quizResults || null}
          userEmail={user?.email || ''}
          onViewChange={handleViewChange}
          quizCompletedAt={quizCompletedAt}
          activeDashboardView={activeDashboardView}
          onDashboardViewChange={setActiveDashboardView}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
      
      {currentView === 'about' && <About onViewChange={handleViewChange} />}
      
      {currentView === 'courses' && (
        <Courses
          onViewChange={handleViewChange}
          isAuthenticated={isAuthenticated}
        />
      )}
      
      {currentView === 'quiz' &&
        (() => {
          const checkDate =
            quizCompletedAt ||
            (() => {
          const saved = localStorage.getItem('quizCompletedAt');
          return saved ? new Date(saved) : null;
        })();
        
          const hasCompletedQuiz =
            quizResults ||
                                  localStorage.getItem('pendingQuizResults') ||
            (user?.email &&
              localStorage.getItem(`quizResults_${user.email}`));
        
        if (hasCompletedQuiz && checkDate) {
            const daysSinceCompletion =
              (new Date().getTime() - checkDate.getTime()) /
              (1000 * 60 * 60 * 24);
          if (daysSinceCompletion < 7) {
            if (!quizCompletedAt && checkDate) {
              setQuizCompletedAt(checkDate);
            }
            if (!quizResults && user?.email) {
                const savedResults =
                  localStorage.getItem(`quizResults_${user.email}`) ||
                                   localStorage.getItem('pendingQuizResults');
              if (savedResults) {
                try {
                  const results = JSON.parse(savedResults);
                  if (results && results.core_type) {
                    setQuizResults(results);
                      console.log(
                        '✅ Restored quiz results from localStorage for cooldown display',
                      );
                  }
                } catch (e) {
                  console.error('Failed to parse saved results:', e);
                }
              }
            }
            return (
              <QuizCooldownMessage 
                completedAt={checkDate}
                onViewDashboard={() => setCurrentView('dashboard')}
              />
            );
          } else {
            if (quizCompletedAt) {
              setQuizCompletedAt(null);
              localStorage.removeItem('quizCompletedAt');
            }
          }
        }
        return (
          <NewEDNAQuiz 
              onComplete={(results) => {
                handleQuizComplete(results).catch(console.error);
              }}
            onBackToHome={() => setCurrentView('home')}
            userEmail={user?.email || null}
          />
        );
      })()}
      
      {currentView === 'results' && quizResults && (
        <EDNAResultsPage 
          results={quizResults}
          onViewChange={handleViewChange}
          onRetakeQuiz={handleRetakeQuiz}
        />
      )}
      
      {currentView === 'dashboard' && isAuthenticated && (
        <CompleteResultsPage 
          results={quizResults || null}
          userEmail={user?.email || ''}
          onViewChange={handleViewChange}
          quizCompletedAt={quizCompletedAt}
          activeDashboardView={activeDashboardView}
          onDashboardViewChange={setActiveDashboardView}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
      
      {currentView === 'chat' && isAuthenticated && (
        <AIMentorHub onViewChange={handleViewChange} isInDashboard={false} />
      )}
      
      {currentView === 'architect-mentor' && isAuthenticated && (
        <AIMentorHub
          onViewChange={handleViewChange}
          isInDashboard={false}
          initialMentor="architect"
        />
      )}
      
      {currentView === 'alchemist-mentor' && isAuthenticated && (
        <AIMentorHub
          onViewChange={handleViewChange}
          isInDashboard={false}
          initialMentor="alchemist"
        />
      )}
      
      {currentView === 'insights' && quizResults && (
        <ProfileInsights results={quizResults} />
      )}
      
      {currentView === 'privacy-policy' && (
        <PrivacyPolicy onViewChange={handleViewChange} />
      )}
      
      {currentView === 'terms-of-service' && (
        <TermsOfService onViewChange={handleViewChange} />
      )}
      
      {currentView === 'contact' && (
        <ContactSupport onViewChange={handleViewChange} />
      )}
    </div>
  );
}
