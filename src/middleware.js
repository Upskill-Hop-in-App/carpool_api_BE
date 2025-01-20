import jwt from "jsonwebtoken"
import fs from "fs"
import logger from "./logger.js"
import { MESSAGES } from "./utils/responseMessages.js"
import Application from "./models/applicationModel.js"
import Lift from "./models/liftModel.js"
import Car from "./models/carModel.js"

const publicJwtKey = fs.readFileSync(process.env.PUBLIC_JWT_KEY_FILE, "utf8")

/* -------------------------------------------------------------------------- */
/* ---------------------------- Route Definitions --------------------------- */
/* -------------------------------------------------------------------------- */
const ROUTES = {
  PUBLIC: ["/api/auth/login", "/api/auth/register/client"],
  AUTHENTICATED_GET: ["/api/lifts", "/api/applications"],
  PERSONAL: [
    "/api/cars",
    "/api/auth/profile",
    "/api/auth/password",
    "/api/lifts",
    "/api/applications",
    "/api/auth/delete",
  ],
}
/* -------------------------------------------------------------------------- */

const isDevMode =
  process.env.NODE_ENV === "dev" && process.env.SKIP_VALIDATION === "true"

export const getTokenFromHeaders = (headers) =>
  headers["authorization"]?.split(" ")[1]

const getDecodedToken = async (token) => {
  if (!token) throw new Error("Missing Token")
  return jwt.verify(token, publicJwtKey)
}

const isRouteAccessible = (routes, url, method = null) => {
  return (
    routes.some((route) => url.startsWith(route)) &&
    (!method || method === "GET")
  )
}

const handleCarRoutes = async (url, method, username, req) => {
  if (url.startsWith("/api/cars")) {
    if ((method === "POST" || method === "PUT") && req.body.user === username)
      return true

    if (method === "DELETE") {
      const carFound = await Car.findOne({ cc: req.params.cc }).populate("user")
      return carFound?.user?.username === username
    }
  }
  return false
}

const handleAuthRoutes = (url, username, req) => {
  if (url.startsWith("/api/auth") && req.params?.username === username)
    return true
  return false
}

const handleApplicationRoutes = async (url, method, username, req) => {
  if (url.startsWith("/api/applications")) {
    if (method === "POST" && req.body.passenger === username) return true

    if (
      url.startsWith("/api/applications/accept") ||
      url.startsWith("/api/applications/ready") ||
      url.startsWith("/api/applications/ca/rating") ||
      url.startsWith("/api/applications/reject")
    ) {
      const liftFound = await Lift.findOne({ ca: req.params?.ca }).populate(
        "driver"
      )
      return liftFound?.driver?.username === username
    }

    if (url.startsWith("/api/applications/cancel")) {
      const applicationFound = await Application.findOne({
        ca: req.params?.ca,
      }).populate("passenger")
      return applicationFound?.passenger?.username === username
    }
  }
  return false
}

const handleLiftRoutes = async (url, method, username, req) => {
  if (url.startsWith("/api/lifts")) {
    if (url.startsWith("/api/lifts/cl/status") && method === "PUT") {
      const liftFound = await Lift.findOne({ cl: req.params.cl }).populate(
        "driver"
      )
      return liftFound?.driver?.username === username
    } else if (url.startsWith("/api/lifts/cl/rating") && method === "PUT") {
      const liftFound = await Lift.findOne({ cl: req.params.cl })
        .populate("applications")
        .populate({
          path: "applications",
          populate: { path: "passenger", model: "User" },
        })
      const applications = liftFound?.applications
      return applications.some(
        (application) => application?.passenger?.username === username
      )
    } else if (method === "GET") return true

    if ((method === "POST" || method === "PUT") && req.body.driver === username)
      return true

    if (method === "DELETE" && username === req.params?.cl) {
      const liftFound = await Lift.findOne({ cl: req.params.cl }).populate(
        "driver"
      )
      return liftFound?.driver?.username === username
    }
  }
  return false
}

/* -------------------------------------------------------------------------- */
/* ------------------------------ Main function ----------------------------- */
/* -------------------------------------------------------------------------- */
const verifyToken = async (req, res, next) => {
  const { originalUrl: url, method } = req

  if (isDevMode) {
    logger.debug("VALIDATION SKIPPED!")
    return next()
  }

  if (isRouteAccessible(ROUTES.PUBLIC, url)) {
    logger.debug("Public routes: Access allowed")
    return next()
  }

  try {
    const token = getTokenFromHeaders(req.headers)
    const decodedToken = await getDecodedToken(token)
    const { role, username } = decodedToken

    if (!username) {
      logger.error("Invalid Token")
      return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
    }

    if (role === "admin") {
      logger.debug("Admin: Access allowed")
      return next()
    }

    if (isRouteAccessible(ROUTES.AUTHENTICATED_GET, url, method)) {
      logger.debug("Authenticated: Access allowed")
      return next()
    }

    const personalAccess =
      handleAuthRoutes(url, username, req) ||
      (await handleCarRoutes(url, method, username, req)) ||
      (await handleApplicationRoutes(url, method, username, req)) ||
      (await handleLiftRoutes(url, method, username, req))

    if (personalAccess) {
      logger.debug("Authenticated: Access allowed")
      return next()
    }

    logger.error("Personal routes error: no conditions matched")
    return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
  } catch (err) {
    logger.error("verifyToken - error: ", err)
    return res.status(403).json({ error: MESSAGES.ACCESS_DENIED })
  }
  /* -------------------------------------------------------------------------- */
}

export default verifyToken
