"use client";
import { useRef, useState } from "react";

// --------------------------------------------------------------------
// TEMPORARY: submissions go straight to FormSubmit's AJAX endpoint from
// the browser, with no backend of our own at all. This is an explicit,
// short-term stopgap — a third party (FormSubmit) sees every field,
// including the sensitive free-text ones, in plaintext, and there's no
// server-side re-validation of anything the client sends. Swap this one
// constant (and the fetch call below) for a real endpoint — the
// Cloudflare Pages Function at functions/api/get-support.js already
// does real validation and sends via Postmark — once that's ready.
//
// FormSubmit requires a one-time activation: the first submission to a
// new destination address triggers a confirmation email that must be
// clicked before anything actually gets delivered.
// --------------------------------------------------------------------
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/intake@thesclu.org";

// FormSubmit caps the combined size of attachments at 10 MB; stay under it
// with room for the rest of the request.
const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024;
const ACCEPTED_FILES = ".pdf,.png,.jpg,.jpeg,.heic,.gif,.doc,.docx,.txt,.rtf,.zip";

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [files, setFiles] = useState([]);
  const [fileErr, setFileErr] = useState("");

  const formRef = useRef(null);
  const stageRef = useRef(null);

  function addFiles(picked) {
    const next = [...files];
    for (const f of picked) {
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    const total = next.reduce((n, f) => n + f.size, 0);
    if (next.length > MAX_FILES) {
      setFileErr(`You can attach up to ${MAX_FILES} files. If you have more, put them in a .zip.`);
      return;
    }
    if (total > MAX_TOTAL_BYTES) {
      setFileErr(`Attachments can total up to ${formatSize(MAX_TOTAL_BYTES)}. Tell us about the rest below and we'll ask for copies.`);
      return;
    }
    setFileErr("");
    setFiles(next);
  }

  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index));
    setFileErr("");
  }

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
      const body = new FormData(form);
      const askList = Array.from(askChecked).map((el) => el.value);
      // FormSubmit just drops fields into an email body, so one joined
      // string is clearer than a repeated field.
      body.delete("ask");
      body.set("ask", askList.join(", "));
      body.set("_subject", `Get Support request — ${body.get("issue") || "unspecified issue"}`);
      body.set("_replyto", body.get("age") === "under13" ? body.get("guardianEmail") : body.get("email"));
      body.set("_template", "table");
      for (const f of files) body.append("attachment", f);

      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error("bad response");
      // FormSubmit answers 200 even when it refuses the submission (for
      // example an unactivated form), so the HTTP status alone proves nothing.
      const result = await res.json();
      if (String(result.success) !== "true") throw new Error(result.message || "not delivered");

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
    setFiles([]);
    setFileErr("");
  }

  return (
    <div ref={stageRef} className="gs-stage">
      {!sent && (
        <form ref={formRef} onSubmit={onSubmit} className="gs-form" noValidate={false}>
          {/* FormSubmit honeypot — bots fill every field; humans never see
              this one, so a non-empty value here means discard silently. */}
          <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

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
              <label htmlFor="c-what" className="gs-label">
                What happened<span className="gs-required" aria-hidden="true">*</span>
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
                placeholder="Include who was involved and what was said or done."
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
                <label htmlFor="c-lawyer" className="gs-label">
                  Do you have a lawyer for this?<span className="gs-required" aria-hidden="true">*</span>
                </label>
                <input id="c-lawyer" name="lawyer" type="text" required placeholder="No, or their name and contact" className="gs-input" />
              </div>
              <div className="gs-field" style={{ flexBasis: 280 }}>
                <label htmlFor="c-contacted" className="gs-label">Have you contacted anyone else?</label>
                <input id="c-contacted" name="contactedOthers" type="text" placeholder="e.g. media, advocacy groups" className="gs-input" />
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
          </div>

          <div className="gs-section">
            <div>
              <span className="gs-label">Attach any documents you have</span>
              <p className="gs-file-help">
                Notices, emails, screenshots, or other records. Up to {MAX_FILES} files,{" "}
                {formatSize(MAX_TOTAL_BYTES)} total. PDF, images, Word, text, or .zip.
              </p>
              <label className="gs-file-btn">
                Choose files
                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_FILES}
                  className="gs-file-input"
                  onChange={(e) => {
                    addFiles(Array.from(e.target.files));
                    e.target.value = "";
                  }}
                />
              </label>
              {fileErr && <div role="alert" className="gs-error">{fileErr}</div>}
              {files.length > 0 && (
                <ul className="gs-file-list">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${f.size}`}>
                      <span className="gs-file-name">{f.name}</span>
                      <span className="gs-file-size">{formatSize(f.size)}</span>
                      <button type="button" className="gs-file-remove" onClick={() => removeFile(i)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="c-docs" className="gs-label">Describe your documents</label>
              <textarea
                id="c-docs"
                name="docs"
                rows={3}
                placeholder="If you can't attach them, tell us what you have and we'll ask for copies."
                className="gs-textarea"
              />
            </div>
          </div>

          <div className="gs-closing">
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
