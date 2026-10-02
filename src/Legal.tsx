/** Plain-language Privacy Policy and Terms (needed for app-store listings). Review with a lawyer before launch. */
import { CONTACT_EMAIL, GRIEVANCE_OFFICER } from "./config";

export function Privacy() {
  return (
    <main className="legal" data-testid="privacy">
      <a href="#/" className="small">← Back</a>
      <h1>Privacy Policy</h1>
      <p className="muted small">Last updated: 2 October 2026</p>
      <h2>What we collect</h2>
      <p>
        Your account details (name, email, mobile), your agency&apos;s business details (name, GSTIN, addresses) and the business
        records you enter: parties, bookings, bilti, invoices and payments, plus the logo you upload. We keep basic technical logs (IP address, device,
        time) for security.
      </p>
      <h2>How we use it</h2>
      <p>
        Only to run the service for you: storing and showing your records, generating documents, sending the SMS and emails you
        trigger, billing your subscription and keeping the service secure. We do not sell your data or use it for advertising.
      </p>
      <h2>Who can see it</h2>
      <p>
        Your data is visible only to users of your own agency, according to the roles you assign. Our processors — cloud
        hosting, database, email, SMS and payment providers (Razorpay) — handle it only to provide their part of the service.
        Every change, export and sign-in by your team is recorded in your agency&apos;s activity log, kept for one year.
      </p>
      <h2>Your customers&apos; data</h2>
      <p>
        For the parties, consignors and consignees you enter, your agency decides what is collected and why; we process it
        only on your instructions. When one of your customers asks for their data, open the party and use{" "}
        <strong>Download customer data</strong>; when they ask for it to be erased, use <strong>Erase personal data</strong>.
        If that customer has bookings, bilti, bills or payments, their name and GSTIN stay on those records because GST law
        requires them to be kept; their contact details are removed.
      </p>
      <h2>Your rights</h2>
      <p>
        Under India&apos;s Digital Personal Data Protection Act, 2023 you may access, correct and erase your personal data,
        withdraw consent, nominate someone to act for you, and raise a grievance with us (and then with the Data Protection
        Board of India). In the app, the owner can download all of the agency&apos;s data, see the consent given at signup, and
        close the account under <strong>Settings → Privacy &amp; data</strong>.
      </p>
      <h2>Retention and deletion</h2>
      <p>
        Data is encrypted in transit, backed up every night (backups are kept for 30 days) and kept while your account is
        active. When the owner asks to close the account there is a 30-day window to change your mind; after that all of the
        agency&apos;s data is deleted, and it leaves our backups within a further 30 days. Our own GST invoices for your
        subscription are kept for as long as tax law requires.
      </p>
      <h2>Security incidents</h2>
      <p>
        If a breach affects your data we will tell you without delay and report it to the Data Protection Board as the law
        requires.
      </p>
      <h2>Grievance officer</h2>
      <p>
        {GRIEVANCE_OFFICER} — {CONTACT_EMAIL}. We reply within 30 days.
      </p>
      <h2>Contact</h2>
      <p>{CONTACT_EMAIL}</p>
    </main>
  );
}

export function Terms() {
  return (
    <main className="legal" data-testid="terms">
      <a href="#/" className="small">← Back</a>
      <h1>Terms of Service</h1>
      <p className="muted small">Last updated: 2 October 2026</p>
      <h2>The service</h2>
      <p>
        BharatRailGo provides online software for parcel booking agents. You are responsible for the accuracy of the records you
        enter and for the documents (bilti, GST invoices) you issue to your customers.
      </p>
      <h2>Trial and subscription</h2>
      <p>
        New agencies get a 14-day free trial after approval. Plans are billed monthly or yearly in advance, plus GST. If a payment
        is not made, the account becomes read-only after a short grace period; your data is not deleted and remains exportable.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the service for unlawful shipments, share your login, attempt to access other agencies&apos; data or disrupt the
        service. We may suspend accounts that do.
      </p>
      <h2>Liability</h2>
      <p>
        The service is provided on a reasonable-effort basis. Our total liability is limited to the fees you paid in the three
        months before a claim. We are not liable for goods in transit or indirect losses.
      </p>
      <h2>Changes and law</h2>
      <p>
        We may update these terms with notice by email or in the app. These terms are governed by the laws of India.
      </p>
      <h2>Contact</h2>
      <p>{CONTACT_EMAIL}</p>
    </main>
  );
}
