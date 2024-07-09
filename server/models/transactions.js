const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    txnHash: {
        type: String,
        required: true,
    },
    investorAddress: {
        type: String,
        required: true,
    },
    tokenAmount: {
        type: Number,
        required: true,
    },
    diamAmount: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;





