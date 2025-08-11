import './App.css';

export default function App() {
  return (
    <main>
      {/* --- Top navigation --- */}
      <header className="nav">
        <div className="brand">
          {/* Minimal mountain + eye mark */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 16l5-8 4 6 3-4 6 10H3Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
            <circle cx="12" cy="10" r="1.6" />
          </svg>
          <span>SitaVision</span>
        </div>
        <a className="btn ghost" href="mailto:hello@sitavision.com">Contact</a>
      </header>

      {/* --- Hero --- */}
      <section className="hero">
        <span className="pill">Coming soon</span>
        <h1>Computer vision that runs where it matters.</h1>
        <p>
          We turn cameras into intelligent sensors for mobility, cities, sports, and industry —
          on‑device, privacy‑first.
        </p>

        {/* Simple waitlist form without backend */}
        <form
          className="waitlist"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const input = form.elements.namedItem('email') as HTMLInputElement | null;
            const email = input?.value ?? '';
            window.location.href = `mailto:hello@sitavision.com?subject=Waitlist&body=${encodeURIComponent(email)}`;
          }}
        >
          <input name="email" type="email" required placeholder="Your email" />
          <button className="btn" type="submit">Join waitlist</button>
        </form>

        <div className="badges">
          <span>Edge AI</span>
          <span>Low‑latency</span>
          <span>GDPR‑ready</span>
        </div>
      </section>

      {/* --- Features grid --- */}
      <section className="features">
        <div className="card">
          <h3>On‑device processing</h3>
          <p>Run models on cameras or gateways to cut latency and cloud costs.</p>
        </div>
        <div className="card">
          <h3>Plug‑and‑play APIs</h3>
          <p>Simple REST/WebSocket endpoints for events, tracks, and analytics.</p>
        </div>
        <div className="card">
          <h3>Privacy by design</h3>
          <p>No raw video leaves the edge unless you allow it.</p>
        </div>
        <div className="card">
          <h3>Multi‑domain</h3>
          <p>Transport, traffic, sports, smart facilities — one platform.</p>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="cta">
        <h2>Want early access?</h2>
        <a className="btn" href="mailto:hello@sitavision.com?subject=Early%20access">Request a demo</a>
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} SitaVision</span>
        <a href="https://sitavision.com">sitavision.com</a>
      </footer>
    </main>
  );
}
