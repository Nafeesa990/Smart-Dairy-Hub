// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

// const app = express();
// app.use(express.json());

// // User Schema
// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true, enum: ["admin", "customer", "farmer", "delivery"] }
// });

// const User = mongoose.model("User", UserSchema);

// // **User Registration (Sign Up)**
// app.post("/signup", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(400).json({ message: "User already exists" });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new User({ email, password: hashedPassword, role });

//   await newUser.save();
//   res.status(201).json({ message: "User registered successfully" });
// });

// // **User Login**
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

//   res.json({ success: true, role: user.role, token });
// });

// // **Protected Route Example**
// app.get("/dashboard", (req, res) => {
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, "your_secret_key");
//     res.json({ message: `Welcome to ${decoded.role} dashboard` });
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });

// module.exports=app;
