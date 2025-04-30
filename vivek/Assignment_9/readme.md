# To run assignment_9_1
1. Run backend 
    -> npm i
    -> node server.js 

2. Run Frontend
    -> start index.html 


# To run assignment_9_2 

1. Run cassandra database using container 
    -> docker run --name cassandra -p 9042:9042 -d cassandra
    -> docker exec -it cassandra cqlsh

    -> CREATE KEYSPACE IF NOT EXISTS companydb
        WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
        };

    -> CREATE TABLE IF NOT EXISTS companydb.companies (
        id UUID PRIMARY KEY,
        name TEXT,
        location TEXT,
        employee_count INT,
        founded_year INT,
        industry TEXT
        );

    -> EXIT;

    -> docker exec -it cassandra cqlsh -e "SELECT * FROM companydb.companies;"

2. Run backend 
    -> npm i
    -> node server.js 

3. Run frontend 
    -> start index.html 

