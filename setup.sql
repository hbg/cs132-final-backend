
/*
    Authors: Harris Beg and Maddie Ramos
    Class: CS 132

    The created tables within the database represent a register of created
    admin accounts, a database of product inventories, and a database of
    contact messages sent by users of the sites.
*/

CREATE DATABASE IF NOT EXISTS storedb;
USE storedb;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS admin_accounts;


-- Represents a user, uniquely identified by their email.
CREATE TABLE IF NOT EXISTS admin_accounts (
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Represents a product, uniquely identified by its ID.
CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    image_url   VARCHAR(255) NOT NULL,
    store_name  VARCHAR(32) NOT NULL,
    category    VARCHAR(255) NOT NULL,
    title       VARCHAR(64) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price       INT NOT NULL,
    -- Number of the product that is currently in stock.
    quantity    INT NOT NULL
);

-- Represents contact messages.
CREATE TABLE IF NOT EXISTS contact_messages (
    store_name  VARCHAR(32) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    msg         TEXT NOT NULL
);

INSERT INTO admin_accounts (email, password_hash) VALUES
("admin@test.edu", "$2b$10$v5k9r7Qc7CLV.gVIVIO3Ke02.GbJnZ3Nb2Rf9orqNnnqzA/OKn526");

INSERT INTO products (store_name, image_url, category, title, description, price, quantity) VALUES
("brickexchange", "https://cdn.rebrickable.com/media/sets/6211-1/123997.jpg", "Star Wars", "2006 Imperial Star Destroyer", "A new-in-box and sealed 2006 Imperial Star Destroyer.", 400, 4),
("brickexchange", "https://cdn.rebrickable.com/media/sets/75055-1/2229.jpg", "Star Wars", "2014 Imperial Star Destroyer", "A new-in-box and sealed 2014 Imperial Star Destroyer.", 250, 1),
("brickexchange", "https://cdn.rebrickable.com/media/sets/75054-1/5150.jpg", "Star Wars", "2014 AT-AT", "A new-in-box and sealed 2014 AT-AT.", 150, 2),
("brickexchange", "https://cdn.rebrickable.com/media/sets/7161-1/16093.jpg", "Star Wars", "1999 Gungan Sub", "A new-in-box and sealed 1999 Gungan Sub.", 155, 2),
("brickexchange", "https://cdn.rebrickable.com/media/sets/75058-1/15297.jpg", "Star Wars", "2014 MTT", "A new-in-box and sealed 2014 MTT.", 250, 2),
("brickexchange", "https://cdn.rebrickable.com/media/sets/7672-1/65718.jpg", "Star Wars", "2008 Rogue Shadow", "A new-in-box and sealed 2008 Rogue Shadow.", 365, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/76269-1/129297.jpg", "Avengers", "2023 Avengers Tower", "A new-in-box and sealed 2023 Avengers Tower.", 420, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/76214-1/110365.jpg", "Super Heroes Marvel", "2022 Black Panther: War on the Water", "A new-in-box and sealed 2022 Black Panther: War on the Water.", 45, 4),
("brickexchange", "https://cdn.rebrickable.com/media/sets/76252-1/122616.jpg", "UCS", "2023 Batcave Shadowbox", "A new-in-box and sealed 2023 Batcave Shadowbox.", 330, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/76139-1/15647.jpg", "UCS", "2019 1989 Batmobile", "A new-in-box and sealed 2019 1989 Batmobile.", 34, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/76153-1/64692.jpg", "Avengers", "2020 Avengers Helicarrier", "A new-in-box and sealed 2020 Avengers Helicarrier.", 115, 1),
("brickexchange", "https://cdn.rebrickable.com/media/sets/10189-1/52584.jpg", "Creator Expert", "2008 Taj Mahal", "A new-in-box and sealed 2008 Taj Mahal.", 600, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/10214-1/14563.jpg", "Creator Expert", "2010 Tower Bridge", "A new-in-box and sealed 2010 Tower Bridge.", 250, 3),
("brickexchange", "https://cdn.rebrickable.com/media/sets/10234-1/15850.jpg", "Creator Expert", "2013 Sydney Opera House", "A new-in-box and sealed 2013 Sydney Opera House.", 375, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/71043-1/15516.jpg", "Harry Potter", "2018 Hogwarts Castle", "A new-in-box and sealed 2018 Hogwarts Castle.", 300, 3),
("brickexchange", "https://cdn.rebrickable.com/media/sets/4738-1/4220.jpg", "Harry Potter", "2010 Hagrid's Hut", "A new-in-box and sealed 2010 Hagrid's Hut.", 60, 5),
("brickexchange", "https://cdn.rebrickable.com/media/sets/10217-1/48433.jpg", "Harry Potter", "2011 Diagon Alley", "A new-in-box and sealed 2011 Diagon Alley.", 330, 4);