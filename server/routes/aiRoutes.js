const express = require("express");
const router = express.Router();
const { generateRecipe, categorizeFood, findBestMatch } = require("../controllers/aiController");

router.post("/recipe", generateRecipe);
router.post("/categorize", categorizeFood);
router.post("/match", findBestMatch);

module.exports = router;
