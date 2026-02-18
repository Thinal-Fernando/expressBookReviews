// general.js
console.log("GENERAL.JS LOADED FROM:", __filename);

const express = require("express");
const axios = require("axios"); // Ready for real API calls if needed
const books = require("./booksdb.js"); // Local book database
const { users, isValid } = require("./auth_users.js"); // User utilities
const public_users = express.Router();

/**
 * ✅ Task 1 – Get all books
 * Returns all books in the database.
 * Wrapped in a Promise to simulate async operations (like fetching from an API).
 */
public_users.get("/", async (req, res) => {
    try {
        const allBooks = await Promise.resolve(books);
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books", error: err });
    }
});

/**
 * ✅ Task 2 – Get book details based on ISBN
 * Route: /isbn/:isbn
 * Retrieves a single book object by ISBN.
 */
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Promise.resolve(books[isbn]); // Simulate async fetch with Promise

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving book", error: err });
    }
});

/**
 * ✅ Task 3 – Get books based on author
 * Route: /author/:author
 * Filters all books to return only those by the specified author.
 * Case-insensitive matching.
 */
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const allBooks = await Promise.resolve(Object.values(books));

        const filteredBooks = allBooks.filter(
            (book) => book.author.toLowerCase() === author
        );

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books", error: err });
    }
});

/**
 * ✅ Task 4 – Get books based on title
 * Route: /title/:title
 * Filters all books to return only those with the specified title.
 * Case-insensitive matching.
 */
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const allBooks = await Promise.resolve(Object.values(books));

        const filteredBooks = allBooks.filter(
            (book) => book.title.toLowerCase() === title
        );

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books", error: err });
    }
});

/**
 * ✅ Task 5 – Get book reviews by ISBN
 * Route: /review/:isbn
 * Returns only the reviews object for a given book.
 */
public_users.get("/review/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Promise.resolve(books[isbn]);

        if (book) {
            res.status(200).json(book.reviews);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving reviews", error: err });
    }
});

module.exports.general = public_users;
