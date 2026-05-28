const path = require('path');
const express = require('express');

const app = express();

// корень проекта (files)
const root = __dirname;

// статика (css, js, assets, html)
app.use(express.static(root));

// главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'html', 'index.html'));
});

// каталог
app.get('/catalog', (req, res) => {
  res.sendFile(path.join(root, 'html', 'catalog.html'));
});

// продукт
app.get('/product', (req, res) => {
  res.sendFile(path.join(root, 'html', 'product.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



