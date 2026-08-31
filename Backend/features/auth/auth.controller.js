import { registerService, loginService } from "./auth.service.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await registerService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3650 * 24 * 60 * 60 * 1000, // ~10 years, matches JWT_REFRESH_EXPIRES_IN default (stay signed in until logout)
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
   console.log("req.body:", req.body);
  try {
    const { accessToken, refreshToken, user } = await loginService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3650 * 24 * 60 * 60 * 1000, // ~10 years, matches JWT_REFRESH_EXPIRES_IN default (stay signed in until logout)
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};