import Anthropic from "@anthropic-ai/sdk";
import { getFaqs, getProducts, getServices } from "@/lib/content";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
const hasCredentials = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const client = hasCredentials ? new Anthropic() : null;

type ChatMsg = { role: "user" | "assistant"; content: string };

// The knowledge base changes only when admins edit content; rebuild it every 5 minutes.
let kb: { text: string; at: number } | null = null;
async function knowledgeBase() {
  if (kb && Date.now() - kb.at < 5 * 60_000) return kb.text;
  const [services, products, faqs] = await Promise.all([getServices(), getProducts(), getFaqs()]);
  const text = [
    "## Services",
    ...services.map((s) => `- ${s.title} (${site.url}/services/${s.slug}): ${s.shortDesc} Includes: ${s.features.join("; ")}.`),
    "",
    "## Ready-made products (prices in USD)",
    ...products.map(
      (p) =>
        `- ${p.name} (${site.url}/products/${p.slug}): ${p.tagline} Plans: ${p.plans
          .map((pl) => `${pl.name} $${pl.monthly}/month or $${pl.yearly}/year (${pl.features.join(", ")})`)
          .join("; ")}.`,
    ),
    "",
    "## FAQ",
    ...faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  ].join("\n");
  kb = { text, at: Date.now() };
  return text;
}

async function systemPrompt() {
  return `You are the website assistant for ${site.name}, a custom software company based in ${site.address.full}.
You answer visitors' questions about the company's services, ready-made products and pricing, using only the information below.

Guidelines:
- Be warm, concise and concrete: usually 2-5 short sentences or a brief list. Use plain Markdown sparingly.
- Reply in the same language the visitor writes in (English or Bangla).
- For custom project pricing, give the typical ranges from the FAQ and suggest the cost estimator on the home page (${site.url}/#estimator) or a free discovery call.
- If something isn't covered below, say you're not sure and offer to connect them with the team. Never invent prices, clients, guarantees or timelines.
- To reach a human: call ${site.phoneDisplay}, WhatsApp, email ${site.email}, or the contact page ${site.url}/contact.
- Stay on topic. Politely decline unrelated requests.

# Company knowledge
${await knowledgeBase()}`;
}

/** Keyword fallback used when no Claude credentials are configured */
async function fallbackAnswer(q: string) {
  const text = q.toLowerCase();
  const [services, products] = await Promise.all([getServices(), getProducts()]);
  if (/price|cost|budget|how much|দাম|খরচ/.test(text))
    return `Custom projects usually range from about $3,000 for an MVP to $60,000+ for enterprise platforms. Try our cost estimator on the home page for an instant range, or call ${site.phoneDisplay} for a free consultation.\n\nReady-made products start at ${products
      .map((p) => `${p.name} from $${p.monthlyPrice}/mo`)
      .join(", ")}.`;
  if (/product|software|ready|প্রোডাক্ট/.test(text))
    return `Our ready-made products:\n${products.map((p) => `- **${p.name}**: ${p.tagline}`).join("\n")}\n\nSee ${site.url}/products for plans and demos.`;
  if (/service|offer|do you|সার্ভিস/.test(text))
    return `We offer:\n${services.map((s) => `- **${s.title}**: ${s.shortDesc}`).join("\n")}`;
  if (/contact|call|phone|email|address|office|যোগাযোগ/.test(text))
    return `You can reach us at ${site.phoneDisplay} or ${site.email}. Our office: ${site.address.full}.`;
  return `I can help with our services, products and pricing. For anything else, our team is one call away at ${site.phoneDisplay} or via ${site.url}/contact.`;
}

function textStream(text: string) {
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp()}`, 20, 60_000)) return new Response("Too many messages. Please wait a minute.", { status: 429 });

  const body = (await req.json().catch(() => null)) as { messages?: ChatMsg[] } | null;
  const messages = (body?.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  // The API requires the conversation to start with a user turn
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return new Response("Bad request", { status: 400 });

  if (!client) return textStream(await fallbackAnswer(messages[messages.length - 1].content));

  const system = await systemPrompt();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 4096,
          // Simple Q&A: low effort keeps answers fast and inexpensive
          output_config: { effort: "low" },
          // Retry on another model if a safety classifier declines a benign question
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
          messages,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(`\n\nI can't help with that here, but our team can: ${site.phoneDisplay} or ${site.url}/contact.`));
        }
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          controller.enqueue(encoder.encode("We're getting a lot of questions right now. Please try again in a moment."));
        } else {
          console.error("[chat]", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
          const last = messages[messages.length - 1].content;
          controller.enqueue(encoder.encode(await fallbackAnswer(last)));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
