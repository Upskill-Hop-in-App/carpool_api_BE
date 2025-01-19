import jwt from "jsonwebtoken"
import fs from "fs"

import logger from "./logger.js"
import { MESSAGES } from "./utils/responseMessages.js"
import Application from "./models/applicationModel.js"
import Lift from "./models/liftModel.js"

const publicJwtKey = fs.readFileSync(process.env.PUBLIC_JWT_KEY_FILE, "utf8")

/* ---------------------------- Route definitions --------------------------- */
const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/register/client"]
const AUTHENTICATED_GET_ROUTES = ["/api/lifts", "/api/applications"]
const PERSONAL_ROUTES = [
  "/api/cars",
  "/api/auth/profile",
  "/api/auth/password",
  "/api/lifts",
  "/api/applications",
  "/api/auth/delete",
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
    logger.debug("VALIDATION SKIPPED!")
    return next()
  }
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /* ------------------------------ Public routes ----------------------------- */
  /* -------------------------------------------------------------------------- */
  if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
    logger.debug("Public routes: Access allowed")
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
    /* ------------------------------ Admin access ------------------------------ */
    /* -------------------------------------------------------------------------- */
    if (role === "admin") {
      logger.debug("Admin: Access allowed")
      return next()
    }
    /* -------------------------------------------------------------------------- */
    /* ------------- Authenticated routes (accessible to all roles) ------------- */
    /* -------------------------------------------------------------------------- */
    if (
      AUTHENTICATED_GET_ROUTES.some((route) => url.startsWith(route)) &&
      method === "GET"
    ) {
      logger.debug("Authenticated: Access allowed")
      return next()
    }

    /* -------------------------------------------------------------------------- */
    /* ---------- Personal routes (only the user themselves can access) --------- */
    /* -------------------------------------------------------------------------- */
    if (PERSONAL_ROUTES.some((route) => url.startsWith(route))) {
      const paramsUsername = [req.body.passenger]

      /* -------------------------------------------------------------------------- */
      /* --------------------------- Create applications -------------------------- */
      /* -------------------------------------------------------------------------- */
      if (url.startsWith("/api/applications") && method === "POST") {
        if (username && paramsUsername.every((param) => param !== username)) {
          logger.error(
            "Personal routes error: username !== paramPassengerUsername"
          )
          return res
            .status(403)
            .json({ error: MESSAGES.ACCESS_DENIED, err: "personal" })
        }
      }
      /* -------------------------------------------------------------------------- */

      /* -------------------------------------------------------------------------- */
      /* ----------------------- Accept Reject Applications ----------------------- */
      /* -------------------------------------------------------------------------- */
      if (
        url.startsWith("/api/applications/accept") ||
        url.startsWith("/api/applications/reject")
      ) {
        const liftFound = await Lift.findOne({ ca: req.params?.ca }).populate(
          "driver"
        )

        if (username !== liftFound.driver.username) {
          return res.status(403).json({
            error: MESSAGES.ACCESS_DENIED,
            err: "application accept reject",
          })
        }
      }
      /* -------------------------------------------------------------------------- */

      /* -------------------------------------------------------------------------- */
      /* --------------------------- Cancel Applications -------------------------- */
      /* -------------------------------------------------------------------------- */
      if (url.startsWith("/api/applications/cancel")) {
        const applicationFound = await Application.findOne({
          ca: req.params?.ca,
        }).populate("passenger")

        if (username !== applicationFound.passenger.username) {
          return res.status(403).json({
            error: MESSAGES.ACCESS_DENIED,
            err: "application accept reject",
          })
        }
      }
      /* -------------------------------------------------------------------------- */

      logger.debug("Personal routes: Access allowed")
      return next()
    }

    /* -------------------------------------------------------------------------- */
    /* ------------------ If no conditions matched, deny access ----------------- */
    /* -------------------------------------------------------------------------- */
    logger.error("Personal routes error: no conditions matched")
    return res
      .status(403)
      .json({ error: MESSAGES.ACCESS_DENIED, err: "no conditions" })
  } catch (err) {
    logger.error("verifyToken - error: ", err)
    return res.status(403).json({ error: MESSAGES.ACCESS_DENIED, err: "catch" })
    /* -------------------------------------------------------------------------- */
  }
}

export default verifyToken
