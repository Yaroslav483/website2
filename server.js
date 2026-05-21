const path = require('path');
const express = require('express');

const app = express();

// Папка с вашим фронтендом (каталог/индекс/продукт и assets)
const publicDir = path.join(__dirname, 'files');

app.use(express.static(publicDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

