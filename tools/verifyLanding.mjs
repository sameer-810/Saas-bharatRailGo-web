/**
 * Phase 6 gate — landing site. Builds against a stub price API, serves the
 * build with `vite preview`, and checks it in Playwright at desktop and phone
 * sizes — then again with the API down to prove the static fallback.
 *
 * Evidence: ../verify-evidence/phase6/landing/   (SKIP_BUILD=1 reuses dist/)
 */
import { execSync, spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(ROOT, "..", "verify-evidence", "phase6", "landing");
mkdirSync(OUT, { recursive: true });
const API_PORT = 5188;
const WEB_PORT = 4188;
const APP_URL = "https://app.bharatrailgo.test";

const STUB_PLANS = [
  { id: "1", code: "starter", name: "Starter", priceMonthly: 999, priceYearly: 9990, features: ["3 users", "Bilti, GST invoices, ledger"], limits: { maxUsers: 3, maxBranches: 1, maxBookingsPerMonth: 1500 }, sortOrder: 1 },
  { id: "2", code: "growth", name: "Stub Growth", priceMonthly: 2222, priceYearly: 22220, features: ["SMS status updates"], limits: { maxUsers: 10, maxBranches: 3, maxBookingsPerMonth: 6000 }, isFeatured: true, sortOrder: 2 },
  { id: "3", code: "pro", name: "Pro", priceMonthly: 4999, priceYearly: 49990, features: ["Priority support"], limits: { maxUsers: 30, maxBranches: 10, maxBookingsPerMonth: null }, sortOrder: 3 },
];

function startStubApi() {
  const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url === "/api/plans") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true, data: STUB_PLANS }));
    }
    res.writeHead(404).end();
  });
  return new Promise((r) => server.listen(API_PORT, "127.0.0.1", () => r(server)));
}

if (!process.env.SKIP_BUILD) {
  execSync("npm run build", {
    cwd: ROOT,
    stdio: "ignore",
    env: { ...process.env, VITE_API_URL: `http://127.0.0.1:${API_PORT}/api`, VITE_APP_URL: APP_URL },
  });
}

const preview = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "preview", "--port", String(WEB_PORT), "--strictPort"], {
  cwd: ROOT,
  shell: process.platform === "win32",
  stdio: "ignore",
});
const WEB = `http://localhost:${WEB_PORT}`;
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(WEB)).ok) break;
  } catch {
    /* starting */
  }
  await new Promise((r) => setTimeout(r, 250));
}

let api = await startStubApi();
const browser = await chromium.launch();
const results = [];
let n = 0;

async function run(label, viewport, fn) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource|ERR_CONNECTION_REFUSED/.test(m.text())) errors.push(m.text());
  });
  const check = async (name, body) => {
    let ok = true;
    let error = null;
    try {
      await body();
      if (errors.length) throw new Error(`console: ${errors.join(" | ").slice(0, 300)}`);
    } catch (e) {
      ok = false;
      error = String(e?.message || e).split("\n")[0];
    }
    const file = `${String(++n).padStart(2, "0")}-${label}-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
    await page.screenshot({ path: path.join(OUT, file), fullPage: false }).catch(() => undefined);
    results.push({ name: `${label}: ${name}`, ok, error, screenshot: file });
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${name}${error ? ` — ${error}` : ""}`);
  };
  await fn(page, check);
  await page.close();
}

const noOverflow = async (page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 1) throw new Error(`horizontal overflow ${over}px`);
};

