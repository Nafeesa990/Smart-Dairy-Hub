const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const deliveryAgents = [
  { username: "agent1", password: "agents" },
  { username: "agent2", password: "delivery456" },
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const agent = deliveryAgents.find(
    (a) => a.username === username && a.password === password
  );

  if (!agent) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: agent.username }, "your_secret_key", { expiresIn: "1h" });
  res.json({ success: true, token });
});


// Logout Route
router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      blacklistedTokens.add(token);
      return res.json({ success: true, message: "Logged out successfully" });
    }
    res.status(400).json({ success: false, message: "Token missing" });
  });
  
  // Middleware to Check Token Validity
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
  
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ message: "Token is invalidated" });
    }
  
    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.user = decoded;
      next();
    });
  };
module.exports = router;
