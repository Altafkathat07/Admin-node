import { Router } from "express";
import {
  userRegister,
  userLogin,
  logOutUser,
  serveRegisterPage,
  adminpage,
  telegramUrl,
  fetchTelegram,
  fetchUser,
} from "../controllers/admin.controllers.js";
import { requireAdmin, requireLogout } from "../middleware/user.middleware.js";

const router = Router();

router.route("/register").get(serveRegisterPage).post(userRegister);

router.route("/login").post(userLogin);
router.route("/admin").get(requireAdmin, adminpage);

router.route("/admin/urlmanagement").post(telegramUrl);

router.route("/logout").get(requireLogout, logOutUser);

router.route("/telegrams").get(fetchTelegram);

router.route("/user_data").get(fetchUser);

export { router };
