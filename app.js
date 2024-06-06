"use strict";
// 1. Load required modules
const express = require("express");
const multer = require("multer");
const mysql = require("promise-mysql");
const config = require("./config.js");
const cookieParser = require("cookie-parser");
const expressSession = require('express-session')

const app = express();

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

// Cookie expires in 15 minutes
const COOKIE_EXP_TIME = 15 * 60 * 1000;
const FAQ = {
    brickexchange: {
        "How long does delivery typically take?": "The expected delivery time is 2-3 weeks.",
        "Where do the used LEGO sets come from?": "They come from exchanged LEGO sets from users.",
        "What if there's a set I want that is out of stock?":
            "You'll have to wait for it to either come back or simply use another site, like BrickLink.",
        "How do I sell my set(s) on BrickExchange?": "Please use our contact form and we'll be in touch.",
        "Why can't I log in?":
            "Currently, the login feature is only open to administrators who add new products / update inventory."
    }
}

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module
app.use(cookieParser()); // requires the "cookie parser"
app.use(express.static("public"));
app.use(expressSession({
   secret: config.SESSION_KEY,
   resave: false,
   saveUninitialized: true,
   cookie: {maxAge: COOKIE_EXP_TIME}
}));

/**
 * Establishes a database connection to the storedb and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDB() {
    const db = await mysql.createConnection({
      // Variables for connections to the database.
      host: config.HOST,
      port: config.PORT,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DATABASE
    });
    return db;
}

// GET endpoints

app.get('/products', async (req, res, next) => {
    let storeName = req.query.store_name;
    if (!(storeName)) {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Missing GET parameter: store name."));
    }
    else {
        let db;
        try {
            db = await getDB(); // connection error thrown in getDB();
            let selectFields = "id, image_url, category, title, price, quantity";
            let qry = `SELECT ${selectFields} FROM products WHERE store_name=?;`;
            let result = await db.query(qry, [storeName.toLowerCase()]);
            res.json(result);
        } catch (err) {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
            next(err);
        }
        if (db) { // only defined if getDB() returned a successfully-connected object
            db.end();
        }
    }
});

app.get('/product', async (req, res, next) => {
    let productId = req.query.product_id;
    if (!(productId)) {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Missing GET parameter: product_id."));
    }
    else {
        let db;
        try {
            db = await getDB(); // connection error thrown in getDB();
            let selectFields = "id, image_url, category, title, description, price, quantity";
            let qry = `SELECT ${selectFields} FROM products WHERE id=?;`;
            let result = await db.query(qry, [productId]);
            res.json(result[0]);
        } catch (err) {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
            next(err);
        }
        if (db) { // only defined if getDB() returned a successfully-connected object
            db.end();
        }
    }
});

app.get('/products/category', async (req, res, next) => {
    let storeName = req.query.store_name;
    let category = req.query.category;
    if (!(storeName)) {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Missing GET parameter: store name."));
    }
    else {
        let db;
        try {
            db = await getDB(); // connection error thrown in getDB();
            let selectFields = "id, image_url, category, title, price, quantity";
            let qry = `SELECT ${selectFields} FROM products WHERE store_name=? AND category=?;`;
            let result = await db.query(qry, [storeName.toLowerCase(), category]);
            res.json(result);
        } catch (err) {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
            next(err);
        }
        if (db) { // only defined if getDB() returned a successfully-connected object
            db.end();
        }
    }
});

app.get('/categories', async (req, res, next) => {
    let storeName = req.query.store_name;
    if (!(storeName)) {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Missing GET parameter: store name."));
    }
    else {
        let db;
        try {
            db = await getDB(); // connection error thrown in getDB();
            let qry = `SELECT DISTINCT category FROM products WHERE store_name=?;`;
            let result = await db.query(qry, [storeName.toLowerCase()]);
            res.json(result);
        } catch (err) {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
            next(err);
        }
        if (db) { // only defined if getDB() returned a successfully-connected object
            db.end();
        }
    }
});

app.get('/admin/isloggedin', (req, res, next) => {
    let loggedIn = false;
    if (req.session.loggedIn) {
        loggedIn = true;
    }
    res.json({
        "logged_in": loggedIn
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/");
});

app.get('/faq', (req, res, next) => {
    let storeName = req.query.store_name;
    if (FAQ.hasOwnProperty(storeName.toLowerCase())) {
        res.json(FAQ[storeName.toLowerCase()])
    } else {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Invalid store name!"));
    }
});

// POST endpoints

app.post('/admin/product/create', async (req, res, next) => {
    let storeName = req.body.store_name
    let productTitle = req.body.title;
    let productDescription = req.body.description;
    let productPrice = req.body.price;
    let productQty = req.body.quantity;
    let productCategory = req.body.category;
    let productImageUrl = req.body.image_url;

    if (!(storeName && productDescription && productCategory &&
          productTitle && productPrice && productQty)) {
        res.status(CLIENT_ERR_CODE); // re-route to errorHandler, exiting this function
        next(Error("Missing POST parameter: store name, title, description, " +
                   "price, quantity, and/or category."));
    }

    if (productQty < 0) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Quantity of product should not be negative."));
    }

    let db;
    try {
        db = await getDB(); // connection error thrown in getDB();
        let insertFields = "(store_name, image_url, category, title, description, price, quantity)";
        let qry = `INSERT INTO products ${insertFields} VALUES (?, ?, ?, ?, ?, ?, ?);`;
        await db.query(qry, [storeName.toLowerCase(), productImageUrl, productCategory, productTitle,
                             productDescription, productPrice, productQty]);
        res.json({"status_message": `Request to add ${productTitle} to ${storeName} ` +
                 `successfully processed!`, "success": true});
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
    if (db) { // only defined if getDB() returned a successfully-connected object
        db.end();
    }
});

app.post('/admin/product/edit', async (req, res, next) => {
    let productId = req.body.product_id;

    if (!productId) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: product id."));
    }

    if (req.body.quantity && req.body.quantity < 0) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Quantity of product should not be negative."));
    }

    let db;
    try {
        db = await getDB(); // connection error thrown in getDB();
        let selectFields = "id, image_url, category, title, description, price, quantity";
        let productQry = `SELECT ${selectFields} FROM products WHERE id=?;`;
        let product = (await db.query(productQry, [productId]))[0];
        let productTitle = req.body.title ?? product["title"];
        let productDescription = req.body.description ?? product["description"];
        let productPrice = req.body.price ?? product["price"];
        let productQty = req.body.quantity ?? product["quantity"];
        let productCategory = req.body.category ?? product["category"];
        let productImageUrl = req.body.image_url ?? product["image_url"];
        let qry = "UPDATE products SET title=?, description=?, price=?, " +
                  "quantity=?, category=?, image_url=? WHERE id=?;";
        await db.query(qry, [productTitle, productDescription, productPrice,
                             productQty, productCategory,
                             productImageUrl, productId]);
        res.json({"status_message": `Request to edit product ${productId} ` +
                 `successfully processed!`, "success": true});
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
    if (db) { // only defined if getDB() returned a successfully-connected object
        db.end();
    }
});

app.post('/admin/product/delete', async (req, res, next) => {
    let productId = req.body.product_id;

    if (!(productId)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: product id."));
    }
    let db;
    try {
        db = await getDB(); // connection error thrown in getDB();
        let qry = "DELETE FROM products WHERE id=?;";
        await db.query(qry, [productId]);
        res.json({"status_message": `Request to delete product ${productId} ` +
                 `successfully processed!`, "success": true});
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

app.post('/admin/login', async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    req.session.loggedIn = true;
    res.json({
        "success": true,
        "status_message": "Successfully logged into admin portal!"
    });
});

app.post('/contact', async (req, res, next) => {
    let storeName = req.body.store_name;
    let email = req.body.email;
    let message = req.body.message;

    if (!(storeName && message && email)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: store name, email, and/or message."));
    }
    let db;
    try {
        db = await getDB(); // connection error thrown in getDB();
        let qry = "INSERT INTO contact_messages (store_name, email, msg) " +
                  "VALUES (?, ?, ?);";
        await db.query(qry, [storeName, email, message]);
        res.json({"status_message": "Successfully sent message!", "success": true});
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

app.post('/purchase', async (req, res, next) => {
    let cart = JSON.parse(req.body.cart);

    if (!(cart)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Missing POST parameter: cart."));
    }
    let db;
    try {
        db = await getDB(); // connection error thrown in getDB();
        for (let productId in cart) {
            let purchasedQty = cart[productId];
            let qry = "UPDATE products SET quantity = GREATEST(0, quantity - ?)"
                      + " WHERE id=?;";
            await db.query(qry, [purchasedQty, productId]);
        }
        res.json({"status_message": "Successfully purchased items!", "success": true});
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Error-handling middleware.
 */
function errorHandler(err, req, res, next) {
    if (DEBUG) {
      console.error(err);
    }
    res.json({"status_message": err.message});
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT);