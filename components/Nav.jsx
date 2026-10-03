"use client";
import { useEffect, useState } from "react";
import Magnetic from "./Magnetic";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <a className="nav-logo" href="#top" aria-label="SCLU home">
        <img src="/logo-blue.png" alt="SCLU" className="nav-logo-img" />
      </a>
      <div className="nav-links">
        <a href="#students">Students</a>
        <a href="#civil">Civil</a>
        <a href="#liberties">Liberties</a>
        <a href="#union">Union</a>
        <a href="#campaigns">Campaigns</a>
        <Magnetic strength={0.3}>
          <a href="#press">Press</a>
          <a href="#team">Team</a>
          <a href="/help">Get Support</a>
          <a className="nav-cta" href="#join">Join ✊</a>
        </Magnetic>
      </div>
    </nav>
  );
}