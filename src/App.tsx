import { useEffect, useId, useState } from "react";
import { Board } from "./Board";
import { Pricing } from "./Pricing";
import { CONTACT_EMAIL, FAQ, FEATURES, STEPS, WHATSAPP, loginUrl, signupUrl } from "./config";
import { Privacy, Terms } from "./Legal";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function Nav() {
  return (
    <header className="nav">
      <a href="#/" className="brand" aria-label="BharatRailGo home">
        <span className="brand-mark" aria-hidden="true">B</span>
        BharatRailGo
      </a>
      <nav aria-label="Main">
        <a href="#features" className="hide-sm">Features</a>
        <a href="#pricing" className="hide-sm">Pricing</a>
        <a href="#faq" className="hide-sm">FAQ</a>
        <a href={loginUrl} data-testid="nav-login">Sign in</a>
        <a href={signupUrl()} className="btn btn-primary btn-sm" data-testid="nav-signup">Free trial</a>
      </nav>
    </header>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="faq-item">
      <h3>
        <button aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {q}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={id} role="region" hidden={!open}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">For railway parcel &amp; station-to-station booking agents</p>
          <h1 id="hero-title">Every parcel, every train, every rupee — on one board.</h1>
          <p className="lead">
            Booking, bilti, GST invoices and collections in one app your whole office can use — on the phone, in the browser and
            on Windows.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={signupUrl()} data-testid="hero-signup">Start free trial — 14 days</a>
            <a className="btn btn-ghost" href={loginUrl} data-testid="hero-login">Sign in</a>
          </div>
          <p className="muted small">No card needed · Your data stays yours — export any time</p>
        </div>
        <Board />
      </section>

      <section className="section problem" aria-labelledby="problem-title">
        <div className="section-head">
          <p className="eyebrow">Why agents switch</p>
          <h2 id="problem-title">The register, Tally and three Excel sheets never agree.</h2>
        </div>
        <div className="compare">
          <div>
            <h3>Today</h3>
            <ul className="cross">
              <li>Bilti written by hand, numbers skipped or repeated</li>
              <li>To-pay and on-bill dues tracked in different places</li>
              <li>GST bills typed again from the register at month end</li>
              <li>No idea which branch collected what</li>
            </ul>
          </div>
          <div>
            <h3>With BharatRailGo</h3>
            <ul className="tick">
              <li>One entry creates the booking, bilti and charges</li>
              <li>Every rupee allocated to the right booking automatically</li>
              <li>GST invoice from selected bookings in two clicks</li>
              <li>Branch-wise boards, ledgers and reports in real time</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="section" aria-labelledby="features-title">
        <div className="section-head">
          <p className="eyebrow">Features</p>
          <h2 id="features-title">Built for how a parcel office actually works</h2>
        </div>
        <div className="features">
          {FEATURES.map((f) => (
            <article className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              {f.code ? <code className="entry">{f.code}</code> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="steps-title">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2 id="steps-title">Up and running the same day</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="step-n mono">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Pricing />

      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Questions agents ask us</h2>
        </div>
        <div className="faq" data-testid="faq">
          {FAQ.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      <section className="section final-cta" aria-labelledby="cta-title">
        <h2 id="cta-title">Put your parcel office on one board.</h2>
        <p className="lead">Free for 14 days. Set up in minutes.</p>
        <div className="cta-row center">
          <a className="btn btn-primary" href={signupUrl()} data-testid="final-signup">Start free trial</a>
          {WHATSAPP ? (
            <a className="btn btn-ghost" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I'd like to know more about BharatRailGo")}`}>
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export function App() {
  const hash = useHashRoute();
  const page = hash === "#/privacy" ? <Privacy /> : hash === "#/terms" ? <Terms /> : <Home />;
  return (
    <>
      <a className="skip" href="#hero-title">Skip to content</a>
      <Nav />
      {page}
      <footer className="footer">
        <div>
          <strong>BharatRailGo</strong>
          <p className="muted small">Booking software for railway parcel agents.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#/privacy" data-testid="footer-privacy">Privacy</a>
          <a href="#/terms" data-testid="footer-terms">Terms</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </nav>
        <p className="muted small">© {new Date().getFullYear()} BharatRailGo. Prices exclude GST.</p>
      </footer>
    </>
  );
}
