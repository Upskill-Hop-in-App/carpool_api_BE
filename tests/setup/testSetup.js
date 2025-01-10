import logger from "../../src/logger.js"

beforeAll(async () => {
  logger.debug("Test - Before All")
})

afterAll(async () => {
  logger.debug("Test - After All")
})