for (const [label, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  await run(label, viewport, async (page, check) => {
    await page.goto(WEB);
    await check("hero with the live departure board", async () => {
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.locator('[data-testid="hero-board"]').waitFor();
      await page.waitForTimeout(900);
      await noOverflow(page);
    });
    await check("all sections present", async () => {
      for (const id of ["problem-title", "features-title", "steps-title", "pricing-title", "faq-title", "cta-title"]) {
        if (!(await page.locator(`#${id}`).count())) throw new Error(`missing #${id}`);
      }
    });
    await check("CTAs go to the app signup / login", async () => {
      const href = (id) => page.locator(`[data-testid="${id}"]`).getAttribute("href");
      if ((await href("hero-signup")) !== `${APP_URL}/signup`) throw new Error("hero signup href");
      if ((await href("hero-login")) !== `${APP_URL}/login`) throw new Error("hero login href");
      if ((await href("plan-cta-growth")) !== `${APP_URL}/signup?plan=growth`) throw new Error("plan CTA href");
    });
    await check("pricing is live from the API", async () => {
      await page.locator("#pricing").scrollIntoViewIfNeeded();
      await page.locator('[data-testid="pricing"][data-live="true"]').waitFor({ timeout: 8000 });
      await page.getByText("Stub Growth").waitFor();
      const price = await page.locator('[data-testid="price-growth"]').innerText();
      if (!price.includes("₹2,222")) throw new Error(`price ${price}`);
      const card = await page.locator('[data-testid="plan-starter"]').innerText();
      if ((card.match(/3 users/g) || []).length !== 1) throw new Error("limit listed twice");
      if (/1 branches/.test(card)) throw new Error("1 branches");
      if (!(await page.locator(".plan.featured").count())) throw new Error("featured plan not highlighted");
      await noOverflow(page);
    });
    await check("yearly toggle switches prices", async () => {
      await page.click('[data-testid="cycle-yearly"]');
      const price = await page.locator('[data-testid="price-growth"]').innerText();
      if (!price.includes("₹22,220")) throw new Error(`yearly price ${price}`);
      await page.click('[data-testid="cycle-monthly"]');
    });
    await check("FAQ opens with the keyboard", async () => {
      const btn = page.locator('[data-testid="faq"] button').first();
      await btn.scrollIntoViewIfNeeded();
      await btn.focus();
      await page.keyboard.press("Enter");
      if ((await btn.getAttribute("aria-expanded")) !== "true") throw new Error("Enter did not open");
      await page.keyboard.press(" ");
      if ((await btn.getAttribute("aria-expanded")) !== "false") throw new Error("Space did not close");
    });
    await check("privacy and terms pages render", async () => {
      await page.goto(`${WEB}/#/privacy`);
      await page.locator('[data-testid="privacy"]').waitFor();
      for (const heading of ["Your customers’ data", "Your rights", "Grievance officer"]) {
        if (!(await page.getByRole("heading", { name: heading.replace("’", "'") }).count())) throw new Error(`privacy policy lacks "${heading}"`);
      }
      await page.goto(`${WEB}/#/terms`);
      await page.locator('[data-testid="terms"]').waitFor();
      await noOverflow(page);
    });
  });
}

// API down → the static price list still renders, and no error is shown.
await new Promise((r) => api.close(r));
api = null;
await run("api-down", { width: 1440, height: 900 }, async (page, check) => {
  await page.goto(WEB);
  await check("pricing falls back to the built-in list", async () => {
    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    if (await page.locator('[data-testid="pricing"][data-live="true"]').count()) throw new Error("claims live");
    const price = await page.locator('[data-testid="price-growth"]').innerText();
    if (!price.includes("₹2,499")) throw new Error(`fallback price ${price}`);
    if (await page.getByText(/error|failed/i).count()) throw new Error("error shown to visitor");
  });
});

await browser.close();
preview.kill();
if (process.platform === "win32") {
  try {
    execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${WEB_PORT} ^| findstr LISTENING') do taskkill /F /PID %a`, { stdio: "ignore", shell: "cmd.exe" });
  } catch {
    /* already gone */
  }
}

const failed = results.filter((r) => !r.ok);
writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ at: new Date().toISOString(), total: results.length, failed: failed.length, results }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} landing checks passed — evidence in ${OUT}`);
process.exit(failed.length ? 1 : 0);
