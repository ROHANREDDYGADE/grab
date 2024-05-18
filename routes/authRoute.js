import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getAllUsersController,
  deleteUser,
  updateUser,
  getUserById
} from "../controllers/authController.js";
import { isAdmin, requireSignIn, isInvestor, isFounder } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
// router.get("/user-auth", requireSignIn, isFounder (req, res) => {
//   res.status(200).send({ ok: true });
// });

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/investor-auth", requireSignIn, isInvestor, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/user-auth", requireSignIn, isFounder, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

router.delete("/delete-user/:userId",requireSignIn, deleteUser);
router.put("/update-user/:userId", requireSignIn, isAdmin, updateUser);
router.get("/get-user/:userId", requireSignIn, getUserById);
export default router;
