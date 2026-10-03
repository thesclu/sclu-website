// Cloudflare Pages Function — replaces the old Next.js API route, which
// can't run under static export (no server to host it on).
//
// Validates the submission server-side (never trust the client), then
// emails it via Postmark — the same provider already handling the
// requests.thesclu.org CPRA/FOIA pipeline, so this isn't a new vendor in
// the stack. Needs two secrets set in the Cloudflare Pages dashboard
// (Settings -> Environment variables), not committed here:
//   POSTMARK_TOKEN  — a Postmark Server API token
//   POSTMARK_FROM   — a sender address verified in that Postmark account
// Optional:
//   POSTMARK_TO     — defaults to intake@thesclu.org if unset
//
// There is no PGP step yet — see the handoff conversation. Until that's
// added, the submission is protected only by TLS to Postmark and
// Proton's at-rest encryption once it lands in the intake mailbox.

function str(v, max = 2000) {
  return typeof v === "string" ? v.slice(0, max) : "";
}

function validate(body) {
  const age = str(body.age, 20);
  if (!["under13", "teen", "adult"].includes(age)) return "age is required";

  const isUnder13 = age === "under13";
  if (isUnder13) {
    if (!str(body.guardianName).trim() || !str(body.guardianEmail).trim() || body.guardianConsent !== "yes") {
      return "guardian name, email, and consent are required";
    }
  } else if (!str(body.email).trim()) {
    return "email is required";
  }

  const role = str(body.role, 20);
  if (!["student", "faculty", "parent", "other"].includes(role)) return "role is required";

  if (!str(body.issue, 40).trim()) return "issue is required";

  for (const field of ["where", "when", "what", "triedSteps", "lawyer"]) {
    if (!str(body[field]).trim()) return `${field} is required`;
  }

  const ask = Array.isArray(body.ask) ? body.ask.map((a) => str(a, 100)).filter(Boolean) : [];
  if (ask.length === 0) return "pick at least one requested action";
  if (ask.includes("Something else") && !str(body.askOther).trim()) {
    return "askOther is required when 'Something else' is checked";
  }

  if (body.consentNoAdvice !== "yes" || body.consentShare !== "yes" || body.consentSensitive !== "yes") {
    return "all three consent checkboxes are required";
  }

  return null;
}

function formatEmail(body) {
  const age = str(body.age, 20);
  const isUnder13 = age === "under13";
  const ask = Array.isArray(body.ask) ? body.ask.map((a) => str(a, 100)) : [];

  const contact = isUnder13
    ? [
        `Submitting as: parent/guardian of a minor under 13`,
        `Guardian name: ${str(body.guardianName, 200)}`,
        `Relationship: ${str(body.guardianRelationship, 100)}`,
        `Guardian email: ${str(body.guardianEmail, 200)}`,
        `Guardian phone: ${str(body.guardianPhone, 60)}`,
        `Child's first name: ${str(body.kidFirstName, 200)}`,
      ]
    : [
        `Name: ${str(body.firstName, 200)} ${str(body.lastName, 200)}`.trim(),
        `Email: ${str(body.email, 200)}`,
        `Phone: ${str(body.phone, 60)}`,
      ];

  const lines = [
    `Age range: ${age}`,
    ...contact,
    `Role: ${str(body.role, 20)}`,
    "",
    `Issue type: ${str(body.issue, 40)}`,
    `Where: ${str(body.where, 300)}`,
    `When: ${str(body.when, 300)}`,
    "",
    `What happened:`,
    str(body.what, 8000),
    "",
    `Steps already taken:`,
    str(body.triedSteps, 4000),
    "",
    `Existing lawyer: ${str(body.lawyer, 300) || "(none given)"}`,
    `Contacted others: ${str(body.contactedOthers, 300) || "(none given)"}`,
    "",
    `Requested action(s): ${ask.join(", ")}`,
    ask.includes("Something else") ? `  Other: ${str(body.askOther, 300)}` : null,
    `Upcoming date: ${str(body.upcomingDate, 20) || "(none given)"}`,
    `Documents: ${str(body.docs, 2000) || "(none described)"}`,
  ].filter((l) => l !== null);

  return lines.join("\n");
}

export async function onRequestPost({ request, env }) {
  const json = (data, status) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const err = validate(body);
  if (err) return json({ error: err }, 400);

  if (!env.POSTMARK_TOKEN || !env.POSTMARK_FROM) {
    return json({ error: "server not configured" }, 500);
  }

  const to = env.POSTMARK_TO || "intake@thesclu.org";
  const subject = `Get Support request — ${str(body.issue, 40)} — ${str(body.role, 20)}`;

  const pmRes = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": env.POSTMARK_TOKEN,
    },
    body: JSON.stringify({
      From: env.POSTMARK_FROM,
      To: to,
      ReplyTo: body.age === "under13" ? str(body.guardianEmail, 200) : str(body.email, 200),
      Subject: subject,
      TextBody: formatEmail(body),
      MessageStream: "outbound",
    }),
  });

  if (!pmRes.ok) {
    return json({ error: "failed to send" }, 502);
  }

  return json({ ok: true }, 201);
}
