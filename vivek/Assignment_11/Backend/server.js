require('dotenv').config(); 
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);
const session = driver.session();

app.post('/api/citation-path', async (req, res) => {
  const { fromPaperId, toPaperId } = req.body;

  try {
    const result = await session.run(
      `MATCH path = shortestPath((a:Paper {id: $from})-[:CITES*]->(b:Paper {id: $to}))
       RETURN path, length(path) as pathLength`,
      { from: fromPaperId, to: toPaperId }
    );

    if (result.records.length > 0) {
      const pathLength = result.records[0].get('pathLength').low;
      res.json({ pathExists: true, pathLength });
    } else {
      res.json({ pathExists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while checking the citation path.' });
    console.error(err); 
  }
});

app.get('/api/classification/:paperId', async (req, res) => {
  const paperId = req.params.paperId;
  console.log('Received paperId:', paperId);

  try {
    const paperResult = await session.run(
      `MATCH (p:Paper {paper_id: $paperId})
       RETURN p.paper_id AS paperId, p.title AS paperTitle, p.filename AS filename`,
      { paperId }
    );

    // console.log(paperResult.records);

    if (paperResult.records.length === 0) {
      return res.status(404).json({ error: `No paper found for paperId ${paperId}` });
    }

    const paper = paperResult.records[0];
    const paperIdFromResult = paper.get('paperId');
    const paperTitle = paper.get('paperTitle');
    const filename = paper.get('filename');

    console.log('Paper ID:', paperIdFromResult);
    console.log('Paper Title:', paperTitle);

    const classificationResult = await session.run(
      `MATCH (c:Classification)
       RETURN c.name AS classification`,
      { filename }
    );

    console.log(classificationResult.records)

    if (classificationResult.records.length === 0) {
      return res.status(404).json({ error: `No classification found for filename ${filename}` });
    }

    const classification = classificationResult.records[0].get('classification');
    console.log('Classification:', classification);


    res.json({
      paperId: paperIdFromResult,
      paperTitle: paperTitle,
      classification: classification
    });

  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'An error occurred while fetching the classification path.' });
  }
});

app.post('/api/custom-query', async (req, res) => {
  const { cypherQuery } = req.body;

  try {
    const result = await session.run(cypherQuery);
    const records = result.records.map(r => r.toObject());
    res.json(records);
  } catch (err) {
    res.status(400).json({ error: 'Invalid Cypher query.' });
    console.error(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
