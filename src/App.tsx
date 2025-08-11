import './App.css';

export default function App() {
  return (
    <main className="container">
      {/* Header with logo and brand name */}
      <div className="header">
        <div className="logo" aria-label="SitaVision logo">
          {/* Minimal mountain + eye icon */}
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 16l5-8 4 6 3-4 6 10H3Z" stroke="#51c4ff" strokeWidth="1.6" />
            <circle cx="12" cy="10" r="1.6" fill="#51c4ff"/>
          </svg>
        </div>
        <span className="tag badge">SitaVision</span>
      </div>

      {/* Hero section */}
      <section className="hero">
        <span className="tag">Coming soon</span>
        <h1>Cameras that see, understand, and act.</h1>
        <p>
          We are building software that transforms cameras into intelligent sensors:
          transportation, cities, sports, and industry.
        </p>
      </section>

      {/* Email form for waitlist */}
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.currentTarget.querySelector('input[name="email"]').value;
          window.location.href = `mailto:hello@sitavision.com?subject=Waitlist&body=${encodeURIComponent(email)}`;
        }}
      >
        <input className="input" type="email" name="email" required placeholder="Your email" />
        <button type="submit">Join waitlist</button>
        <a className="ghost" href="mailto:hello@sitavision.com">Contact us</a>
      </form>

      {/* Footer */}
      <p className="footer">© {new Date().getFullYear()} SitaVision</p>
    </main>
  );
}
