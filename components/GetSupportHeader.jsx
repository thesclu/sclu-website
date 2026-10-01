"use client";
import { useState } from "react";

const DONATE_URL =
  "https://www.zeffy.com/en-US/donation-form/donate-to-empower-youth-organizing-in-san-diego-2";

// This header belongs only to /get-support for now. The rest of the site
// still uses the older full-bleed header (see design_handoff_get_support
// README, "Open items") — it gets rolled out site-wide separately.
export default function GetSupportHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="gs-utility-bar">
        <div className="gs-utility-inner">
          <div className="gs-utility-links">
            <a href="/">Know Your Rights</a>
            <a href="/get-support" className="gs-utility-current">Get Support</a>
            <a href="/">Español</a>
          </div>
          <div className="gs-utility-links">
            <a href="/">Search</a>
            <a href="https://sclusd.org" target="_blank" rel="noopener">SCLU San Diego ↗</a>
          </div>
        </div>
      </div>

      <div className="gs-header">
        <div className="gs-header-inner">
          <a href="/" className="gs-logo">
            <img src="/logo-seal.png" alt="SCLU" className="gs-logo-img" />
            <span className="gs-logo-text">
              <span className="gs-logo-name">SCLU</span>
              <span className="gs-logo-tagline">Students&rsquo; Civil Liberties Union</span>
            </span>
          </a>

          <nav className="gs-nav-desktop" aria-label="Main">
            <a href="/">Campaigns</a>
            <a href="/">Take Action</a>
            <a href="/">Press</a>
            <a href="/">About</a>
            <a href={DONATE_URL} target="_blank" rel="noopener" className="gs-donate-btn">Donate</a>
          </nav>

          <button
            type="button"
            className="gs-hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`gs-hamburger-icon ${menuOpen ? "gs-hamburger-icon--open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav className="gs-mobile-menu" aria-label="Main">
            <a href="/">Campaigns</a>
            <a href="/">Take Action</a>
            <a href="/">Press</a>
            <a href="/">About</a>
            <a href="/">Know Your Rights</a>
            <a href="/get-support">Get Support</a>
            <a href="/">Español</a>
            <a href="https://sclusd.org" target="_blank" rel="noopener">SCLU San Diego ↗</a>
            <a href={DONATE_URL} target="_blank" rel="noopener" className="gs-mobile-donate">Donate</a>
          </nav>
        )}
      </div>
    </>
  );
}
