

import express from "express";
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { quizReward,shareProduct } from "../controllers/challengeController.js";
import { Challenge } from "../models/challengeModel.js"; // ✅ Import the model

const router = express.Router();

// ✅ Buy from 3 categories
router.post("/category-purchase", async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await Challenge.findOneAndUpdate(
      { userId },
      { $inc: { "challenges.categoriesPurchased": 1 } },
      { new: true, upsert: true }
    );
    if (challenge.challenges.categoriesPurchased >= 3) {
      challenge.pointsEarned += 50;
      await challenge.save();
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Review 5 products
router.post("/review-product", async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await Challenge.findOneAndUpdate(
      { userId },
      { $inc: { "challenges.productsReviewed": 1 } },
      { new: true, upsert: true }
    );
    if (challenge.challenges.productsReviewed >= 5) {
      challenge.pointsEarned += 50;
      await challenge.save();
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Shared on social
router.post("/share", verifyJWT, shareProduct);
router.post("/quiz-points",verifyJWT, quizReward); 

// ✅ Get current user's rewards
router.post("/get", verifyJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const challenge = await Challenge.findOne({ userId });
    res.json(challenge || { pointsEarned: 0 });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
