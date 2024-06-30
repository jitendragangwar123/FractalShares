const asset = require("../models/assetModel");

const {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks,
    Asset
} = require("diamante-base");

const { DiamSdk, Horizon } = require("diamante-sdk-js");


exports.createKeyPair = async (req, res) => {
    try {
        const keypair = Keypair.random();
        res.json({
            publicKey: keypair.publicKey(),
            secret: keypair.secret(),
        });
    } catch (error) {
        console.error("Error in create-keypair:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.generatePublicKey = async (req, res) => {
    try {
        const { senderSecret } = req.body;
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();
        console.log("Sender public key:", senderPublicKey);
        res.json({
            publicKey: senderPublicKey,
        });
    } catch (error) {
        console.error("Error in generate-public-key:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.fundDiamTokens = async (req, res) => {
    try {
        const { publicKey } = req.body;
        const fetch = await import("node-fetch").then((mod) => mod.default);
        const response = await fetch(
            `https://friendbot.diamcircle.io/?addr=${publicKey}`
        );
        if (!response.ok) {
            throw new Error(
                `Failed to activate account ${publicKey}: ${response.statusText}`
            );
        }
        const result = await response.json();
        console.log(`Account ${publicKey} activated`, result);
        res.json({ message: `Account ${publicKey} funded successfully` });
    } catch (error) {
        console.error("Error in fund-account:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.transferDiamTokens = async (req, res) => {
    try {
        const { senderSecret, receiverPublicKey, amount } = req.body;
        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: receiverPublicKey,
                asset: Asset.native(),
                amount: amount,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, result);
        res.json({ message: `Payment of ${amount} DIAM made to ${receiverPublicKey} successfully` });
    } catch (error) {
        console.error('Error in make-payment:', error);
        res.status(500).json({ error: error.message });
    }
};
