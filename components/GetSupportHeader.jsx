"use client";
import { useState } from "react";

const DONATE_URL =
  "https://www.zeffy.com/en-US/donation-form/donate-to-empower-youth-organizing-in-san-diego-2";

// This header belongs only to /get-support, the only page this site
// actually has right now. Every nav item it shows the real site's future
// structure (Campaigns, Press, About, etc.), but only three destinations
// actually exist yet: Donate, Instagram, and the sclusd.org redirect.
// Everything else renders as inert text (no href) rather than a link to
// a page that isn't built, including the logo's usual link home.
export default function GetSupportHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="gs-utility-bar">
        <div className="gs-utility-inner">
          <div className="gs-utility-links">
            <span>Know Your Rights</span>
            <a href="/get-support" className="gs-utility-current">Get Support</a>
            <span>Español</span>
          </div>
          <div className="gs-utility-links">
            <span>Search</span>
            <a href="https://sclusd.org" target="_blank" rel="noopener">SCLU San Diego ↗</a>
          </div>
        </div>
      </div>

      <div className="gs-header">
        <div className="gs-header-inner">
          <div className="gs-logo">
            <img src="/logo-seal.png" alt="SCLU" className="gs-logo-img" />
            <span className="gs-logo-text">
              <span className="gs-logo-name">SCLU</span>
              <span className="gs-logo-tagline">Students&rsquo; Civil Liberties Union</span>
            </span>
          </div>

          <nav className="gs-nav-desktop" aria-label="Main">
            <span>Campaigns</span>
            <span>Take Action</span>
            <span>Press</span>
            <span>About</span>
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
            <span>Campaigns</span>
            <span>Take Action</span>
            <span>Press</span>
            <span>About</span>
            <span>Know Your Rights</span>
            <a href="/get-support">Get Support</a>
            <span>Español</span>
            <a href="https://sclusd.org" target="_blank" rel="noopener">SCLU San Diego ↗</a>
            <a href={DONATE_URL} target="_blank" rel="noopener" className="gs-mobile-donate">Donate</a>
          </nav>
        )}
      </div>
    </>
  );
}
