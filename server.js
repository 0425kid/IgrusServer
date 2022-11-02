const express = require('express');
const app = express();

app.get('/', (req, res) => res.sendFile(__dirname + '/igrus.html'));

// app.listen(3000, () => console.log('Example app listening on port 3000!'));
app.listen(8080, () => console.log('Example app listening on port 3000!'));
