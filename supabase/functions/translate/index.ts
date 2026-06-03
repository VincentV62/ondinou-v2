// Edge function: batch FR -> target language translation via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { texts, target = "en", source = "fr" } = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Number entries so the model preserves order and count.
    const numbered = texts.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n");
    const prompt = `Translate each numbered line below from ${source} to ${target}.
Rules:
- Keep emojis, punctuation, numbers, line breaks and casing style.
- Do NOT translate proper nouns (Dinou, ONDINOU, Vincent, restaurant names).
- Return ONLY the translated lines, same numbering, one per line, no extra commentary.

${numbered}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a precise translator. Output only the translated lines." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: "AI gateway error", detail: errText }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    const translations: string[] = texts.map((orig: string, i: number) => {
      const match = lines.find((l) => l.startsWith(`${i + 1}.`));
      if (!match) return orig;
      return match.replace(/^\d+\.\s*/, "");
    });

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
