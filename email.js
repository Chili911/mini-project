// 4. Save email and name to users.json 
const express = require("express");
const fs = require("fs");
const path = require("path");
const server = express();  // Changed "app" to "server"
const PORT = 4000;

// Middleware to handle static files and JSON requests
server.use(express.static("public"));
server.use(express.json());

// File path for storing user emails
const USERS_FILE = path.join(__dirname, "data", "users.json");

server.post("/save-email", (req, res) => {
    const { name, email } = req.body;

    // Check if both name and email are provided
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    // Read the existing users.json data
    fs.readFile(USERS_FILE, (err, data) => {
        let users = [];

        // If there was an error or no data (file might be empty), proceed with an empty array
        if (err || data.length === 0) {
            users = [];
        } else {
            // Otherwise, parse the data
            users = JSON.parse(data);
        }

        // Add the new email and name to the users array
        users.push({ name, email });

        // Save the updated users data to users.json
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving data" });
            }

            // Respond with success
            res.json({ message: "Email and name saved successfully!" });
        });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
