export const MESSAGES = {
  /* -------------------------- User Success messages ------------------------- */
  LOGIN_SUCCESS: "Logged in successfully",
  USER_UPDATED_SUCCESS: "User updated successfully",
  MARKED_ACTIVE_SUCCESS: "User marked active!",
  MARKED_INACTIVE_SUCCESS: `User marked inactive!`,
  REGISTER_SUCCESS: "Registered successfully!",
  USERS_RETRIEVED: "Users retrieved successfully!",
  USER_RETRIEVED: "User retrieved successfully!",
  /* -------------------------------------------------------------------------- */

  /* --------------------------- User Error messages -------------------------- */
  INACTIVE_USER: "Could not login. Inactive user.",
  INCORRECT_LOGIN: "Incorrect email or password",
  USER_NOT_FOUND: "User not found",
  ERROR_MARKING_INACTIVE: "Error marking user as inactive.",
  ERROR_MARKING_ACTIVE: "Error marking user as active.",
  USERNAME_NOT_REGISTERED: "Username is not registered",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  DUPLICATE_EMAIL_OR_USERNAME: "That email or username is already in use",
  PASSWORD_TOO_LONG: "Password is too long",
  INVALID_NIF_FORMAT: "Invalid NIF format",
  INVALID_CONTACT_FORMAT: "Invalid contact format",
  ERROR_UPDATING_USER: "Error updating user",
  USER_ALREADY_ACTIVE: "User status is already active",
  USER_ALREADY_INACTIVE: "User status is already inactive",
  MARKING_ACTIVE_FAILED: `Error marking user active`,
  MARKING_INACTIVE_FAILED: `Error marking user inactive`,
  REGISTER_FAILED: "Failed to register",
  ALREADY_REGISTERED: "You're already registered",
  CANNOT_ELSE_ACCOUNT: "You can only do that to your own account",
  NO_USERS_FOUND: "No users found",
  FAILED_TO_RETRIEVE_USERS: "Failed to retrieve users",
  FAILED_TO_RETRIEVE_USER_BY_EMAIL: "Failed to retrieve user by email",
  FAILED_TO_RETRIEVE_USER_BY_CONDITION: "Failed to retrieve user by condition",
  FAILED_TO_RETRIEVE_USER_BY_ROLE: "Failed to retrieve user by role",
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Common Error messages ------------------------- */
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  VALIDATION_ERROR: "Validation Error",
  AUTH_REQUIRED: "Authentication required for this action",
  ACCESS_DENIED: "Access denied for this route",
  INVALID_TOKEN: "Invalid token",
  /* -------------------------------------------------------------------------- */
};
