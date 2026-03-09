const { URL } = require("url");

function matchMetaImage(html, pageUrl, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match || !match[1]) continue;
    try {
      return new URL(match[1], pageUrl).href;
    } catch {
      // Ignore malformed URLs and continue trying.
    }
  }
  return null;
}

async function extractImageFromUrl(pageUrl) {
  const response = await fetch(pageUrl, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; MEPC-News-Bot/1.0)"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const html = await response.text();
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']image_src["'][^>]*>/i
  ];

  const image = matchMetaImage(html, pageUrl, patterns);
  if (!image) {
    throw new Error("No og:image or twitter:image found");
  }
  return image;
}

module.exports = {
  extractImageFromUrl
};
