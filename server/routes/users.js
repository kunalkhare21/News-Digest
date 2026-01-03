import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const router = express.Router();

/**
 * POST /users
 * Signup user
 */
// router.post("/", async (req, res) => {
//   try {
//     const { email, password, interests, keywords } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // 🔐 Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//       interests,
//       keywords,
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       email: user.email,
//       interests: user.interests,
//       keywords: user.keywords,
//       createdAt: user.createdAt,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
/**
 * POST /users
 * Create user (email-first onboarding)
 */


// FINAL 


// router.post("/onboard", async (req, res) => {
//   try {
//     const { email, keywords } = req.body;

//     if (!email || !keywords || keywords.length === 0) {
//       return res.status(400).json({
//         error: "Email and interests are required",
//       });
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         email,
//         keywords,
//       });
//     } else {
//       user.keywords = keywords;
//       await user.save();
//     }

//     res.json({
//       success: true,
//       user: {
//         email: user.email,
//         keywords: user.keywords,
//       },
//     });
//   } catch (err) {
//     console.error("ONBOARD ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/onboard", async (req, res) => {
  try {
    const { email, keywords } = req.body;

    if (!email || !keywords?.length) {
      return res.status(400).json({
        success: false,
        error: "Email and interests required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { keywords },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});



/**
 * GET /users/:email
 * Fetch user by email
 */
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.params.email },
      { password: 0 } // 🔒 hide password
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /users/:email
 * Update interests & keywords
 */
router.put("/:email", async (req, res) => {
  try {
    const { interests, keywords } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { interests, keywords },
      { new: true, projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /users/:email
 * Delete user
 */
router.delete("/:email", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
