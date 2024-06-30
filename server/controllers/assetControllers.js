const asset = require("../models/assetModel");

const {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks,
    Asset,
} = require("diamante-base");

const { Horizon } = require("diamante-sdk-js");

exports.welcomeMsg= async (req,res)=>{
    res.status(200).json({ message: "Welcome to FractalShares Application!" });
};

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
        if (!senderSecret) {
            return res.status(400).json({ error: "Missing required parameter" });
        }
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
        if (!publicKey) {
            return res.status(400).json({ error: "Missing required parameter" });
        }
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
        console.error("Error in fund diam tokens:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.transferDiamTokens = async (req, res) => {
    try {
        const { senderSecret, receiverPublicKey, amount } = req.body;
        if (!senderSecret || !receiverPublicKey || !amount) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(
                Operation.payment({
                    destination: receiverPublicKey,
                    asset: Asset.native(),
                    amount: amount,
                })
            )
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(
            `Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`,
            result
        );
        res.json({
            message: `Payment of ${amount} DIAM made to ${receiverPublicKey} successfully`,
        });
    } catch (error) {
        console.error("Error in transfer diam tokens:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.issueAssets = async (req, res) => {
    try {
        const { issuerSecret, receiverSecret, amountLimit, assetName, amount } = req.body;
        if (!issuerSecret || !receiverSecret || !amountLimit || !assetName || !amount) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
        const issuerKeypair = Keypair.fromSecret(issuerSecret);
        const issuerPublicKey = issuerKeypair.publicKey();

        const receiverKeypair = Keypair.fromSecret(receiverSecret);
        const receiverPublicKey = receiverKeypair.publicKey();

        const assetDetails = new Asset(assetName, issuerPublicKey);

        //Change trust operation
        let changeTrustResult;
        let paymentResult;
        server
            .loadAccount(receiverPublicKey)
            .then(function (receiver) {
                const transaction = new TransactionBuilder(receiver, {
                    fee: 100,
                    networkPassphrase: Networks.TESTNET,
                })
                    .addOperation(
                        Operation.changeTrust({
                            asset: assetDetails,
                            limit: amountLimit,
                        })
                    )
                    .setTimeout(100)
                    .build();
                transaction.sign(receiverKeypair);
                return server.submitTransaction(transaction);
            })
            .then(result => {
                console.log(result);
                changeTrustResult = result;
                return server.loadAccount(issuerPublicKey);
            })
            // Payment operation
            .then(function (issuer) {
                const transaction = new TransactionBuilder(issuer, {
                    fee: 100,
                    networkPassphrase: Networks.TESTNET,
                })
                    .addOperation(
                        Operation.payment({
                            destination: receiverPublicKey,
                            asset: assetDetails,
                            amount: amount,
                        })
                    )
                    .setTimeout(100)
                    .build();
                transaction.sign(issuerKeypair);
                return server.submitTransaction(transaction);
            })
            .then(result => {
                console.log(result);
                paymentResult = result;
                res.status(200).json({ message: "Operations successful", changeTrustResult, paymentResult });
            })
            .catch(function (error) {
                console.error("Error!", error);
                res.status(500).json({ error: "An error occurred during the transaction process", details: error.message });
            });

    } catch (error) {
        console.error("Error in issuance of assets:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.transferAssets = async (req, res) => {
    try {
        const { senderSecret, issuerPublicKey, receiverPublicKey, assetName, amount } = req.body;
        if (!senderSecret || !issuerPublicKey || !receiverPublicKey || !assetName|| !amount) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);

        const txnForIssueTrust = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(
                Operation.changeTrust({
                    asset: new Asset(
                        assetName,
                        issuerPublicKey
                    ),
                })
            )
            .setTimeout(30)
            .build();


        txnForIssueTrust.sign(senderKeypair);
        const resForIssueTrust = await server.submitTransaction(txnForIssueTrust);

        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(
                Operation.payment({
                    destination: receiverPublicKey,
                    asset: new Asset(
                        assetName,
                        issuerPublicKey
                    ),
                    amount: amount,
                })
            )
            .setTimeout(30)
            .build();


        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);

        res.json({
            message: `Payment of ${amount} ${assetName} made to ${receiverPublicKey} successfully`,
        });

    } catch (error) {
        console.error("Error in transferring the assets:", error);
        res.status(500).json({ error: error.message });
    }
}