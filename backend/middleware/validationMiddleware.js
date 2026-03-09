const { sanitizeText } = require("../utils/sanitize");

function validateNewsPayload(req, res, next) {
  const payload = {
    title: sanitizeText(req.body.title, 160),
    sourceUrl: sanitizeText(req.body.sourceUrl, 500),
    date: sanitizeText(req.body.date, 10),
    summary: sanitizeText(req.body.summary, 320),
    content: sanitizeText(req.body.content, 10000),
    image: sanitizeText(req.body.image, 500),
    category: sanitizeText(req.body.category, 20).toLowerCase() || "latest"
  };

  const errors = [];
  if (!payload.title) errors.push("Title is required.");
  if (!payload.sourceUrl) {
    errors.push("Source URL is required.");
  }
  if (payload.sourceUrl) {
    try {
      // Validate that source URL has a proper scheme and host.
      const parsed = new URL(payload.sourceUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.push("Source URL must use http or https.");
      }
    } catch {
      errors.push("A valid source URL is required.");
    }
  }
  if (payload.date && Number.isNaN(new Date(payload.date).getTime())) {
    errors.push("Date must be valid.");
  }
  if (!["latest", "previous"].includes(payload.category)) {
    errors.push("Category must be latest or previous.");
  }

  req.cleanedNews = payload;
  req.validationErrors = errors;
  next();
}

module.exports = {
  validateNewsPayload
};
