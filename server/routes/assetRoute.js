const express = require("express");
const assetController = require("../controllers/assetControllers");
const router = express.Router();

router
  .get("/", assetController.welcomeMsg)
  .post("/createKeyPair", assetController.createKeyPair)
  .post("/generatePublicKey", assetController.generatePublicKey)
  .post("/fundDiamTokens", assetController.fundDiamTokens)
  .post("/transferDiamTokens", assetController.transferDiamTokens)
  .post("/issueAssets", assetController.issueAssets)
  .post("/transferAssets", assetController.transferAssets)
  .post("/investInAsset", assetController.investInAsset)
  .post("/createTrustline",assetController.createTrustline)

module.exports = router;
