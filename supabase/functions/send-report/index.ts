import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => unknown;
};

// Environment variables configured in Supabase Dashboard > Project Settings > Functions > send-report
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "gabrielbroliveira@gmail.com";

// Public base URL where PDFs are hosted (GitHub Pages)
const BASE_REPORT_URL = "https://gabrielbribeiroo.github.io/FutureProofNavigator/reports/";

function getReportUrl(area: string) {
  const map: Record<string, string> = {
    tecnologia: "tecnologia.pdf",
    publicidade: "publicidade.pdf",
    financas: "financas.pdf",
    construcao: "construcao.pdf",
    saude: "saude.pdf",
    educacao: "educacao.pdf",
    outra: "outra.pdf",
  };
  const key = (area || "outra").toLowerCase();
  const file = map[key] || map["outra"];
  return BASE_REPORT_URL + file;
}

async function downloadPdf(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar PDF: ${res.status} ${url}`);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function sendEmailWithPdf(to: string, subject: string, html: string, pdfBytes: Uint8Array) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurada");
  const form = new FormData();
  form.append("from", FROM_EMAIL);
  form.append("to", to);
  form.append("subject", subject);
  form.append("html", html);
  form.append("attachments", new File([pdfBytes], "relatorio-impacto-ia.pdf", { type: "application/pdf" }));

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Email send failed: ${res.status} ${await res.text()}`);
}

Deno.serve(async (req) => {
  try {
    const { name, email, area, iaScore, segmentScore, segmentGroup } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const subject = "Seu Relatório de Impacto da IA";
    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Relatório de Impacto da IA</h2>
        <p>Olá ${name || ""},</p>
        <p>Área: <b>${area || "-"}</b></p>
        <p>Score IA: <b>${iaScore ?? "-"}</b>/12<br>
        Segmento: <b>${segmentGroup || "-"}</b> (score ${segmentScore ?? "-"}/16)</p>
        <p>Em anexo, seu PDF de pesquisa.</p>
      </div>
    `;

    const reportUrl = getReportUrl(area || "outra");
    const pdfBytes = await downloadPdf(reportUrl);
    await sendEmailWithPdf(email, subject, html, pdfBytes);

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
