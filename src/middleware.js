import jwt from "jsonwebtoken"
import fs from "fs"

import logger from "./logger.js"
import { MESSAGES } from "./utils/responseMessages.js"

const publicJwtKey = fs.readFileSync(process.env.PUBLIC_JWT_KEY_FILE, "utf8")

/* ---------------------------- Route definitions --------------------------- */
const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/register/client"]
const ADMIN_ROUTES = ["/api/auth/register/admin"]
const AUTHENTICATED_ROUTES = ["/api/lifts", "/api/application"]
const PERSONAL_ROUTES = [
  "/api/cars",
  "/api/auth/profile",
  "/api/auth/password",
  "/api/lifts",
  "/api/application/filter/username",
]
/* -------------------------------------------------------------------------- */

async function getDecodedToken(token) {
  if (!token) throw new Error("Missing Token")
  return jwt.verify(token, publicJwtKey)
}

const verifyToken = async (req, res, next) => {
  const url = req.originalUrl
  const method = req.method

  /* -------------------------------------------------------------------------- */
  /* ------------------ Option to skip validation on dev mode ----------------- */
  /* -------------------------------------------------------------------------- */
  if (
    process.env.NODE_ENV === "dev" &&
    process.env.SKIP_VALIDATION === "true"
  ) {
    return next()
  }
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /* ------------------------------ Public routes ----------------------------- */
  /* -------------------------------------------------------------------------- */
  if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
    return next()
  }
  /* -------------------------------------------------------------------------- */

  try {
    /* -------------------------------------------------------------------------- */
    /* ---------------------------- Token validation ---------------------------- */
    /* -------------------------------------------------------------------------- */
    const token = req.headers["authorization"]?.split(" ")[1]
    const decodedToken = await getDecodedToken(token)
    const { role, username } = decodedToken
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /* ---------------------------- Admin-only routes --------------------------- */
    /* -------------------------------------------------------------------------- */
    if (
      role === "admin" &&
      ADMIN_ROUTES.some((route) => url.startsWith(route))
    ) {
      return next()
    }
    /* -------------------------------------------------------------------------- */
    /* ------------- Authenticated routes (accessible to all roles) ------------- */
    /* -------------------------------------------------------------------------- */
    if (AUTHENTICATED_ROUTES.some((route) => url.startsWith(route))) {
      return next()
    }

    /* -------------------------------------------------------------------------- */
    /* ---------- Personal routes (only the user themselves can access) --------- */
    /* -------------------------------------------------------------------------- */
    if (PERSONAL_ROUTES.some((route) => url.startsWith(route))) {
      const paramUsername =
        req.params.username || req.query.username || req.body.user
      if (username === paramUsername) {
        return next()
      }
      return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
    }

    /* -------------------------------------------------------------------------- */
    /* ------------------ If no conditions matched, deny access ----------------- */
    /* -------------------------------------------------------------------------- */
    return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
  } catch (err) {
    logger.error("verifyToken - error: ", err)
    return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
    /* -------------------------------------------------------------------------- */
  }
}

export default verifyToken
