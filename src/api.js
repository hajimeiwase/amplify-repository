const BASE = import.meta.env.VITE_API_BASE; // Viteの場合。CRAなら下に別記

async function handleJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function health() {
  const r = await fetch(`${BASE}/health`);
  return handleJson(r);
}

export async function searchSlides(query) {
  const r = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return handleJson(r);
}

export async function requestDownload(s3Key) {
  const r = await fetch(`${BASE}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ s3_key: s3Key }),
  });
  return handleJson(r);
}
