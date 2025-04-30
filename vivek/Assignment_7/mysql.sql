-- Create and use the XMartDataWarehouse database
CREATE DATABASE XMartDataWarehouse;
USE XMartDataWarehouse;

-- Dimension Table: DimProduct
-- Stores product details
CREATE TABLE DimProduct (
    ProductKey INT PRIMARY KEY NOT NULL,
    ProductAltKey INT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    ProductCost DECIMAL(10,2) NOT NULL
);

-- Dimension Table: DimCustomer
-- Stores customer details
CREATE TABLE DimCustomer (
    CustomerID INT PRIMARY KEY NOT NULL,
    CustomerAltID INT NOT NULL,
    CustomerName VARCHAR(100) NOT NULL,
    Gender CHAR(1) NOT NULL -- 'M', 'F', 'O' for Male, Female, Other
);

-- Dimension Table: DimStores
-- Stores store location details
CREATE TABLE DimStores (
    StoreID INT PRIMARY KEY NOT NULL,
    StoreAltID INT NOT NULL,
    StoreLocation VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL
);

-- Dimension Table: DimDate
-- Stores date-related attributes for sales analysis
CREATE TABLE DimDate (
    DateKey INT PRIMARY KEY NOT NULL,
    Date DATE NOT NULL,
    FullDateUK VARCHAR(20) NOT NULL,
    FullDateUSA VARCHAR(20) NOT NULL,
    DayOfMonth INT NOT NULL,
    DaySuffix VARCHAR(10) NOT NULL,
    DayName VARCHAR(20) NOT NULL,
    DayOfWeek INT NOT NULL,
    DayOfWeekInMonth INT NOT NULL,
    DayOfQuarter INT NOT NULL,
    DayOfYear INT NOT NULL,
    WeekOfMonth INT NOT NULL,
    WeekOfQuarter INT NOT NULL,
    WeekOfYear INT NOT NULL,
    Month INT NOT NULL,
    MonthName VARCHAR(20) NOT NULL,
    MonthOfQuarter INT NOT NULL,
    Quarter INT NOT NULL,
    QuarterName VARCHAR(20) NOT NULL,
    Year INT NOT NULL,
    MonthYear VARCHAR(10) NOT NULL,
    FiscalDayOfMonth INT NOT NULL,
    FiscalDayOfQuarter INT NOT NULL,
    FiscalDayOfYear INT NOT NULL,
    FiscalWeekOfYear INT NOT NULL,
    FiscalMonth INT NOT NULL,
    FiscalQuarter INT NOT NULL,
    FiscalQuarterName VARCHAR(20) NOT NULL,
    FiscalYear INT NOT NULL,
    FiscalMonthYear VARCHAR(10) NOT NULL,
    FiscalFirstDayOfMonth DATE NOT NULL,
    FiscalLastDayOfMonth DATE NOT NULL,
    FiscalFirstDayOfQuarter DATE NOT NULL,
    FiscalLastDayOfQuarter DATE NOT NULL,
    FiscalFirstDayOfYear DATE NOT NULL,
    FiscalLastDayOfYear DATE NOT NULL,
    IsHoliday CHAR(1) NOT NULL -- 'Y' or 'N'
);

-- Dimension Table: DimTime
-- Stores time-related attributes for sales analysis
CREATE TABLE DimTime (
    TimeKey INT PRIMARY KEY NOT NULL,
    TimeAltKey INT NOT NULL,
    Time30 INT NOT NULL,
    Hour30 INT NOT NULL,
    MinuteNumber INT NOT NULL,
    SecondNumber INT NOT NULL,
    TimeInSecond INT NOT NULL,
    HourlyBucket VARCHAR(20) NOT NULL,
    DayTimeBucketGroupKey INT NOT NULL,
    DayTimeBucket VARCHAR(20) NOT NULL
);

-- Dimension Table: DimSalesPerson
-- Stores salesperson details, linked to stores
CREATE TABLE DimSalesPerson (
    SalesPersonID INT PRIMARY KEY NOT NULL,
    SalesPersonAltID INT NOT NULL,
    SalesPersonName VARCHAR(100) NOT NULL,
    StoreID INT NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    FOREIGN KEY (StoreID) REFERENCES DimStores(StoreID)
);

-- Fact Table: FactProductSales
-- Stores sales transaction details
CREATE TABLE FactProductSales (
    TransactionID INT PRIMARY KEY NOT NULL,
    SalesInvoiceNumber VARCHAR(50) NOT NULL,
    SalesDateKey INT NOT NULL,
    SalesTimeKey INT NOT NULL,
    StoreID INT NOT NULL,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    SalesPersonID INT NOT NULL,
    Quantity INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (SalesDateKey) REFERENCES DimDate(DateKey),
    FOREIGN KEY (SalesTimeKey) REFERENCES DimTime(TimeKey),
    FOREIGN KEY (StoreID) REFERENCES DimStores(StoreID),
    FOREIGN KEY (CustomerID) REFERENCES DimCustomer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES DimProduct(ProductKey),
    FOREIGN KEY (SalesPersonID) REFERENCES DimSalesPerson(SalesPersonID)
);

-- Create indexes for performance on frequently queried columns
CREATE INDEX idx_salesinvoicenumber ON FactProductSales(SalesInvoiceNumber);
CREATE INDEX idx_salesdatekey ON FactProductSales(SalesDateKey);