"use client";
import { useRef, useState } from "react";

const ISSUES = [
  { id: "harassment", label: "Sexual harassment / Title IX" },
  { id: "speech", label: "Free speech & protest" },
  { id: "conduct", label: "Student conduct / due process" },
  { id: "discrimination", label: "Discrimination" },
  { id: "surveillance", label: "Surveillance & privacy" },
  { id: "police", label: "Campus police" },
  { id: "immigration", label: "Immigration status" },
  { id: "disability", label: "Disability & accommodations" },
  { id: "religion", label: "Religious freedom" },
  { id: "other", label: "Something else" },
];

const ASKS = [
  "Legal advice",
  "Ongoing advising",
  "Investigation",
  "Legal representation",
  "Advocacy",
  "Just letting you know",
];

export default function GetSupportForm() {
  const [age, setAge] = useState(null);
  const [issue, setIssue] = useState(null);
  const [otherAsk, setOtherAsk] = useState(false);
  const [askErr, setAskErr] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState(false);

  const formRef = useRef(null);
  const stageRef = useRef(null);

  const notUnder13 = age !== "under13";
  const isImmigration = issue === "immigration";

  function clearAskErr() {
    if (askErr) setAskErr(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const askChecked = form.querySelectorAll('input[name="ask"]:checked');
    if (askChecked.length === 0) {
      setAskErr(true);
      form.querySelector('input[name="ask"]')?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitErr(false);
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      data.ask = Array.from(askChecked).map((el) => el.value);

      const res = await fetch("/api/get-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad response");

      setSent(true);
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setSubmitErr(true);
    } finally {
      setSubmitting(false);
    }
  }

  function onReset() {
    formRef.current?.reset();
    setAge(null);
    setIssue(null);
    setOtherAsk(false);
    setAskErr(false);
    setSent(false);
    setSubmitErr(false);
  }

  return (
    <div ref={stageRef} className="gs-stage">
      {!sent && (
        <form ref={formRef} onSubmit={onSubmit} className="gs-form" noValidate={false}>
          <div className="gs-section">
            <fieldset className="gs-fieldset">
              <legend className="gs-legend">
                How old are you?<span className="gs-required" aria-hidden="true">*</span>
              </legend>
              <div className="gs-option-row">
                <label className="gs-option-pill">
                  <input type="radio" name="age" value="under13" required onChange={(e) => setAge(e.target.value)} />
                  Under 13
                </label>
                <label className="gs-option-pill">
                  <input type="radio" name="age" value="teen" onChange={(e) => setAge(e.target.value)} />
                  13 to 17
                </label>
                <label className="gs-option-pill">
                  <input type="radio" name="age" value="adult" onChange={(e) => setAge(e.target.value)} />
                  18 or older
                </label>
              </div>
            </fieldset>

            {notUnder13 && (
              <>
                <div className="gs-field-row">
                  <div className="gs-field">
                    <label htmlFor="c-fname" className="gs-label">First name</label>
                    <input id="c-fname" name="firstName" type="text" autoComplete="given-name" className="gs-input" />
                  </div>
                  <div className="gs-field">
                    <label htmlFor="c-lname" className="gs-label">Last name</label>
                    <input id="c-lname" name="lastName" type="text" autoComplete="family-name" className="gs-input" />
                  </div>
                </div>
                <div className="gs-field-row">
                  <div className="gs-field">
                    <label htmlFor="c-email" className="gs-label">
                      Email<span className="gs-required" aria-hidden="true">*</span>
                    </label>
                    <input id="c-email" name="email" type="email" autoComplete="email" required className="gs-input" />
                  </div>
                  <div className="gs-field">
                    <label htmlFor="c-phone" className="gs-label">Phone</label>
                    <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="gs-input" />
                  </div>
                </div>
              </>
            )}

            {age === "under13" && (
              <div className="gs-panel-under13">
                <p className="gs-panel-note">
                  Because you&rsquo;re under 13, you must fill this out with your parent or guardian.
                </p>
                <div className="gs-field-row">
                  <div className="gs-field">
                    <label htmlFor="c-kname" className="gs-label">Your first name</label>
                    <input id="c-kname" name="kidFirstName" type="text" className="gs-input" />
                  </div>
                  <div className="gs-field">
                    <label htmlFor="c-aname" className="gs-label">
                      Parent or guardian&rsquo;s name<span className="gs-required" aria-hidden="true">*</span>
                    </label>
                    <input id="c-aname" name="guardianName" type="text" required className="gs-input" />
                  </div>
                  <div className="gs-field">
                    <label htmlFor="c-arel" className="gs-label">Relationship to you</label>
                    <input id="c-arel" name="guardianRelationship" type="text" placeholder="e.g. mother, legal guardian" className="gs-input" />
                  </div>
                </div>
                <div className="gs-field-row">
                  <div className="gs-field" style={{ flexBasis: 240 }}>
                    <label htmlFor="c-aemail" className="gs-label">
                      Their email<span className="gs-required" aria-hidden="true">*</span>
                    </label>
                    <input id="c-aemail" name="guardianEmail" type="email" required className="gs-input" />
                  </div>
                  <div className="gs-field" style={{ flexBasis: 240 }}>
                    <label htmlFor="c-aphone" className="gs-label">Their phone</label>
                    <input id="c-aphone" name="guardianPhone" type="tel" className="gs-input" />
                  </div>
                </div>
                <label className="gs-checkbox-line">
                  <input type="checkbox" name="guardianConsent" value="yes" required />
                  <span>
                    I&rsquo;m this young person&rsquo;s parent or legal guardian, and SCLU may contact me about this request.
                    <span className="gs-required" aria-hidden="true">*</span>
                  </span>
                </label>
              </div>
            )}

            <fieldset className="gs-fieldset">
              <legend className="gs-legend">
                You are a…<span className="gs-required" aria-hidden="true">*</span>
              </legend>
              <div className="gs-option-row">
                <label className="gs-option-pill">
                  <input type="radio" name="role" value="student" required /> Student
                </label>
                <label className="gs-option-pill">
                  <input type="radio" name="role" value="faculty" /> Faculty or staff
                </label>
                <label className="gs-option-pill">
                  <input type="radio" name="role" value="parent" /> Parent or family
                </label>
                <label className="gs-option-pill">
                  <input type="radio" name="role" value="other" /> Someone else
                </label>
              </div>
            </fieldset>
          </div>

          <div className="gs-section">
            <div className="gs-legend gs-legend--block">
              What type of issue is this?<span className="gs-required" aria-hidden="true">*</span>
            </div>
            <div role="radiogroup" aria-label="What type of issue is this?" className="gs-issue-grid">
              {ISSUES.map((opt, i) => (
                <label key={opt.id} className={`gs-issue-option ${issue === opt.id ? "gs-issue-option--selected" : ""}`}>
                  <input
                    type="radio"
                    name="issue"
                    value={opt.id}
                    required={i === 0}
                    onChange={(e) => setIssue(e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="gs-section">
            <div className="gs-field-row">
              <div className="gs-field" style={{ flexBasis: 220 }}>
                <label htmlFor="c-where" className="gs-label">
                  Where did it happen?<span className="gs-required" aria-hidden="true">*</span>
                </label>
                <input id="c-where" name="where" type="text" required placeholder="School, city, or place" className="gs-input" />
              </div>
              <div className="gs-field" style={{ flexBasis: 220 }}>
                <label htmlFor="c-when" className="gs-label">
                  When did it happen?<span className="gs-required" aria-hidden="true">*</span>
                </label>
                <input id="c-when" name="when" type="text" required placeholder="As specific as you can" className="gs-input" />
              </div>
            </div>

            <div>
              <label htmlFor="c-what" className="gs-label gs-label--block">
                Tell us what happened<span className="gs-required" aria-hidden="true">*</span>
              </label>
              {isImmigration && (
                <div className="gs-imm-note">
                  Please don&rsquo;t put your immigration status in this form. We&rsquo;ll talk about it by phone.
                </div>
              )}
              <textarea
                id="c-what"
                name="what"
                required
                rows={8}
                placeholder="In your own words — what happened, who was involved, and when."
                className="gs-textarea"
              />
            </div>

            <div>
              <label htmlFor="c-tried" className="gs-label">
                Have you tried to resolve this issue?<span className="gs-required" aria-hidden="true">*</span>
              </label>
              <textarea
                id="c-tried"
                name="triedSteps"
                required
                rows={3}
                placeholder="Please tell us what steps you have taken, including any complaints you have filed with your school, a government agency, the police, or a court, and how they have been handled so far."
                className="gs-textarea"
              />
            </div>

            <div className="gs-field-row">
              <div className="gs-field" style={{ flexBasis: 280 }}>
                <label htmlFor="c-lawyer" className="gs-label">Do you have a lawyer for this?</label>
                <input id="c-lawyer" name="lawyer" type="text" placeholder="If yes, their name and contact" className="gs-input" />
              </div>
              <div className="gs-field" style={{ flexBasis: 280 }}>
                <label htmlFor="c-nocontact" className="gs-label">Is there anyone we should not contact?</label>
                <input id="c-nocontact" name="noContact" type="text" placeholder="Name or role" className="gs-input" />
              </div>
            </div>

            <fieldset className="gs-fieldset">
              <legend className="gs-legend">
                What would you like SCLU to do?<span className="gs-required" aria-hidden="true">*</span>
              </legend>
              <div className="gs-option-row">
                {ASKS.map((label) => (
                  <label key={label} className="gs-option-pill">
                    <input type="checkbox" name="ask" value={label} onChange={clearAskErr} />
                    {label}
                  </label>
                ))}
                <label className="gs-option-pill">
                  <input
                    type="checkbox"
                    name="ask"
                    value="Something else"
                    onChange={(e) => {
                      setOtherAsk(e.target.checked);
                      setAskErr(false);
                    }}
                  />
                  Something else
                </label>
              </div>
              {askErr && <div role="alert" className="gs-error">Pick at least one.</div>}
              {otherAsk && (
                <div className="gs-ask-other">
                  <label htmlFor="c-askother" className="gs-label">What else would you like us to do?</label>
                  <input id="c-askother" name="askOther" type="text" required placeholder="Type your answer" className="gs-input" />
                </div>
              )}
            </fieldset>

            <div style={{ maxWidth: 420 }}>
              <label htmlFor="c-date" className="gs-label">
                Anything coming up? <span className="gs-hint">hearing, deadline</span>
              </label>
              <input id="c-date" name="upcomingDate" type="date" className="gs-input" />
            </div>

            <div>
              <label htmlFor="c-docs" className="gs-label">Do you have any documents?</label>
              <textarea
                id="c-docs"
                name="docs"
                rows={3}
                placeholder="Describe any notices, emails, screenshots, or other records. We'll ask for copies if we need them."
                className="gs-textarea"
              />
            </div>

            <div id="disclaimer" className="gs-disclaimer">
              <h3>Disclaimer and notice</h3>
              <p>
                This form is not legal advice, and you should not rely on anything on this site as legal advice.
                For advice about your specific situation, speak with a lawyer. We cannot promise that the
                information on this site is complete, accurate, or up to date.
              </p>
              <p>
                Submitting this form does not create an attorney-client relationship with SCLU, and it is not an
                offer by SCLU to represent you. We cannot promise that the information you provide will lead to
                any particular action by SCLU.
              </p>
              <p>
                By submitting this form, you agree that the Students&rsquo; Civil Liberties Union, the Students&rsquo;
                Civil Liberties Foundation, their affiliates, and coalition partners may use the information you
                provide, without your name, address, email, or phone number, for one or more of the following:
                (1) legislative testimony, (2) litigation, (3) contacting a school, city, state, or federal
                agency, or (4) telling your story to the public, including the media. If any of them wants to
                identify you, we will contact you first.
              </p>
              <p>
                We will keep your name, address, phone number, and email confidential unless you give us
                permission to share them or a court orders us to disclose them, and we will try to prevent any
                such disclosure.
              </p>
            </div>

            <fieldset className="gs-fieldset gs-confirm-fieldset">
              <legend className="gs-legend">
                Before you submit, please confirm:<span className="gs-required" aria-hidden="true">*</span>
              </legend>
              <label className="gs-checkbox-line">
                <input type="checkbox" name="consentNoAdvice" value="yes" required />
                <span>
                  I understand that this form is not legal advice and that submitting it does not create an
                  attorney-client relationship with SCLU.
                </span>
              </label>
              <label className="gs-checkbox-line">
                <input type="checkbox" name="consentShare" value="yes" required />
                <span>
                  I agree that the Students&rsquo; Civil Liberties Union and the Students&rsquo; Civil Liberties
                  Foundation may share my information with each other and use it as described in the{" "}
                  <a href="#disclaimer">disclaimer and notice</a> above.
                </span>
              </label>
              <label className="gs-checkbox-line">
                <input type="checkbox" name="consentSensitive" value="yes" required />
                <span>
                  I agree that SCLU may use any sensitive personal information I provide to review my request and
                  follow up with me. I can withdraw this consent at any time by emailing privacy@thesclu.org,
                  though doing so may mean withdrawing my request.
                </span>
              </label>
            </fieldset>

            {submitErr && (
              <div role="alert" className="gs-error">
                Something went wrong sending your request. Please try again, or call/text{" "}
                <a href="tel:2026702515">202-670-2515</a>.
              </div>
            )}

            <div className="gs-submit-row">
              <button type="submit" className="gs-submit-btn" disabled={submitting}>
                {submitting ? "Sending…" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}

      {sent && (
        <div className="gs-confirmation">
          <span className="gs-confirmation-bar" />
          <h2>We&rsquo;ve got it.</h2>
          <p className="gs-confirmation-lede">
            A person from our legal team will reach out within 2 business days. If something urgent comes up
            before then, call <strong>202-670-2515</strong>.
          </p>
          <p className="gs-confirmation-tip">
            In the meantime, save everything — emails, texts, notices, screenshots — and write down names and
            dates while you remember them.
          </p>
          <button type="button" onClick={onReset} className="gs-send-another">
            Send another
          </button>
        </div>
      )}
    </div>
  );
}
