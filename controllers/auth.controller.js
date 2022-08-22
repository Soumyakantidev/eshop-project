/**
 * This file will have the logic to signup and users
 */

/**
 * Create a function to allow the user to sign up
 *
 * whenever a user call the endpoint :
 * POST /crm/api/v1/signup , router should call the below method
 */
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  /**
   * Logic handle the signup
   */

  try {
    const userObj = {
      name: req.body.name,
      userId: req.body.userId,
      email: req.body.email,
      userType: req.body.userType,
      password: bcrypt.hashSync(req.body.password, 8),
    };
    /**
     * I nedd to set the user status
     */

    if (!userObj.userType || userObj.userType == "CUSTOMER") {
      userObj.userStatus = "APPROVED";
    } else {
      userObj.userStatus = "PENDING";
    }
    /**
     * Inser the data in the database
     */

    const savedUser = await User.create(userObj);

    const postResponse = {
      name: savedUser.name,
      userId: savedUser.userId,
      email: savedUser.email,
      userType: savedUser.userType,
      userStatus: savedUser.userStatus,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(201).send(postResponse);
  } catch (err) {
    console.log("Error while registering user", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
};
/**
 * Controller code for the login
 */

exports.signin = async (req, res) => {
  /**
   * Read the userId and password from the request body
   */
  const userIdFromReq = req.body.userId;
  const password = req.body.password;

  /**
   * Ensure the userId is valid
   */

  const userSaved = await User.findOne({ userId: userIdFromReq });
  try {
    if (!userSaved) {
      return res.status(401).send({
        message: "User id passed is not correct",
      });
    }
    /**
     *
     *  Ensure that the passowrd passed is valid
     *  plain text password
     * in DB we have encrypted password .. bcrypt
     */
    const isValidPassword = bcrypt.compareSync(password, userSaved.password);
    if (!isValidPassword) {
      return res.status(401).send({
        message: "Incorrect password",
      });
    }
    /**
     * Check if the useris in the aproved state
     */
    if (userSaved.userStatus != "APPROVED") {
      return res.status(403).send({
        message: "User is not approved for the login",
      });
    }

    /**
     *  we need to generate the aceess token (JWT based)
     *
     *
     */

    const token = jwt.sign(
      {
        id: userSaved.userId,
      },
      authConfig.secret,
      {
        expiresIn: 600,
      }
    );

    /**
     *
     * Send the response back
     *
     */
    res.status(200).send({
      name: userSaved.name,
      userId: userSaved.userId,
      email: userSaved.email,
      userType: userSaved.userType,
      userStatus: userSaved.userStatus,
      accessToken: token,
    });
  } catch (err) {
    console.log("Error while login", err.message);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
