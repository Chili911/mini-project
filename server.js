const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 4000;

app.use(express.static("public"));
app.use(express.json());

const session = require("express-session");

app.use(session({
    secret: 'mySecretKey123',    // Secret for signing the session ID cookie
    resave: false,               // Do not save session if nothing is modified
    saveUninitialized: true,     // Save new sessions that are not modified
    cookie: { secure: false }    // false because we're using http:// not https://
}));


//  file paths for storing user, book, and borrower data
const USERS_FILE = path.join(__dirname, "data", "users.json");
const BOOKS_FILE = path.join(__dirname, "data", "books.json");
const BORROWERS_FILE = path.join(__dirname, "data", "borrowers.json");
const SUBSCRIBERS_FILE = path.join(__dirname, "data", "subscribers.json");

app.post("/register", (req, res) => {
    const user = req.body;

    // Save user's name into session
    req.session.userName = user.name;

    // Read existing users from file
    fs.readFile(USERS_FILE, (err, data) => {
        let users = [];

        if (!err && data.length > 0) {
            try {
                users = JSON.parse(data);
            } catch (e) {
                return res.status(500).json({ message: "Error parsing user data." });
            }
        }

        // 🔍 Check for conflicts
        const emailUsed = users.some(u => u.email === user.email);
        const nameUsed = users.some(u => u.name === user.name);

        if (emailUsed && nameUsed) {
            return res.status(400).json({ message: "❌ This name and email are already registered." });
        } else if (emailUsed) {
            return res.status(400).json({ message: "❌ This email is already in use. Please use a different email address." });
        } else if (nameUsed) {
            return res.status(400).json({ message: "❌ This name is already in use. Please use a different name." });
        }

        // ✅ No conflict, save new user
        users.push(user);
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ message: "Error saving user." });
            }
            res.json({ message: "✅ User registered successfully!" });
        });
    });
});


//Route to get the list of books (GET request)

app.get("/books", (req, res) => {
    fs.readFile(BOOKS_FILE, (err, data) => {  // Read the books data from the file
        if (err) return res.status(500).send("Error loading books");
        res.json(JSON.parse(data));

    });

});

app.post("/borrow-info", (req, res) => {
    const borrower = req.body;

    // Save borrower info in session
    req.session.borrowerInfo = borrower;

    // Save borrower info to file
    fs.readFile(BORROWERS_FILE, (err, data) => {
        let borrowers = [];
        if (!err && data.length > 0) borrowers = JSON.parse(data);
        borrowers.push(borrower);
        fs.writeFile(BORROWERS_FILE, JSON.stringify(borrowers, null, 2), () => {
            res.json({ message: "Borrower information saved successfully and session created!" });
        });
    });
});

app.get("/borrower-session", (req, res) => {
    if (req.session.borrowerInfo) {
        res.json(req.session.borrowerInfo);
    } else {
        res.json({ message: "No borrower session found." });
    }
});



app.post("/subscribe", (req, res) => {
    const subscriber = req.body;
  
    fs.readFile(SUBSCRIBERS_FILE, (err, data) => {
      let subscribers = [];
      if (!err && data.length > 0) {
        try {
          subscribers = JSON.parse(data);
        } catch {
          return res.status(500).json({ message: "Corrupted subscriber file." });
        }
      }
  
      subscribers.push(subscriber);
  
      fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), (err) => {
        if (err) return res.status(500).json({ message: "Error saving subscription." });
        res.json({ message: "✅ Subscribed." });

      });
    });
  });
  


 // for session timer
app.get("/check-timeout", (req, res) => {
    const TIMEOUT_LIMIT = 15 * 60 * 1000; // 15 mins
    const currentTime = Date.now();

    if (!req.session.timeoutStart) {
        // ⚠️ No timeout session started yet!
        return res.json({ timeout: false, remainingTime: TIMEOUT_LIMIT });
    }

    const elapsed = currentTime - req.session.timeoutStart;
    if (elapsed > TIMEOUT_LIMI) {
        req.session.destroy();
        res.json({ timeout: true, message: "Session expired." });
    } else {
        const remaining = TIMEOUT_LIMIT - elapsed;
        res.json({ timeout: false, remainingTime: remaining });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));