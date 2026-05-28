const path = require('path');
const express = require('express');

const app = express();


const root = __dirname;


app.use(express.static(root));


app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'html', 'index.html'));
});


app.get('/catalog', (req, res) => {
  res.sendFile(path.join(root, 'html', 'catalog.html'));
});


app.get('/product', (req, res) => {
  res.sendFile(path.join(root, 'html', 'product.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



