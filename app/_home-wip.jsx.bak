import { PILLARS } from "../lib/content";
import ScrollProgress from "../components/ScrollProgress";
import Cursor from "../components/Cursor";
import Justice from "../components/Justice";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import LetterSection from "../components/LetterSection";
import Campaigns from "../components/Campaigns";
import JoinForm from "../components/JoinForm";
import Footer from "../components/Footer";
import Press from "../components/Press";
import Team from "../components/Team";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Justice />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        {PILLARS.map((pillar, i) => (
          <LetterSection key={pillar.letter} pillar={pillar} flip={i % 2 === 1} />
        ))}
        <Campaigns />
        <Press />
        <Team />
        <section className="join" id="join">
          <div className="container join-grid">
            <div>
              <h2>Join the Union</h2>
              <p>
                SCLU is a conscientiously inclusive organization. From data science to economics,
                visual arts to political science — every passionate individual can be a strong
                advocate when pushed in the right direction.
              </p>
              <div className="wings">
                <span>Research · data science</span>
                <span>Policy · economics</span>
                <span>Community · visual arts</span>
                <span>Outreach · political science</span>
              </div>
            </div>
            <JoinForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}