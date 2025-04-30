CREATE DATABASE CustomerOrderDW;
USE CustomerOrderDW;

-- Create Dimension Tables
CREATE TABLE DimCustomers (
    Customer_id INT PRIMARY KEY,
    Customer_name VARCHAR(255),
    City_id INT,
    City_name VARCHAR(255),
    First_order_date DATE,
    Customer_type ENUM('Walk-in', 'Mail-order', 'Dual')
);

CREATE TABLE DimStores (
    Store_id INT PRIMARY KEY,
    City_id INT,
    City_name VARCHAR(255),
    State VARCHAR(255),
    Phone VARCHAR(20),
    Headquarter_addr VARCHAR(255)
);

CREATE TABLE DimItems (
    Item_id INT PRIMARY KEY,
    Description VARCHAR(255),
    Size VARCHAR(50),
    Weight DECIMAL(10,2),
    Unit_price DECIMAL(10,2)
);

-- Create Fact Table
CREATE TABLE FactOrders (
    Order_no INT PRIMARY KEY,
    Order_date DATE,
    Customer_id INT,
    Store_id INT,
    Item_id INT,
    Quantity_ordered INT,
    Ordered_price DECIMAL(10,2),
    FOREIGN KEY (Customer_id) REFERENCES DimCustomers(Customer_id),
    FOREIGN KEY (Store_id) REFERENCES DimStores(Store_id),
    FOREIGN KEY (Item_id) REFERENCES DimItems(Item_id)
);

-- Insert Sample Data
INSERT INTO DimCustomers (Customer_id, Customer_name, City_id, City_name, First_order_date, Customer_type) 
VALUES (1, 'John Doe', 101, 'New York', '2023-05-15', 'Walk-in');

INSERT INTO DimStores (Store_id, City_id, City_name, State, Phone, Headquarter_addr) 
VALUES (201, 101, 'New York', 'NY', '123-456-7890', 'HQ Address NY');

INSERT INTO DimItems (Item_id, Description, Size, Weight, Unit_price) 
VALUES (301, 'Laptop', '15 inch', 2.5, 1000.00);

INSERT INTO FactOrders (Order_no, Order_date, Customer_id, Store_id, Item_id, Quantity_ordered, Ordered_price) 
VALUES (1001, '2024-02-01', 1, 201, 301, 2, 2000.00);

-- OLAP Queries
-- Query 1: Find all stores holding a particular item
SELECT S.Store_id, S.City_name, S.State, S.Phone, I.Description, I.Size, I.Weight, I.Unit_price
FROM DimStores S
JOIN FactOrders F ON S.Store_id = F.Store_id
JOIN DimItems I ON F.Item_id = I.Item_id
WHERE I.Item_id = 301;

-- Query 2: Find all orders fulfilled by a given store
SELECT F.Order_no, F.Order_date, C.Customer_name 
FROM FactOrders F
JOIN DimCustomers C ON F.Customer_id = C.Customer_id
WHERE F.Store_id = 201;

-- Query 3: Find stores holding items ordered by a given customer
SELECT DISTINCT S.Store_id, S.City_name, S.Phone
FROM FactOrders F
JOIN DimStores S ON F.Store_id = S.Store_id
WHERE F.Customer_id = 1;