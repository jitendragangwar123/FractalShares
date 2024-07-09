const Wallet = require("../models/wallet");
const Property = require("../models/propertyDetails");
const Transaction = require("../models/transactions");


const {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks,
    Asset,
} = require("diamante-base");


const { Horizon } = require("diamante-sdk-js");
const accountToTimestampMap = new Map();

exports.welcomeMsg = async (req, res) => {
    res.status(200).json({ message: "Welcome to FractalShares Application!" });
};

exports.storeAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const existingWallet = await Wallet.findOne({ address });


        if (existingWallet) {
            return res.status(200).json({ message: "Address already exists" });
        }
        const newWallet = new Wallet({ address });
        await newWallet.save();


        res.status(201).json({ message: "Address stored successfully" });
    } catch (error) {
        console.error("Error storing address:", error);
        res.status(500).json({ message: "Error storing address" });
    }
};


exports.getPropertyDetails = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};


exports.getPropertyDetailsByName = async (req, res) => {
    const { name } = req.query;
    try {
        let properties;
        if (name) {
            properties = await Property.find({ name: new RegExp(name, "i") });
        } else {
            properties = await Property.find();
        }
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};


exports.storetTransactionsData = async (req, res) => {
    try {
        const { txnHash, investorAddress, tokenAmount, diamAmount, url } = req.body;
        const newTransaction = new Transaction({
            txnHash,
            investorAddress,
            tokenAmount,
            diamAmount,
            url,
        });
        const savedTransaction = await newTransaction.save();
        res.json(savedTransaction);
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ error: "Failed to save transaction" });
    }
};


