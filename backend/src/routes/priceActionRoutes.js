const express = require("express");
const router = express.Router();
const priceActionController = require("../controllers/priceActionController");

// Create a new PriceAction
router.post("/", priceActionController.createPriceAction);

// Get all PriceActions (optionally filter by userId or symbol)
router.get("/", priceActionController.getAllPriceActions);

// Get a single PriceAction by ID
router.get("/:id", priceActionController.getPriceActionById);

// Update a PriceAction by ID
router.put("/:id", priceActionController.updatePriceAction);

// Delete a PriceAction by ID
router.delete("/:id", priceActionController.deletePriceAction);

module.exports = router;
