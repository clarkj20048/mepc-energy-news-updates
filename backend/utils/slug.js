function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ensureUniqueSlug(baseSlug, existingSlugs = [], currentId = null, items = []) {
  const seed = baseSlug || "untitled";
  let slug = seed;
  let counter = 1;

  while (
    existingSlugs.includes(slug) &&
    items.some((item) => item.slug === slug && item.id !== currentId)
  ) {
    slug = `${seed}-${counter++}`;
  }

  return slug;
}

module.exports = {
  slugify,
  ensureUniqueSlug
};
