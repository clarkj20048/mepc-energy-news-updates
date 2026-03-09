const express = require("express");

const { validateNewsPayload } = require("../middleware/validationMiddleware");
const {
  isApiAuthenticated,
  getAuthStatus,
  login,
  logout,
  listNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
} = require("../controllers/apiController");

const router = express.Router();

router.get("/auth/status", getAuthStatus);
router.post("/auth/login", login);
router.post("/auth/logout", isApiAuthenticated, logout);

router.get("/news", listNews);
router.get("/news/:slug", getNewsBySlug);

router.post("/admin/news", isApiAuthenticated, validateNewsPayload, createNews);
router.put("/admin/news/:id", isApiAuthenticated, validateNewsPayload, updateNews);
router.delete("/admin/news/:id", isApiAuthenticated, deleteNews);

module.exports = router;
