const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

//only registered users can login
// ✅ Task 7 – Login a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate username & password
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Successful login
  return res.status(200).json({ message: "Login successful!" }); // <--- Match exactly
});

// ✅ Task 8 – Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from request
  const reviewText = req.query.review; // Get review from query
  const username = req.session.authorization?.username; // Get username from session

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review for this user
  book.reviews[username] = reviewText;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: book.reviews,
  });
});

// ✅ Task 9 – Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from request
  const username = req.session.authorization?.username; // Get username from session

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if this user has a review
  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: book.reviews,
    });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
