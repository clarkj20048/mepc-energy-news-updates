const fs = require("fs/promises");
const path = require("path");

const NEWS_FILE = path.join(__dirname, "..", "data", "news.json");
const ADMIN_FILE = path.join(__dirname, "..", "data", "admin.json");

async function readJson(filePath, fallback = []) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }
    throw new Error(`Failed to read ${path.basename(filePath)}: ${error.message}`);
  }
}

async function writeJson(filePath, data) {
  try {
    const payload = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, payload, "utf8");
  } catch (error) {
    throw new Error(`Failed to write ${path.basename(filePath)}: ${error.message}`);
  }
}

async function getNews() {
  return readJson(NEWS_FILE, []);
}

async function saveNews(news) {
  return writeJson(NEWS_FILE, news);
}

async function getAdminUser() {
  return readJson(ADMIN_FILE, null);
}

async function saveAdminUser(user) {
  return writeJson(ADMIN_FILE, user);
}

module.exports = {
  getNews,
  saveNews,
  getAdminUser,
  saveAdminUser
};
