export const MESSAGES = {
  /* -------------------------- User Success messages ------------------------- */
  USER_UPDATED_SUCCESS: "User updated successfully",
  PASSWORD_UPDATED_SUCCESS: "Password updated successfully",
  REGISTER_SUCCESS: "Registered successfully!",
  USER_DELETED_SUCCESS: "User deleted successfully.",
  /* -------------------------------------------------------------------------- */

  /* --------------------------- User Error messages -------------------------- */
  USER_NOT_FOUND: "User not found",
  USERNAME_NOT_REGISTERED: "Username is not registered",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  DUPLICATE_EMAIL_OR_USERNAME: "That email or username is already in use",
  INVALID_CONTACT_FORMAT: "Invalid contact format",
  ERROR_UPDATING_USER: "Error updating user",
  ERROR_UPDATING_PASSWORD: "Error updating password",
  REGISTER_FAILED: "Failed to register",
  ALREADY_REGISTERED: "You're already registered",
  RATING_MUST_1_TO_5: "Rating must be a number between 1 and 5.",
  ERROR_DELETING_USER: "Error deleting user.",
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Common Error messages ------------------------- */
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  VALIDATION_ERROR: "Validation Error",
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Lift Success messages ---------------------- */
  LIFT_CREATED: "Lift created successfully",
  LIFT_RETRIEVED_BY_CODE: "Lift retrieved by code",
  LIFT_UPDATED: "Lift updated successfully",
  LIFT_DELETED: "Lift deleted successfully",
  LIFTS_RETRIEVED: "Lifts retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* ----------------------- Lift Error messages ----------------------- */
  FAILED_TO_RETRIEVE_GEO_VALIDATION_INFO:
    "An error occured while sending request to GEO API",
  DRIVER_NOT_FOUND_BY_CODE: "No driver matches the given username",
  CAR_NOT_FOUND_BY_CODE: "No car matches the given code",
  DUPLICATE_LIFT: "Duplicate lift code or lift name. Please use unique values.",
  DUPLICATE_LIFT: "Duplicate lift code or lift name. Please use unique values.",
  NO_LIFTS_FOUND: "No lifts exist",
  FAILED_TO_CREATE_LIFT: "Failed to create lift",
  LIFT_NOT_FOUND_BY_CODE: "No lifts match the given code",
  FAILED_TO_RETRIEVE_LIFTS: "Failed to retrieve lifts",
  FAILED_TO_RETRIEVE_LIFT_BY_CODE: "Failed to retrieve lift by code",
  INVALID_CAR: "Car brand/model/year not valid",
  FAILED_TO_RETRIEVE_VALIDATION_INFO: "Failed to retrieve validation for car",
  FAILED_TO_UPDATE_LIFT: "Failed to update lift",
  FAILED_TO_DELETE_LIFT: "Failed to delete lift",
  APPLICATION_ASSOCIATED:
    "Failed to delete because there are applications associated",
  MATCHING_START_END: "Start and end locations are the same",
  INVALID_LOCATION: "Invalid start/endPoint",
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Application Success messages ---------------------- */
  APPLICATION_CREATED_SUCCESS: "Application created successfully!",
  APPLICATIONS_RETRIEVED_SUCCSESS: "Applications retrieved successfully!",
  APPLICATION_RETRIEVED_BY_CODE: "Application retrieved by code",
  /* -------------------------------------------------------------------------- */

  /* ----------------------- Application Error messages ----------------------- */
  PASSENGER_NOT_FOUND: "Passenger not found",
  NO_APPLICATIONS_FOUND: "No applications found",
  APPLICATION_NOT_FOUND: "Application not found",
  DUPLICATE_CA: "Duplicate application code",
  FAILED_CREATE_APPLICATION: "Failed to create application",
  DUPLICATE_APPLICATION: "This user already applied for this lift",
  LIFT_STATUS_NOT_OPEN: "You can only apply for a lift with 'open' status",
  FAILED_TO_RETRIEVE_APPLICATION: "Failed to retrieve applications",
  INVALID_STATUS: "Invalid status. Try 'pending', 'rejected' or 'accepted'",

  /* -------------------------------------------------------------------------- */

  /* ---------------------- Car Success messages ---------------------- */
  CAR_CREATED: "Car created successfully",
  CAR_RETRIEVED_BY_CODE: "Car retrieved by code",
  CAR_UPDATED: "Car updated successfully",
  CAR_DELETED: "Car deleted successfully",
  CARS_RETRIEVED: "Cars retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* ----------------------- Car Error messages ----------------------- */
  DRIVER_NOT_FOUND: "No driver matches the given username",
  CAR_NOT_FOUND_BY_CODE: "No car matches the given code",
  DUPLICATE_CAR: "Duplicate car code or car name. Please use unique values.",
  NO_CARS_FOUND: "No cars exist",
  FAILED_TO_CREATE_CAR: "Failed to create car",
  CAR_NOT_FOUND_BY_CODE: "No cars match the given code",
  FAILED_TO_RETRIEVE_CARS: "Failed to retrieve cars",
  FAILED_TO_RETRIEVE_CAR_BY_CODE: "Failed to retrieve car by code",
  FAILED_TO_UPDATE_CAR: "Failed to update car",
  FAILED_TO_DELETE_CAR: "Failed to delete car",
  /* -------------------------------------------------------------------------- */
}
