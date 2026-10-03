import "./get-support.css";
import GetSupportHeader from "../../components/GetSupportHeader";
import GetSupportForm from "../../components/GetSupportForm";
import SupportHelpBlocks from "../../components/SupportHelpBlocks";

export const metadata = {
  title: "Get Support — SCLU",
  description:
    "Request assistance from SCLU: advising, investigation, legal assistance, or advocacy for students and youth whose rights have been affected on or off campus.",
};

const DONATE_URL =
  "https://www.zeffy.com/en-US/donation-form/donate-to-empower-youth-organizing-in-san-diego-2";

export default function GetSupportPage() {
  return (
    <div className="gs-root">
      {/* Matches the design prototype's font loading exactly (Google Fonts
          CDN, variable weight axis) rather than next/font, since Next hoists
          any <link> rendered here into <head> automatically. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300..900&display=swap"
        rel="stylesheet"
      />

      <GetSupportHeader />

      <div className="gs-main">
        <div className="gs-main-inner">
          <div className="gs-row">
            <aside className="gs-sidebar">
              <SupportHelpBlocks />
            </aside>

            <div className="gs-content">
              <h1 className="gs-h1">Request Assistance</h1>

              <div className="gs-intro">
                <p>
                  This form is intended for students and youth whose rights have been affected on or off
                  campus. Depending on your situation, we can offer advising, investigation, legal assistance, or
                  advocacy.
                </p>
                <p>
                  We do our best to help everyone who reaches out. Because our resources are limited, attorney
                  representation may not be available in every case, but we can often pair you with a volunteer
                  advisor from our team. Unless and until SCLU agrees to take your case, you are solely
                  responsible for any statutes of limitations or other deadlines that apply to your situation,
                  including school appeal and grievance deadlines. If you&rsquo;re concerned about a deadline, or
                  your situation needs immediate attention, contact us via our urgent lines and/or you may wish
                  to seek advice from an attorney.
                </p>
                <p>
                  Faculty, staff, parents, and others may also submit a request, though we prioritize students
                  and youth. If your issue doesn&rsquo;t involve students or youth, you may also wish to contact
                  your{" "}
                  <a href="https://www.aclu.org/about/affiliates" target="_blank" rel="noopener">
                    local ACLU affiliate
                  </a>
                  .
                </p>
                <p className="gs-urgent-line">
                  If you need urgent assistance, call or text <a href="tel:2026702515">202-670-2515</a>, or
                  reach out on Signal at <strong>@sclu.01</strong>.
                </p>
              </div>

              <GetSupportForm />
            </div>
          </div>
        </div>
      </div>

      <div className="gs-bottom-help">
        <div className="gs-bottom-help-container">
          <div className="gs-bottom-help-inner">
            <h2 className="gs-bottom-help-title">Need assistance now?</h2>
            <SupportHelpBlocks />
          </div>
        </div>
      </div>

      <div className="gs-footer">
        <div className="gs-footer-inner">
          <span>
            © 2026 SCLU, a 501(c)(4) social welfare organization. Contributions are not tax-deductible.
            Tax-deductible gifts support the SCLU Foundation, our 501(c)(3).
          </span>
          <span className="gs-footer-links">
            <span>Campaigns</span>
            <span>Press</span>
            <span>About</span>
            <a href={DONATE_URL} target="_blank" rel="noopener">Donate</a>
            <a href="https://www.instagram.com/sclu.sd/" target="_blank" rel="noopener">Instagram</a>
          </span>
        </div>
      </div>
    </div>
  );
}
