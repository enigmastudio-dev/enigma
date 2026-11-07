// Vercel Function: GET /api/config
// Hands the browser the PUBLIC Supabase settings from the project's
// environment variables, so nothing has to be typed into js/config.js.
// Works with the variable names the Supabase integration on the Vercel
// Marketplace creates, and with ones you add by hand.
// Never expose SUPABASE_SERVICE_ROLE_KEY here.
module.exports = (req, res) => {
  const env = process.env;
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  const body =
    "(function (c) {\n" +
    "  var o = window.ENIGMA_CONFIG || {};\n" +
    "  if (c.supabaseUrl && c.supabaseAnonKey) { o.supabaseUrl = c.supabaseUrl; o.supabaseAnonKey = c.supabaseAnonKey; }\n" +
    "  window.ENIGMA_CONFIG = o;\n" +
    "})(" + JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key }) + ");\n";

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.statusCode = 200;
  res.end(body);
};
