const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "crm_secret_key";

// TEMP DATABASE (replace with MongoDB later)
let users = [];
let leads = [];

/* ---------------- AUTH ---------------- */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  users.push({
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: hashed,
  });

  res.json({ msg: "User created" });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const user = users.find((u) => u.email === req.body.email);

  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token });
});

/* ---------------- MIDDLEWARE ---------------- */

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

/* ---------------- LEADS CRM ---------------- */

// CREATE LEAD
app.post("/api/leads", auth, (req, res) => {
  const lead = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    status: "New",
    notes: [],
  };

  leads.push(lead);
  res.json(lead);
});

// GET ALL LEADS (SEARCH + FILTER)
app.get("/api/leads", auth, (req, res) => {
  const { search, status } = req.query;

  let result = leads;

  if (search) {
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    result = result.filter((l) => l.status === status);
  }

  res.json(result);
});

// UPDATE STATUS
app.put("/api/leads/:id/status", auth, (req, res) => {
  const lead = leads.find((l) => l.id == req.params.id);
  if (!lead) return res.status(404).json({ msg: "Not found" });

  lead.status = req.body.status;
  res.json(lead);
});

// ADD NOTE
app.post("/api/leads/:id/note", auth, (req, res) => {
  const lead = leads.find((l) => l.id == req.params.id);

  if (!lead) return res.status(404).json({ msg: "Not found" });

  lead.notes.push({
    text: req.body.text,
    date: new Date(),
  });

  res.json(lead);
});

app.listen(5000, () => console.log("CRM Server running on 5000"));