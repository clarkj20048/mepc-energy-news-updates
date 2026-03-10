const express = require("express");
const path = require("path");
const session = require("express-session");

const apiRoutes = require("./routes/apiRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

const FRONTEND_DIST_PATH = path.join(__dirname, "..", "frontend", "dist");

function createApp() {
  const app = express();
  
  // Trust proxy for production deployments (Vercel, Heroku, etc.)
  // This is needed for secure cookies to work behind a proxy
  app.set("trust proxy", 1);

  // CORS configuration for cross-origin requests
  app.use((req, res, next) => {
    // Allow all origins for development and production to handle deployed frontend
    // Use the request origin if available, otherwise allow all
    const origin = req.headers.origin;
    
    // Set CORS headers - allow the specific origin or fall back to request origin
    // For credentials to work, we need to use the actual origin, not "*"
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      // For same-origin requests (no origin header)
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === "production";
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "replace-this-session-secret-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProduction, // Only use secure in production (requires HTTPS)
        sameSite: isProduction ? "none" : "lax", // "none" requires secure, use "lax" for development
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
        path: "/"
      }
    })
  );

  app.use("/api", apiRoutes);
  app.use("/api", notFoundHandler);

  app.use(express.static(FRONTEND_DIST_PATH));

  app.get("*", (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
  });

  app.use(errorHandler);
  return app;
}

function startServer(port = process.env.PORT || 3000) {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  startServer
};
