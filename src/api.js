const BASE = process.env.REACT_APP_API_BASE;

async function handleJson(res) {
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    // ★ 生レスポンスを必ず記録（本番前に消せばOK）
    console.debug("[API raw]", res.url, res.status, text);

    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  // return res.json();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text?.slice(0, 400)}`);
  }

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
