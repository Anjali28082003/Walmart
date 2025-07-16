

import { Challenge } from "../models/challengeModel.js"; 
 // Or wherever your Challenge model is declared

export const shareProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    let challenge = await Challenge.findOne({ userId });

    if (!challenge) {
      challenge = await Challenge.create({
        userId,
        challenges: { sharedOnSocial: true },
        pointsEarned: 50,
      });
      return res.status(200).json({ message: "You earned 50 bonus points for sharing!", challenge });
    }

    if (challenge.challenges.sharedOnSocial) {
      return res.status(200).json({ message: "You've already shared and earned points.", challenge });
    }

    challenge.challenges.sharedOnSocial = true;
    challenge.pointsEarned += 50;
    await challenge.save();

    return res.status(200).json({ message: "You earned 50 bonus points for sharing!", challenge });
  } catch (err) {
    console.error("Error in shareProduct:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
// Add this inside challengeController.js

export const quizReward = async (req, res) => {
  try {
    const userId = req.user.id;

    let challenge = await Challenge.findOne({ userId });

    if (!challenge) {
      challenge = await Challenge.create({
        userId,
        challenges: { quizPlayed: true },
        pointsEarned: 20,
      });
      return res.status(200).json({ message: "You earned 20 points from quiz!", challenge });
    }

    if (challenge.challenges.quizPlayed) {
      return res.status(200).json({ message: "You’ve already played today's quiz.", challenge });
    }

    challenge.challenges.quizPlayed = true;
    challenge.pointsEarned += 20;
    await challenge.save();

    return res.status(200).json({ message: "You earned 20 points from quiz!", challenge });
  } catch (err) {
    console.error("Error in quizReward:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

