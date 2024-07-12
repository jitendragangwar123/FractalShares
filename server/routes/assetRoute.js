const express = require("express");
const assetController = require("../controllers/assetControllers");
const router = express.Router();


router
 .get("/", assetController.welcomeMsg)
 .post("/storeAddress",assetController.storeAddress)
 .post("/createKeyPair", assetController.createKeyPair)
 .post("/generatePublicKey", assetController.generatePublicKey)
 .post("/fundDiamTokens", assetController.fundDiamTokens)
 .post("/transferDiamTokens", assetController.transferDiamTokens)
 .post("/issueAssets", assetController.issueAssets)
 .post("/calculateYield",assetController.calculateYield)
 .get("/getPropertyDatails",assetController.getPropertyDatails)
 .get("/getPropertyDatailsByName",assetController.getPropertyDatailsByName)
 .post("/storeTransactionsData",assetController.storeTransactionsData)
 .get("/getTransactionsData",assetController.getTransactionsData)
 .get("/getPropertiesByUserAddress",assetController.getPropertiesByUserAddress)
 .put("/:id/updateHoldingTokens",assetController.updateHoldingTokens)
 .put("/:id/updateEarnedYields",assetController.updateEarnedYields)

module.exports = router;





