import { CONTACT, PATENT } from "../engine";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        {CONTACT.org} · {CONTACT.dept}
        <br />
        Applicant: {CONTACT.company}
      </div>
      <div>
        Indian Patent Application {PATENT.number}
        <br />
        Industry demonstration — not a live police deployment
      </div>
    </footer>
  );
}
