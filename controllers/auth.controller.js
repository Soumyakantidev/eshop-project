/**
 * This file will have the logic to signup and signin users
 */

/**
 * Create a function to allow the user to sign
 *
 * Wheneve a user calls the endpoint :
 *
 * POST /crm/api/v1/signup  , router should call the below method
 * JSON request body   to be available as JS object
 *
 *
 *
 */

const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  /**
   * Logic handle the signup
   */

  /**
   * First read the request body and create the JS object to be
   * inserted in the DB
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
     * I need to set the user status
     */
    if (!userObj.userType || userObj.userType == "CUSTOMER") {
      userObj.userStatus = "APPROVED";
    } else {
      userObj.userStatus = "PENDING";
    }

    /**
     * Insert  the data in the databse
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

    /**
     * Return the success response to the customer
     */
    res.status(201).send(postResponse);
  } catch (err) {
    console.log("Error while registering user ", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
};

/**
 * Controller code for the login
 */

exports.signin = async (req, res) => {
  try {
    /**
     * Read the userId and password from the request
     */
    const userIdFromReq = req.body.userId;
    const password = req.body.password;

    /**
     * Ensure the userId is valid
     */
    const userSaved = await User.findOne({ userId: userIdFromReq });

    if (!userSaved) {
      return res.status(401).send({
        message: "User id passed is not correct",
      });
    }

    /**
     * Ensure that the password passed is valid
     *
     * plain text password
     * in DB we have encrypted password .. bcrypt
     */
    const isValidPassword = bcrypt.compareSync(password, userSaved.password);

    if (!isValidPassword) {
      return res.status(401).send({
        message: "Incorrect password !",
      });
    }

    /**
     * Check if the user is in the approved state
     */
    if (userSaved.userStatus != "APPROVED") {
      return res.status(403).send({
        message: "User is not approved for the login",
      });
    }

    /**
     * We need to generate the access token ( JWT based )
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
     * Send the response back
     */

    res.status(200).send({
      name: userSaved.name,
      userId: userSaved.userId,
      email: userSaved.email,
      userType: userSaved.userType,
      userStatus: userSaved.userStatus,
      accessToke: token,
    });
  } catch (err) {
    console.log("Error while login ", err.message);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
