export const MESSAGES = {
  /* -------------------------- User Success messages ------------------------- */
  LOGIN_SUCCESS: "Logged in successfully",
  USER_UPDATED_SUCCESS: "User updated successfully!",
  PASSWORD_UPDATED_SUCCESS: "Password updated successfully!",
  REGISTER_SUCCESS: "Registered successfully!",
  USER_DELETED_SUCCESS: "User deleted successfully!",
  USER_DELETED_SUCCESS: "User info deleted successfully!",
  RATING_UPDATED_SUCCESS: "Rating updated successfully",
  USER_RETRIEVED_SUCCESS: "User retrieved successfully",
  /* -------------------------------------------------------------------------- */

  /* --------------------------- User Error messages -------------------------- */
  ACCESS_DENIED: "Access denied for this route",
  USER_EMAIL_NOT_FOUND: "User not found",
  USERNAME_NOT_REGISTERED: "Username is not registered",
  INCORRECT_USER_OR_PASSWORD: "Incorrect username or password",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  DUPLICATE_EMAIL_OR_USERNAME: "That email or username is already in use",
  INVALID_CONTACT_FORMAT: "Invalid contact format",
  ERROR_UPDATING_USER: "Error updating user",
  ERROR_UPDATING_PASSWORD: "Error updating password",
  REGISTER_FAILED: "Failed to register",
  ALREADY_REGISTERED: "You're already registered",
  RATING_MUST_1_TO_5: "Rating must be a number between 1 and 5.",
  ERROR_DELETING_USER: "Error deleting user",
  ERROR_ANONYMIZING_USER: "Error anonymizing user",
  USER_ALREADY_ANONYM: "User info has already been deleted",
  PASSWORD_EMPTY: "Password field cannot be empty",
  USER_NOT_FOUND: "User not found",
  FAILED_RETRIEVING_USER: "Failed to retrieve user",
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
  LIFT_NOT_FOUND: "Lift not found",
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
  INVALID_DATE_FORMAT: "Invalid date format, please use dd/mm/aaaa",
  DATE_IN_PAST: "The selected date is in the past",
  INVALID_QUERY_LIFTS: "Invalid query parameter",
  LIFT_NOT_READY:
    "Can't change lift status to inProgress because it wasn't ready to start",
  PASSENGER_NOT_READY:
    "Can't change lift status to inProgress because no passenger is ready",
  LIFT_NOT_IN_PROGRESS:
    "Can't change lift status to finished since it wasn't inProgress",
  LIFT_NOT_FINISHED: "Lift not finished",
  MISSING_RATINGS:
    "Cannot close lift because driver/passenger ratings are missing",
  CANNOT_CANCEL_LIFT:
    "Can't cancel lift since it has already progressed too far in status, only allowed when open or ready",
  FAILED_TO_UPDATE_LIFT_STATUS: "Failed to change lift status",
  FAILED_TO_UPDATE_LIFT_DRIVER_RATING:
    "Failed to update received driver ratings",
  MAX_RATINGS: "All occupants have already given their ratings to the driver",
  FAILED_TO_RETRIEVE_LIFT_BY_USERNAME: "Failed to retrieve lift by username",
  DRIVER_HAS_LIFT_INPROGRESS: "Driver already has a lift in progress",
  USER_ROLE_NOT_FOUND: "User role could not be retrieved",
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Application Success messages ---------------------- */
  APPLICATION_CREATED_SUCCESS: "Application created successfully!",
  APPLICATIONS_RETRIEVED_SUCCSESS: "Applications retrieved successfully!",
  APPLICATION_RETRIEVED_BY_CODE: "Application retrieved by code",
  APPLICATION_DELETED_SUCCESS: "Application deleted successfully!",
  APPLICATION_ACCEPTED_SUCCESS: "Application accepted successfully!",
  APPLICATION_REJECTED_SUCCESS: "Application rejected successfully!",
  APPLICATION_CANCELED_SUCCESS: "Application canceled successfully!",
  APPLICATION_UPDATED_READY: "Application status updated to ready",
  PASSENGER_RATING_UPDATE: "Passenger rating loaded",
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
  LIFT_STARTED_OR_CANCELED: "Lift already started or was canceled",
  LIFT_NOT_ACCEPTING_APPLICATIONS: "Lift is not accepting more applications",
  FAILED_TO_DELETE_APPLICATION: "Failed to delete application",
  LIFT_IS_FULL: "The lift is full.",
  STATUS_NOT_PENDING: "Application status is not 'pending'",
  FAILED_TO_ACCEPT_APPLICATION: "Failed to accept application",
  APPLICATION_ALREADY_REJECTED_CANCELED:
    "Application status is already rejected or canceled.",
  FAILED_TO_CANCEL_APPLICATION: "Failed to cancel application.",
  DRIVER_IS_PASSENGER: "Driver cannot apply as a passenger to their lift",
  APPLICATION_NOT_ACCEPTED:
    "Application cannot be set to ready because it wasn't accepted",
  APPLICATION_NOT_READY:
    "Cannot load passenger rating because the application wasn't ready",
  FAILED_TO_UPDATE_APPLICATION: "Failed to update application",
  APPLICATION_LIFT_NOT_FINISHED:
    "Cannot load passenger rating because the lift wasn't finished",
  APPLICATION_LIFT_IN_PROGRESS:
    "Cannot set status to ready because lift is already in progress",
  PASSENGER_ALREADY_RATED: "This passenger has already been rated",

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
  INVALID_QUERY_CARS:
    "Invalid query parameter, try: cc/brand/model/year/user/color/plate",
  FAILED_TO_RETRIEVE_CAR_BY_USERNAME: "Failed to retrieve car by username",
  /* -------------------------------------------------------------------------- */
}
