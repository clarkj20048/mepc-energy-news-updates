const fs = require("fs/promises");
const path = require("path");
const { extractImageFromUrl } = require("../utils/extractImageFromUrl");

const backendNewsPath = path.join(__dirname, "..", "data", "news.json");
const frontendNewsPath = path.join(__dirname, "..", "..", "frontend", "src", "data", "news.json");
const forceUpdate = process.argv.includes("--force");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function updateImages(items) {
  const next = [...items];
  let updated = 0;

  for (let i = 0; i < next.length; i += 1) {
    const item = next[i];
    if (!item.sourceUrl) continue;
    if (!forceUpdate && item.image) continue;

    try {
      const imageUrl = await extractImageFromUrl(item.sourceUrl);
      next[i] = { ...item, image: imageUrl };
      updated += 1;
      console.log(`Updated image: ${item.title}`);
    } catch (error) {
      console.warn(`Skipped (${item.title}): ${error.message}`);
    }
  }

  return { next, updated };
}

async function run() {
  try {
    const backendNews = await readJson(backendNewsPath);
    const { next, updated } = await updateImages(backendNews);
    await writeJson(backendNewsPath, next);
    await writeJson(frontendNewsPath, next);
    console.log(`Done. ${updated} item(s) updated.`);
  } catch (error) {
    console.error(`Image sync failed: ${error.message}`);
    process.exit(1);
  }
}

run();
