const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'users.json');

// Helper to read users from file
function readUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper to write users to file
function writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Signup Route
app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;
    const users = readUsers();

    console.log("Received signup:", { email, name }); // 👈 debug


    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        email,
        password,
        name,
        referralCode: `REF${Math.floor(Math.random() * 10000)}`,
        totalDonations: Math.floor(Math.random() * 1000)
    };

    users.push(newUser);
     try {
        writeUsers(users); // 👈 file write
        console.log("User saved:", newUser); // 👈 confirm
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.error("Write failed:", err);
        res.status(500).json({ message: 'Server error saving user' });
    }
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', email: user.email });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Dashboard Data Route
app.get('/api/intern/:email', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.email === req.params.email);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Leaderboard Route
app.get('/api/leaderboard', (req, res) => {
    const users = readUsers();
    const sortedUsers = [...users].sort((a, b) => b.totalDonations - a.totalDonations);
    const leaderboardData = sortedUsers.map(user => ({
        name: user.name,
        referralCode: user.referralCode,
        totalDonations: user.totalDonations
    }));
    res.json(leaderboardData);
});

app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});
