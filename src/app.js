const express = require('express');
const routes = require('./routes'); // On importe tes futures routes

const app = express();

// Règle d'or : Toute ton API communiquera en Format JSON
app.use(express.json());

// Toutes nos requêtes commenceront d'office par "/students" (ex: /students/1)
app.use('/students', routes);

// On exporte l'app "nue" sans lancer le listen, pour nos futurs tests
module.exports = app;
