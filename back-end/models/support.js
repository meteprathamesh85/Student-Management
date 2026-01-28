const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    topic: String,
    studentId: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Support", supportSchema);
