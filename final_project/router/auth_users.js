const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Username valid hai ya nahi (pehle se majood toh nahi)
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Username aur password match karte hain ya nahi
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({
        message: "Error logging in. Please provide username and password.",
      });
  }

  if (authenticatedUser(username, password)) {
    // JWT Token generate karo
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );

    // Token ko session mein save karo
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 8: Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization["username"]; // Session se username nikala

  if (!review) {
    return res
      .status(404)
      .json({ message: "Please provide a review in the query." });
  }

  if (books[isbn]) {
    // Agar review pehle se hai, toh update ho jayega. Agar naya hai toh add ho jayega.
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .json({
        message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 9: Delete a book review (Yeh aapki file mein missing tha)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"]; // Session se username nikala

  if (books[isbn] && books[isbn].reviews[username]) {
    // Sirf apna review delete kar sakta hai
    delete books[isbn].reviews[username];
    return res
      .status(200)
      .json({
        message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`,
      });
  } else {
    return res
      .status(404)
      .json({
        message: "Review not found or you are not authorized to delete it.",
      });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
