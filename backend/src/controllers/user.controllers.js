import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide both username and password." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    res.status(httpStatus.OK).json({ token });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Login failed: ${error.message}` });
  }
};


export const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Registration failed: ${error.message}` });
  }
};


export const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token." });
    }

    const meetings = await Meeting.find({ user_id: user.username });
    res.status(httpStatus.OK).json(meetings);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `History retrieval failed: ${error.message}` });
  }
};


export const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token." });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Meeting code added to history." });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Add to history failed: ${error.message}` });
  }
};
