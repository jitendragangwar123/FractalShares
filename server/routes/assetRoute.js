const express=require("express");
const assetController=require("../controllers/assetControllers");
const router=express.Router();

router
    .post('/createKeyPair',assetController.createKeyPair)
    .post('/generatePublicKey',assetController.generatePublicKey)
    .post('/fundDiamTokens',assetController.fundDiamTokens)
    .post('/transferDiamTokens',assetController.transferDiamTokens)

module.exports=router;