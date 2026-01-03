// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// const router = express.Router();


// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password, keywords } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const user = await User.create({ email, password, keywords });
//     res.json({
//     _id: user._id,
//     email: user.email,
//     keywords: user.keywords,
//     });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// /**
//  * POST /auth/login
//  * Login user
//  */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // 🔐 Generate JWT
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         email: user.email,
//         interests: user.interests,
//         keywords: user.keywords,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import bcrypt from "bcryptjs";         // ✅ SAME AS user.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

/**
 * POST /auth/signup
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, keywords } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await User.create({ email, password, keywords });

    // ✅ SAFE RESPONSE (no password)
    res.status(201).json({
      _id: user._id,
      email: user.email,
      keywords: user.keywords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        interests: user.interests,
        keywords: user.keywords,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
