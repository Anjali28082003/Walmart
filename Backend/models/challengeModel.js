import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenges: {
    categoriesPurchased: { type: Number, default: 0 },
    productsReviewed: { type: Number, default: 0 },
    sharedOnSocial: { type: Boolean, default: false },
    quizPlayed: { type: Boolean, default: false }, // ✅ Added this line
  },
  pointsEarned: { type: Number, default: 0 },
  lastSpinDate: { type: Date, default: null },
});

export const Challenge = mongoose.model("Challenge", challengeSchema);
