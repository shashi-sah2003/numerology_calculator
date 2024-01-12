const express = require('express');
const app = express();
const calculate = require('./routes');

app.use('/',calculate);

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Set up the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://10.43.2.66:${PORT}`);
});
