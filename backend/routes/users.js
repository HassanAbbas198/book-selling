const express = require("express");

const { check, body } = require("express-validator");

const router = express.Router();

const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Passwords don't match`);
    }
    return true;
  }),
  UserController.createUser
);

router.post("/login", UserController.userLogin);

router.post("/resetPassword", UserController.resetPassword);

router.post(
  "/newPassword/:userId",
  body("password")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Passwords don't match`);
    }
    return true;
  }),
  UserController.newPassword
);

router.get("/loggedIn", checkAuth, UserController.getLoggedInUser);

router.get("/user", checkAuth, UserController.getUser);

router.delete("/me", checkAuth, UserController.deleteAccount);

module.exports = router;
