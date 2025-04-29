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

app.post("/register", (req, res) => {
    const user = req.body;

    // Save user's name into session
    req.session.userName = user.name;

    // Save user's info to users.json
    fs.readFile(USERS_FILE, (err, data) => {
        let users = [];
        if (!err && data.length > 0) users = JSON.parse(data);
        users.push(user);
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), () => {
            res.json({ message: "User registered successfully!" });
        });
    });
});


app.get("/user-session", (req, res) => {
    if (req.session.userName) {
        res.json({ name: req.session.userName });
    } else {
        res.json({ name: null });
    }
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


app.get("/check-timeout", (req, res) => {
    const TIMEOUT_LIMIT = 30 * 60 * 1000; // 30 minutes
    const currentTime = Date.now();

    if (!req.session.timeoutStart) {
        // ⚠️ No timeout session started yet!
        return res.json({ timeout: false, remainingTime: TIMEOUT_LIMIT });
    }

    const elapsed = currentTime - req.session.timeoutStart;
    if (elapsed > TIMEOUT_LIMIT) {
        req.session.destroy();
        res.json({ timeout: true, message: "Session expired." });
    } else {
        const remaining = TIMEOUT_LIMIT - elapsed;
        res.json({ timeout: false, remainingTime: remaining });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));