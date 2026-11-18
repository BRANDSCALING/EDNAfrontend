/**
 * BrandNav — the public top navigation per BS-BRAND-001 / Mockup 01, extracted from BrandHome
 * on 17 Nov 2026 so About and Courses share it. Signed-in visitors get "Dashboard" in place of
 * "Sign in". Labels follow the mockup; "Membership" routes to Courses until the GHL tier
 * landing pages exist (flagged to Fariza).
 */

interface BrandNavProps {
  onViewChange: (view: string) => void;
  onSignIn: () => void;
  isAuthenticated?: boolean;
}

export function BrandNav({ onViewChange, onSignIn, isAuthenticated = false }: BrandNavProps) {
  return (
    <nav className="bs-nav">
      <img src="/edna/img/logo.png" alt="Brandscaling" className="bs-nav-logo" />
      <div className="bs-nav-links">
        <button onClick={() => onViewChange('about')}>Decision Intelligence</button>
        <button onClick={() => { window.location.href = '/home/#layers'; }}>Infinite Scaling Tower</button>
        <button onClick={() => onViewChange('chat')}>AI mentors</button>
        <button onClick={() => { window.location.href = '/home/#membership'; }}>Membership</button>
        <button onClick={() => onViewChange('about')}>About</button>
      </div>
      {isAuthenticated ? (
        <button className="bs-nav-signin" onClick={() => onViewChange('dashboard')}>Dashboard</button>
      ) : (
        <button className="bs-nav-signin" onClick={onSignIn}>Sign in</button>
      )}
      <button className="bs-btn bs-btn-energy" onClick={() => onViewChange('quiz')}>
        Take the free E-DNA assessment
      </button>
    </nav>
  );
}
