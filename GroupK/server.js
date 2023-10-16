const express = require('express');
const oracledb = require('oracledb');
const dbconfig = require('./dbconfig');

const app = express();
const PORT = 3000;

oracledb.initOracleClient({ libDir: 'E:/instantclient-basic-windows.x64-21.11.0.0.0dbru/instantclient_21_11' });

app.get('/data', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbconfig);
    const result = await connection.execute(`SELECT product_id FROM inventory`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting data from the database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

app.use(express.static('public'));

