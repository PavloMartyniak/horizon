import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const sign_up = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      massage: "user succesfully sign up",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sign_in = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* FIND USER */
    const user = await User.findOne({ email: email });

    /* IF USER NOT FOUND */
    if (!user)
      return res.status(400).json({
        message: "user does not exist",
      });

    /* CHECK IF USER PASSWORD CORRECT */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "invalid credentials",
      });

    /* GENERATE ACCESS TOKEN */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    /* SET TOKEN IN COOKIE */
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    /* RESPONSE */
    res.status(201).json({
      massage: "user succesfully sign in",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
