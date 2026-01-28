const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/Student");
const Support = require("./models/Support");
const User = require("./models/User");

const app = express();
const PORT = 3000;

app.use(cors());   
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ➕ Add Student API
app.post("/api/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json({ message: "Student added successfully ✅", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📄 Get All Students API
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("🚀 Student Management Backend Connected to MongoDB!");
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

// 📩 Save Support Form
app.post("/api/support", async (req, res) => {
    try {
        const support = new Support(req.body);
        await support.save();
        res.json({ message: "Support request submitted successfully ✅" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📝 Register User
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered ❌" });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.json({ message: "Registration successful ✅" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔐 Login User
app.post("/api/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email, password, role });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password ❌"
            });
        }

        res.json({
            message: "Login successful ✅",
            role: user.role,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ message: "Server error ❌" });
    }
});

