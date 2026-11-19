const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check karo ke user pehle se toh nahi hai
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let filtered_books = {};

  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].author === author) {
      filtered_books[isbn] = books[isbn];
    }
  });

  if (Object.keys(filtered_books).length > 0) {
    res.send(JSON.stringify(filtered_books, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let filtered_books = {};

  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].title === title) {
      filtered_books[isbn] = books[isbn];
    }
  });

  if (Object.keys(filtered_books).length > 0) {
    res.send(JSON.stringify(filtered_books, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "No reviews found for this book." });
  }
});

module.exports.general = public_users;

const axios = require("axios");

// Ek naya router banaya async tasks ke liye
const async_users = express.Router();
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using Async/Await & Axios
async_users.get("/async", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11: Get book by ISBN using Promises & Axios
async_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res.status(404).send("Book not found");
    });
});

// Task 12: Get books by Author using Async/Await & Axios
async_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    // Pehle saari books fetch ki
    const response = await axios.get(`${BASE_URL}/`);
    const books = response.data;

    let filtered_books = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        filtered_books[isbn] = books[isbn];
      }
    });

    if (Object.keys(filtered_books).length > 0) {
      res.send(JSON.stringify(filtered_books, null, 4));
    } else {
      res.status(404).send("No books found by this author");
    }
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 13: Get books by Title using Async/Await & Axios
async_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/`);
    const books = response.data;

    let filtered_books = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        filtered_books[isbn] = books[isbn];
      }
    });

    if (Object.keys(filtered_books).length > 0) {
      res.send(JSON.stringify(filtered_books, null, 4));
    } else {
      res.status(404).send("No books found with this title");
    }
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Is naye router ko export karein taake index.js mein use kar sakein
module.exports.async_general = async_users;
