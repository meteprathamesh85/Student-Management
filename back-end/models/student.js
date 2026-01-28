const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    department: String,
    rollNo: String,
    attendance: Number
});

module.exports = mongoose.model("Student", studentSchema);
