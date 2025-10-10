import { Request, Response, NextFunction } from "express";
import User, { UserType } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { TokenPayload } from "../types/express";
import crypto from "crypto";
import { env } from "../config/env";
import ms from "ms";

const AuthResponses = {
  MISSING_CREDENTIALS: "Username or email and password is required",
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: "Wrong password or username",
  JWT_CONFIG_ERROR: "Server configuration error: JWT key not defined",
  REGISTRATION_REQUIRED: "Username, email, full name and password are required",
  USER_EXISTS: "User with this username or email already exists",
  REGISTRATION_SUCCESS: "Successfully registered!",
  RESET_EMAIL_REQUIRED: "Username or email is required",
  LOGIN_SUCCESS: "Successfully logged in with token",
  LOGOUT_SUCCESS: "Successfully logged out",
  EMAIL_SENT: "Email sent",
  RESET_TOKEN_REQUIRED: "Token and new password are required",
  INVALID_RESET_TOKEN: "Invalid or expired reset token",
  PASSWORD_RESET_SUCCESS: "Password successfully reset",
  RESET_CONFIRMATION_ERROR: "Error resetting password",
} as const;

const findUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  return await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

const createAuthToken = (user: UserType): string => {
  const payload: TokenPayload = {
    username: user.username,
    id: user._id.toString(),
  };

  return jwt.sign(payload, env.JWT_SECRET!, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const setAuthCookie = (res: Response, token: string): void => {
  const expiresAt = Date.now() + ms(env.ACCESS_TOKEN_EXPIRES_IN);

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresAt,
    path: "/",
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(400).send(AuthResponses.MISSING_CREDENTIALS);
      return;
    }

    const user = await findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      res.status(404).send(AuthResponses.USER_NOT_FOUND);
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      res.status(401).send(AuthResponses.INVALID_PASSWORD);
      return;
    }

    if (!env.JWT_SECRET) {
      res.status(500).send(AuthResponses.JWT_CONFIG_ERROR);
      return;
    }

    const token = createAuthToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      message: AuthResponses.LOGIN_SUCCESS,
      data: {
        username: user.username,
        id: user.id,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Login error:", errorMessage);
    res.status(500).send(`Error logging in: ${errorMessage}`);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !password || !email || !fullName) {
      res.status(400).send(AuthResponses.REGISTRATION_REQUIRED);
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      res.status(409).send(AuthResponses.USER_EXISTS);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, fullName, email, password: hashedPassword });

    res.status(201).send(AuthResponses.REGISTRATION_SUCCESS);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Registration error:", errorMessage);
    res.status(500).send(`Error registering: ${errorMessage}`);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { usernameOrEmail } = req.body;

    if (!usernameOrEmail) {
      res.status(400).send(AuthResponses.RESET_EMAIL_REQUIRED);
      return;
    }

    const user = await findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      res.status(404).send(AuthResponses.USER_NOT_FOUND);
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(
      Date.now() + ms(env.RESET_TOKEN_EXPIRES_IN)
    );
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });

    const resetLink = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link to complete the process:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in ${env.RESET_TOKEN_EXPIRES_IN}</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ msg: AuthResponses.EMAIL_SENT, info: info.messageId });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Password reset error:", errorMessage);
    res.status(500).send(`Error sending reset email: ${errorMessage}`);
  }
};

export const confirmPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).send(AuthResponses.RESET_TOKEN_REQUIRED);
      return;
    }

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).send(AuthResponses.INVALID_RESET_TOKEN);
      return;
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send(AuthResponses.PASSWORD_RESET_SUCCESS);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Password reset confirmation error:", errorMessage);
    res.status(500).send(AuthResponses.RESET_CONFIRMATION_ERROR);
  }
};

export const checkAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user) {
    res.status(200).json({
      message: "Token is valid",
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({ message: AuthResponses.LOGOUT_SUCCESS });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Logout error:", errorMessage);
    res.status(500).send(`Error logging out: ${errorMessage}`);
  }
};
