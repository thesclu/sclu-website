// The real homepage (letter breakdown, Join, Campaigns, etc.) is parked
// at app/_home-wip.jsx.bak -- not a route, so it never builds or ships.
// Right now this site has exactly one real page: /help. The root
// just bounces there. Next's metadata API can't produce an http-equiv
// meta tag (only name/content), so this is rendered directly -- Next
// hoists any <meta>/<title> a Server Component returns into <head>.
// http-equiv is what actually makes a browser redirect; name="refresh"
// (what the metadata API would have produced) is inert.
export const metadata = { title: "SCLU" };

export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/help" />
      <p style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        Redirecting to <a href="/help">Get Support</a>&hellip;
      </p>
    </>
  );
}