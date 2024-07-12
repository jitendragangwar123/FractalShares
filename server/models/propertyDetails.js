const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    userAddress: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    earnedYield: {
        type: Number,
        required: true
    },
    holdingTokens: {
        type: Number,
        required: true
    }
}, { _id: false });

const PropertySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    yieldPercentage: {
        type: Number,
        required: true
    },
    availableTokens: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    userData: [UserDataSchema]
});

const PropertyDetails = mongoose.model('Property', PropertySchema);


module.exports = PropertyDetails;





