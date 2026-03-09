const { URL } = require("url");

function pickMetaContent(html, patterns, pageUrl = "") {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match || !match[1]) continue;
    const value = match[1].trim();
    if (!value) continue;

    if (pattern.toString().includes("image")) {
      try {
        return new URL(value, pageUrl).href;
      } catch {
        continue;
      }
    }

    return value;
  }
  return "";
}

function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractParagraphText(html = "", limit = 1800) {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const text = matches
    .slice(0, 14)
    .map((item) => stripHtml(item[1]))
    .filter(Boolean)
    .join("\n\n")
    .slice(0, limit);
  return text;
}

function toISODate(value = "") {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
}

async function extractArticleData(sourceUrl) {
  const response = await fetch(sourceUrl, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const html = await response.text();
  const title = pickMetaContent(html, [
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i,
    /<title[^>]*>([\s\S]*?)<\/title>/i
  ]);
  const summary = pickMetaContent(html, [
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["'][^>]*>/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i
  ]);
  const image = pickMetaContent(
    html,
    [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i
    ],
    sourceUrl
  );
  const publishedRaw = pickMetaContent(html, [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']article:published_time["'][^>]*>/i,
    /<meta[^>]+name=["']pubdate["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<time[^>]+datetime=["']([^"']+)["'][^>]*>/i
  ]);

  return {
    title: stripHtml(title).slice(0, 160),
    summary: stripHtml(summary).slice(0, 320),
    content: extractParagraphText(html),
    image,
    date: toISODate(publishedRaw)
  };
}

module.exports = {
  extractArticleData
};
