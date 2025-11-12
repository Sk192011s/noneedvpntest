import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const linkMap = new Map<string, string>();

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

serve(async (req) => {
  const url = new URL(req.url);

  // POST method: generate redirect link
  if (req.method === "POST" && url.pathname === "/generate") {
    const form = await req.formData();
    const mfLink = form.get("link")?.toString();
    if (!mfLink) return new Response("Missing link", { status: 400 });

    const id = generateId();
    linkMap.set(id, mfLink);

    return new Response(`
      <p>Your redirect link: <a href="/${id}">https://your-deno-url/${id}</a></p>
      <p><a href="/">Go back</a></p>
    `, { headers: { "Content-Type": "text/html" } });
  }

  // Redirect if ID exists
  const path = url.pathname.substring(1);
  if (linkMap.has(path)) {
    return Response.redirect(linkMap.get(path)!, 302);
  }

  // Default: HTML form
  return new Response(`
    <h2>MediaFire Redirect Generator</h2>
    <form method="POST" action="/generate">
      <input type="text" name="link" placeholder="Enter MediaFire link" style="width:300px;" required />
      <button type="submit">Generate</button>
    </form>
  `, { headers: { "Content-Type": "text/html" } });
});
