const path = require('path');
const express = require('express');

const app = express();

const publicRoot = path.join(__dirname, 'files');


app.use(express.static(publicRoot));


app.get('/', (req, res) => {
  res.sendFile(path.join(publicRoot, 'html', 'index.html'));
});

app.get('/:page', (req, res) => {
  let page = req.params.page;

  if (!page.endsWith('.html')) {
    page += '.html';
  }

  res.sendFile(
    path.join(publicRoot, 'html', page)
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
