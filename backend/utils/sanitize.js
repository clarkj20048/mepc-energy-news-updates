function stripTags(value = "") {
  return value.replace(/<[^>]*>/g, "");
}

function sanitizeText(value = "", maxLength = 5000) {
  return stripTags(String(value)).trim().slice(0, maxLength);
}

module.exports = {
  sanitizeText
};
