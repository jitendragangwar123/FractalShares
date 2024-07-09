const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Wallet = mongoose.model('Wallet', WalletSchema);


module.exports = Wallet;



