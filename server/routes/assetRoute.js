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
 .post("/transferAssets", assetController.transferAssets)
 .post("/investInAsset", assetController.investInAsset)
 .post("/createTrustline",assetController.createTrustline)
 .post("/calculateYield",assetController.calculateYield)
 .get("/getPropertyDetails",assetController.getPropertyDetails)
 .get("/getPropertyDetailsByName",assetController.getPropertyDetailsByName)
 .post("/storetTransactionsData",assetController.storetTransactionsData)
 .get("/getTransactionsData",assetController.getTransactionsData)


module.exports = router;
