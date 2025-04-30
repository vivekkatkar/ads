# Neo4j Cypher Queries

This README provides an overview of the Cypher queries in `neo4j_queries.cypher` for generating and manipulating data in a Neo4j database.

## Queries Overview

1. **Create Person Nodes**
   - Creates 4 `Person` nodes with properties: name, age, and city.
   - Example: `CREATE (p1:Person {name: 'Alice', age: 30, city: 'New York'})`

2. **Create FRIENDS_WITH Relationships**
   - Establishes `FRIENDS_WITH` relationships between persons with a `since` property.
   - Example: `CREATE (p1)-[:FRIENDS_WITH {since: 2020}]->(p2)`

3. **Create Company Nodes**
   - Creates 2 `Company` nodes with properties: name, industry, and founded year.
   - Example: `CREATE (c1:Company {name: 'TechCorp', industry: 'Technology', founded: 2010})`

4. **Create WORKS_AT Relationships**
   - Links persons to companies with `role` and `start_year` properties.
   - Example: `CREATE (p1)-[:WORKS_AT {role: 'Developer', start_year: 2021}]->(c1)`

5. **Query: Find Persons and Friends**
   - Retrieves all persons, their friends, and the year their friendship started.
   - Query: `MATCH (p:Person)-[r:FRIENDS_WITH]->(f:Person) RETURN p.name, f.name, r.since`

6. **Query: Find Employees at a Company**
   - Finds all persons working at 'TechCorp' with their roles.
   - Query: `MATCH (p:Person)-[r:WORKS_AT]->(c:Company {name: 'TechCorp'}) RETURN p.name, r.role, c.name`

7. **Query: Find Friends in Same City**
   - Identifies friends living in the same city.
   - Query: `MATCH (p1:Person)-[:FRIENDS_WITH]->(p2:Person) WHERE p1.city = p2.city RETURN p1.name, p2.name, p1.city`

8. **Update: Modify Person's Age**
   - Updates the age of 'Alice' to 31.
   - Query: `MATCH (p:Person {name: 'Alice'}) SET p.age = 31 RETURN p`

9. **Delete: Remove Friendship**
   - Deletes the `FRIENDS_WITH` relationship between 'Alice' and 'Bob'.
   - Query: `MATCH (p1:Person {name: 'Alice'})-[r:FRIENDS_WITH]->(p2:Person {name: 'Bob'}) DELETE r`

10. **Aggregation: Count Employees per Company**
    - Counts the number of employees per company.
    - Query: `MATCH (p:Person)-[:WORKS_AT]->(c:Company) RETURN c.name, count(p)`

## Usage
- Run the queries in `neo4j_queries.cypher` in a Neo4j database (e.g., Neo4j Desktop, Aura, or Sandbox).
- Execute queries sequentially to ensure data creation before operations.
- Use the Neo4j Browser or a Cypher-compatible client to run these queries.

## Notes
- Ensure you have a running Neo4j instance.
- Queries are designed for a fresh database; clear existing data if necessary (`MATCH (n) DETACH DELETE n`).
- Modify property values (e.g., names, cities) as needed for your use case.