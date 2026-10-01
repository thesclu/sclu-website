// Shared between the desktop sidebar and the mobile "Need assistance now?"
// block so the two never drift apart. Copy is verbatim from the design spec.
export default function SupportHelpBlocks() {
  return (
    <>
      <div>
        <h3 className="gs-help-title gs-help-title--urgent">Urgent assistance</h3>
        <div className="gs-help-list">
          <div>
            <div className="gs-help-label">Call or text</div>
            <a href="tel:+12026702515" className="gs-help-value">202-670-2515</a>
          </div>
          <div>
            <div className="gs-help-label">Signal</div>
            <a
              href="https://signal.me/#eu/8Fqs5tNMxAlyxNYU9sNZauQgj3JBZDpobm1QuTHSFrROW9_zoRJKQ4ZdWQ0yiO45"
              target="_blank"
              rel="noopener"
              className="gs-help-value"
            >
              @sclu.01
            </a>
          </div>
          <div>
            <div className="gs-help-label">Email</div>
            <a href="mailto:danieln@thesclu.org" className="gs-help-value gs-help-value--email">danieln@thesclu.org</a>
          </div>
        </div>
      </div>
      <div className="gs-help-block--second">
        <h3 className="gs-help-title">Crisis support</h3>
        <div className="gs-help-list">
          <div>
            <div className="gs-help-label">Suicide &amp; Crisis Lifeline · call or text</div>
            <a href="tel:988" className="gs-help-value">988</a>
          </div>
          <div>
            <div className="gs-help-label">Crisis Text Line · text HOME</div>
            <a href="sms:741741" className="gs-help-value">741741</a>
          </div>
          <div>
            <div className="gs-help-label">Sexual assault hotline · RAINN</div>
            <a href="tel:8006564673" className="gs-help-value">800-656-4673</a>
          </div>
          <div>
            <div className="gs-help-label">Immediate danger</div>
            <a href="tel:911" className="gs-help-value">911</a>
          </div>
        </div>
      </div>
    </>
  );
}
