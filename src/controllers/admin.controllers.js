import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Telegram } from "../models/telegram.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
// import { ApiResponse } from "../utils/apiResponse.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].every((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the all required fields.");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  //  res.status(201).json(
  //     new ApiResponse(200, "User Registered Successfully", createdUser )
  // )

  res.redirect("/");

};

const telegramUrl = async (req, res) => {
  try {
    const telegramData = req.body;

    const existingTelegram = await Telegram.findOne();

    if (existingTelegram) {
      existingTelegram.telegram = telegramData.telegram;

      await existingTelegram.save();
      res.redirect("/admin")

    //   res
    //     .status(200)
    //     .json({
    //       message: "Telegram URL updated successfully",
    //       data: existingTelegram,
    //     });

    } else {
      const newTelegram = new Telegram(telegramData);
      await newTelegram.save();
      res.redirect("/admin");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const serveRegisterPage = (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  res.sendFile(path.join(__dirname, "../../public/register.html"));
};

const adminpage = (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  res.sendFile(path.join(__dirname, "../../public/admin/index.html"));
};

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(402, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(email, password, user);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const loggedInUser = await User.findById(user._id).select("-password");



  req.session.userId = user._id;

  if (user.is_Admin) {
    console.log("success");
    res.redirect("/admin");
  } else {
    throw new ApiError(
      409,
      "This email is not associated with an admin account"
    );
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  const userDetail = req.session.userId;
  console.log(userDetail);

  const logout = await User.findByIdAndUpdate(
    userDetail,
    {
      $set: {
        email: undefined,
      },
    },
    {
      new: true,
    }
  );
  res.redirect("/");
  console.log(User);
});

const fetchTelegram = asyncHandler(async (req, res) => {
  try {
    const telegrams = await Telegram.find();
    res.json(telegrams);
  } catch (error) {
    console.error("Error fetching telegrams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const fetchUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.error("Error fetching telegrams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export {
  userRegister,
  userLogin,
  logOutUser,
  serveRegisterPage,
  adminpage,
  telegramUrl,
  fetchTelegram,
  fetchUser,
};
