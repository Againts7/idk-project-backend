const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3456;

app.listen(PORT, () => {
  console.log(`server berjalan di: http://localhost:${PORT}`);
});
