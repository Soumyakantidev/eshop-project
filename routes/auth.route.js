/**
 * This will have the logic to route the request to defferentcontroller
 */
const authController = require("../controllers/auth.controller");
module.exports = (app) => {
  /**
   *
   * Define the rout for sign up
   *
   * POST/crm/api/v1/signip -> auth controller sign up method
   *
   */

  app.post("/crm/api/v1/auth/signup", authController.signup);

  /**
   * Define the routes for the sign in
   * Post /crm/api/v1/auth/signin -> auth controller sign in methood
   */
  app.post("/crm/api/v1/auth/signin", authController.signin);
};
