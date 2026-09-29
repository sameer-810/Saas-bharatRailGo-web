/** Live price list from GET /plans, with a static fallback when the API is unreachable. */
import { useEffect, useState } from "react";
import { API_URL, FALLBACK_PLANS, signupUrl, type Plan } from "./config";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function limit(v: number | null, one: string, many: string) {
  if (v == null) return `Unlimited ${many}`;
  return `${inr.format(v)} ${v === 1 ? one : many}`;
}

/** Features that only restate a limit are not listed twice. */
const extraFeatures = (f: string[]) => f.filter((x) => !/\b(users?|branch(es)?|bookings?)\b/i.test(x));

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const [live, setLive] = useState(false);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    fetch(`${API_URL}/plans`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const list = (json?.data || []) as Plan[];
        if (alive && list.length) {
          setPlans([...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.priceMonthly - b.priceMonthly));
          setLive(true);
        }
      })
      .catch(() => undefined) // fallback list stays — never show an error to visitors
      .finally(() => clearTimeout(timer));
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, []);

  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title" data-testid="pricing" data-live={live}>
      <div className="section-head">
        <p className="eyebrow">Pricing</p>
        <h2 id="pricing-title">Simple plans. Pay by UPI, card or autopay.</h2>
        <p className="muted">Every plan starts with a 14-day free trial. Prices are plus 18% GST.</p>
        <div className="toggle" role="radiogroup" aria-label="Billing period">
          <button role="radio" aria-checked={!yearly} className={!yearly ? "on" : ""} onClick={() => setYearly(false)} data-testid="cycle-monthly">
            Monthly
          </button>
          <button role="radio" aria-checked={yearly} className={yearly ? "on" : ""} onClick={() => setYearly(true)} data-testid="cycle-yearly">
            Yearly <span className="save">2 months free</span>
          </button>
        </div>
      </div>
      <div className="plans">
        {plans.map((p) => {
          const price = yearly ? p.priceYearly : p.priceMonthly;
          return (
            <article key={p.code} className={`plan${p.isFeatured ? " featured" : ""}`} data-testid={`plan-${p.code}`}>
              {p.isFeatured ? <span className="badge">Most popular</span> : null}
              <h3>{p.name}</h3>
              {p.description ? <p className="muted small">{p.description}</p> : null}
              <p className="price" data-testid={`price-${p.code}`}>
                <span className="mono">₹{inr.format(price)}</span>
                <span className="muted small">/{yearly ? "year" : "month"}</span>
              </p>
              {yearly && p.priceMonthly ? (
                <p className="muted small">≈ ₹{inr.format(Math.round(p.priceYearly / 12))}/month</p>
              ) : (
                <p className="muted small">+ GST</p>
              )}
              <ul>
                <li>{limit(p.limits.maxUsers, "user", "users")}</li>
                <li>{limit(p.limits.maxBranches, "branch", "branches")}</li>
                <li>{limit(p.limits.maxBookingsPerMonth, "booking", "bookings")} / month</li>
                {extraFeatures(p.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={`btn ${p.isFeatured ? "btn-primary" : "btn-ghost"}`} href={signupUrl(p.code)} data-testid={`plan-cta-${p.code}`}>
                Start free trial
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
