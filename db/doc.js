const mongoose = require('mongoose');

// Define the schema for the crypto data
const cryptoSchema = new mongoose.Schema({
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String
});

// Export the model using the correct schema name
module.exports = mongoose.model("Doc", cryptoSchema);
