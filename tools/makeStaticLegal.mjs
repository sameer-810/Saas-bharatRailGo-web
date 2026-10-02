/**
 * Writes public/privacy-policy.html and public/delete-account.html — plain
 * static pages for the Play Store / App Store forms. The stores' reviewers and
 * crawlers need a URL that shows the text without running the site's script,
 * which the in-site `#/privacy` route cannot give them.
 *
 * The privacy text is taken from the built site (src/Legal.tsx), so there is
 * one source for it. Run after changing the policy:
 *
 *   node tools/makeStaticLegal.mjs      then commit public/*.html
 */
import { execSync, spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4191;

execSync("npm run build", { cwd: ROOT, stdio: "ignore" });
const preview = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: ROOT,
  shell: process.platform === "win32",
  stdio: "ignore",
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}`)).ok) break;
  } catch {
    /* starting */
  }
  await new Promise((r) => setTimeout(r, 250));
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${PORT}/#/privacy`);
await page.locator('[data-testid="privacy"]').waitFor();
const { privacy, email } = await page.evaluate(() => {
  const main = document.querySelector('[data-testid="privacy"]').cloneNode(true);
  main.querySelector("a")?.remove(); // the in-site "Back" link
  const paras = main.querySelectorAll("p");
  return { privacy: main.innerHTML, email: paras[paras.length - 1].textContent.trim() };
});
await browser.close();
preview.kill();
if (process.platform === "win32") {
  try {
    execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PORT} ^| findstr LISTENING') do taskkill /F /PID %a`, { stdio: "ignore", shell: "cmd.exe" });
  } catch {
    /* already gone */
  }
}

const shell = (title, description, body) => `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — BharatRailGo</title>
<meta name="description" content="${description}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
  body{margin:0;background:#f7f5f0;color:#14161a;font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  header{background:#111317;color:#ffc940;padding:18px 20px;font:700 14px ui-monospace,Consolas,monospace;letter-spacing:.22em}
  header a{color:inherit;text-decoration:none}
  main{max-width:760px;margin:0 auto;padding:28px 20px 64px}
  h1{font-size:30px;letter-spacing:-.02em;margin:0 0 4px}
  h2{font-size:18px;margin:28px 0 6px}
  p,li{color:#3a3f4a} .muted{color:#6b7280} .small{font-size:14px}
  ol{padding-left:22px} li{margin-bottom:6px}
  .box{background:#fff;border:1px solid #e6e1d6;border-radius:12px;padding:16px 18px;margin:16px 0}
  a{color:#2446d8}
</style>
</head>
<body>
<header><a href="/">BHARATRAILGO</a></header>
<main>
${body}
</main>
</body>
</html>
`;

writeFileSync(
  path.join(ROOT, "public", "privacy-policy.html"),
  shell("Privacy Policy", "How BharatRailGo collects, uses, keeps and deletes data.", privacy),
);

writeFileSync(
  path.join(ROOT, "public", "delete-account.html"),
  shell(
    "Delete your account",
    "How to delete your BharatRailGo account and data.",
    `<h1>Delete your BharatRailGo account</h1>
<p class="muted small">App: BharatRailGo (com.bharatrailgo.app) · Developer: BharatRailGo</p>

<h2>Delete it yourself, in the app</h2>
<div class="box">
<ol>
  <li>Sign in as the agency <strong>owner</strong>.</li>
  <li>Open <strong>Settings → Privacy &amp; data</strong>.</li>
  <li>Under <strong>Delete your account</strong>, type your password and press <strong>Request account deletion</strong>.</li>
</ol>
<p>You have 30 days to change your mind — press <strong>Cancel deletion</strong> on the same screen. After 30 days the account and its data are permanently deleted.</p>
</div>

<h2>Or ask us</h2>
<p>Email <a href="mailto:${email}?subject=Delete%20my%20BharatRailGo%20account">${email}</a> from the owner's registered email address with the agency name. We reply within 7 days and follow the same 30-day process.</p>
<p>Staff and manager logins are removed by the agency owner in <strong>Settings → Team</strong>.</p>

<h2>What is deleted</h2>
<p>Everything belonging to the agency: bookings, bilti, GST bills, parties and their contact details, payments, branches, team accounts, the logo, settings and the activity log.</p>

<h2>What is kept, and for how long</h2>
<ul>
  <li><strong>Our GST invoices to you</strong> for your subscription, and the matching payment records — kept for as long as Indian tax law requires (6 years).</li>
  <li><strong>Backups</strong> — deleted data leaves our nightly backups within a further 30 days.</li>
</ul>

<h2>Delete some data without closing the account</h2>
<p>To erase one customer's personal data, open the party and use <strong>Customer privacy → Erase personal data</strong>. To take a copy of everything first, use <strong>Settings → Privacy &amp; data → Download my data</strong>.</p>

<p class="small muted">See also the <a href="/privacy-policy.html">Privacy Policy</a>.</p>`,
  ),
);
console.log("public/privacy-policy.html, public/delete-account.html");
