CREATE DATABASE IF NOT EXISTS storedb;
USE storedb;

CREATE TABLE IF NOT EXISTS admin_accounts (
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    image_url   VARCHAR(255) NOT NULL,
    store_name  VARCHAR(32) NOT NULL,
    category    VARCHAR(255) NOT NULL,
    title       VARCHAR(64) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price       INT NOT NULL,
    quantity    INT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
    store_name  VARCHAR(32) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    msg         TEXT NOT NULL
);