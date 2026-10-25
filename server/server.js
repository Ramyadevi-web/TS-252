const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Helper function to read users from JSON file
const getUsers = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper function to save users to JSON file
const saveUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// Endpoint 1: Check if mobile/username is registered
app.post('/api/check-user', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required' });
  }

  const users = getUsers();
  const cleanInput = identifier.trim().toLowerCase();

  // Match against mobile or username/email
  const userExists = users.some(
    (u) =>
      u.mobile.trim().toLowerCase() === cleanInput ||
      u.email.trim().toLowerCase() === cleanInput ||
      (u.username && u.username.trim().toLowerCase() === cleanInput)
  );

  return res.json({ isRegistered: userExists });
});

// Endpoint 2: Register a new user
app.post('/api/register', (req, res) => {
  const { name, mobile, email, userType } = req.body;

  if (!name || !mobile || !email) {
    return res.status(400).json({ error: 'Name, Mobile, and Email are required.' });
  }

  const users = getUsers();
  const cleanMobile = mobile.trim();

  // Check if user already exists
  const existingUser = users.find((u) => u.mobile === cleanMobile);
  if (existingUser) {
    return res.status(200).json({ message: 'User already exists', user: existingUser });
  }

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    mobile: cleanMobile,
    email: email.trim().toLowerCase(),
    userType: userType || 'regular', // 'vip' or 'regular'
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return res.status(201).json({ message: 'Registration successful', user: newUser });
});

app.listen(PORT, () => {
  console.log(`TS252 Backend Server running on port ${PORT}`);
});