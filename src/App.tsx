// src/App.tsx
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0d1528] text-white font-sans">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/public/logo.svg" alt="SitaVision logo" className="w-10 h-10" />
          <span className="text-xl font-bold">SitaVision</span>
        </div>
        <a
          href="mailto:hello@sitavision.com"
          className="bg-white text-[#0b1220] font-bold px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Contact
        </a>
      </header>

      {/* HERO */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <span className="inline-block border border-white/20 text-sm text-gray-300 px-3 py-1 rounded-full mb-4">
          Coming soon
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Turn cameras into intelligent agents.
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          SitaVision enables real-time, privacy-first AI vision for mobility, retail, sports, and more.
        </p>

        {/* Waitlist form */}
        <form
          className="flex flex-col sm:flex-row justify-center gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value
            if (email) {
              window.location.href = `mailto:hello@sitavision.com?subject=Waitlist&body=${encodeURIComponent(email)}`
            }
          }}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-white/30 min-w-[240px]"
          />
          <button
            type="submit"
            className="bg-[#51c4ff] text-[#001728] font-bold px-5 py-3 rounded-md hover:brightness-110 transition"
          >
            Join waitlist
          </button>
        </form>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          ['On‑device processing', 'Run models on cameras or edge devices for instant response.'],
          ['Plug‑and‑play APIs', 'REST/WebSocket APIs for events, detection, and behavior tracking.'],
          ['Privacy by design', 'No raw video leaves the edge — unless you want it.'],
          ['Multi‑domain', 'One platform for transport, cities, sports, and smart spaces.'],
        ].map(([title, desc]) => (
          <div key={title} className="bg-[#0e1a30] border border-white/10 rounded-xl p-5">
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t border-white/10 bg-white/5">
        <h2 className="text-2xl font-bold mb-4">Want early access?</h2>
        <a
          href="mailto:hello@sitavision.com?subject=Early%20access"
          className="bg-[#51c4ff] text-[#001728] font-bold px-6 py-3 rounded hover:brightness-110 transition"
        >
          Request a demo
        </a>
      </section>

      {/* FOOTER */}
      <footer className="flex items-center justify-between text-sm text-gray-400 px-6 py-4 border-t border-white/10">
        <span>© {new Date().getFullYear()} SitaVision</span>
        <a href="https://sitavision.com" className="hover:underline">
          sitavision.com
        </a>
      </footer>
    </div>
  )
}