exports.getTransactionsData = async (req, res) => {
    try {
        const transactionData = await Transaction.find();
        res.status(200).json(transactionData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
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


exports.createTrustline = async (req, res) => {
    try {
        const { issuerSecret, receiverSecret, amountLimit, assetName } = req.body;


        if (!issuerSecret || !receiverSecret || !amountLimit || !assetName) {
            return res.status(400).json({ error: "Missing required parameters" });
        }


        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
        const issuerKeypair = Keypair.fromSecret(issuerSecret);
        const receiverKeypair = Keypair.fromSecret(receiverSecret);
        const assetDetails = new Asset(assetName, issuerKeypair.publicKey());


        try {
            const receiverAccount = await server.loadAccount(
                receiverKeypair.publicKey()
            );
            const changeTrustTransaction = new TransactionBuilder(receiverAccount, {
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


            changeTrustTransaction.sign(receiverKeypair);
            const changeTrustResult = await server.submitTransaction(
                changeTrustTransaction
            );
            console.log("Change Trust Result:", changeTrustResult);
            res.status(200).json({
                message: "ChangeTrustLine successfully!",
                changeTrustResult,
            });
        } catch (changeTrustError) {
            console.error("Change Trust Operation Error:", changeTrustError);
            res.status(500).json({
                error: "An error occurred during the change trust transaction",
                details: changeTrustError.response?.data || changeTrustError.message,
            });
        }
    } catch (error) {
        console.error("Error in issuance of assets:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.issueAssets = async (req, res) => {
    try {
        const { issuerSecret, receiverPublicKey, assetName, amount } = req.body;


        if (!issuerSecret || !receiverPublicKey || !assetName || !amount) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
        const issuerKeypair = Keypair.fromSecret(issuerSecret);
        const assetDetails = new Asset(assetName, issuerKeypair.publicKey());


        try {
            const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
            const timestamp = accountToTimestampMap.get(receiverPublicKey);
            console.log("timestamp", timestamp);
            console.log("difference", Date.now() - timestamp);


            const paymentTransaction = new TransactionBuilder(issuerAccount, {
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


            paymentTransaction.sign(issuerKeypair);
            const paymentResult = await server.submitTransaction(paymentTransaction);
            console.log("Payment Result:", paymentResult);
            accountToTimestampMap.set(receiverPublicKey, Date.now());
            res.status(200).json({
                message: "Investment successful",
                paymentResult,
            });
        } catch (paymentError) {
            console.error("Payment Operation Error:", paymentError);
            res.status(500).json({
                error: "An error occurred during the payment transaction",
                details: paymentError.response?.data || paymentError.message,
            });
        }
    } catch (error) {
        console.error("Error in issuance of assets:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.calculateYield = async (req, res) => {
    try {
        const { principal, annualRate, days } = req.body;


        if (!principal || !annualRate || !days) {
            return res.status(400).json({
                error: "Missing required parameters: principal, annualRate, and days",
            });
        }


        const principalAmount = parseFloat(principal);
        const annualInterestRate = parseFloat(annualRate);
        const investmentDays = parseInt(days);


        if (
            isNaN(principalAmount) ||
            isNaN(annualInterestRate) ||
            isNaN(investmentDays)
        ) {
            return res.status(400).json({
                error:
                    "Invalid parameter values: principal, annualRate, and days must be numbers",
            });
        }


        const dailyRate = annualInterestRate / 365 / 100;
        const totalAmount =
            principalAmount * Math.pow(1 + dailyRate, investmentDays);
        const yieldAmount = totalAmount - principalAmount;


        console.log("Yield Amount:", yieldAmount);


        res.status(200).json({
            yieldAmount: yieldAmount.toFixed(0),
        });
    } catch (error) {
        console.error("Error calculating yield:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.transferAssets = async (req, res) => {
    try {
        const { senderSecret, issuerPublicKey, assetName, amount } = req.body;
        if (!senderSecret || !issuerPublicKey || !assetName || !amount) {
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
                    asset: new Asset(assetName, issuerPublicKey),
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
                    destination: issuerPublicKey,
                    asset: new Asset(assetName, issuerPublicKey),
                    amount: amount,
                })
            )
            .setTimeout(30)
            .build();


        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);


        res.json({
            message: `Payment of ${amount} ${assetName} made to ${issuerPublicKey} successfully`,
        });
    } catch (error) {
        console.error("Error in transferring the assets:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.investInAsset = async (req, res) => {
    try {
        const {
            receiverSecret,
            issuerSecret,
            amountLimit,
            assetName,
            amountAsset,
            amountDIAM,
        } = req.body;
        if (
            !issuerSecret ||
            !receiverSecret ||
            !amountLimit ||
            !assetName ||
            !amountAsset ||
            !amountDIAM
        ) {
            return res.status(400).json({ error: "Missing required parameters" });
        }


        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");


        const issuerKeypair = Keypair.fromSecret(issuerSecret);
        const issuerPublicKey = issuerKeypair.publicKey();


        const receiverKeypair = Keypair.fromSecret(receiverSecret);
        const receiverPublicKey = receiverKeypair.publicKey();


        const account = await server.loadAccount(receiverPublicKey);


        //Change trust operation
        let changeTrustResult;
        let paymentResult;
        let diamPaymentResult;


        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(
                Operation.payment({
                    destination: issuerPublicKey,
                    asset: Asset.native(),
                    amount: amountDIAM,
                })
            )
            .setTimeout(30)
            .build();


        transaction.sign(receiverKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`${amountDIAM} DIAM payment has been done successfully!!`);
        diamPaymentResult = result;


        const assetDetails = new Asset(assetName, issuerPublicKey);


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
            .then((result) => {
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
                            amount: amountAsset,
                        })
                    )
                    .setTimeout(100)
                    .build();
                transaction.sign(issuerKeypair);
                return server.submitTransaction(transaction);
            })
            .then((result) => {
                console.log(result);
                paymentResult = result;


                res.status(200).json({
                    message: "Operations successful",
                    diamPaymentResult,
                    changeTrustResult,
                    paymentResult,
                });
            })
            .catch(function (error) {
                console.error("Error!", error);
                res.status(500).json({
                    error: "An error occurred during the transaction process",
                    details: error.message,
                });
            });
    } catch (error) {
        console.error("Error in issuance of assets:", error);
        res.status(500).json({ error: error.message });
    }
};
