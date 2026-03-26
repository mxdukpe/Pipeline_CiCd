const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
