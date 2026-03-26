const express = require('express');
const router = express.Router();

// On importe notre fausse BDD de l'étape 3
const { students } = require('./data');

// 1. GET /students -> Objectif : Récupérer tous les étudiants
router.get('/', (req, res) => {
  res.status(200).json(students);
});

// 2. GET /students/:id -> Objectif : Récupérer un étudiant précis
router.get('/:id', (req, res) => {
  const paramId = req.params.id;

  // Règle HTTP 400 : Bad Request si l'id donné n'est pas un nombre
  if (isNaN(paramId)) {
    return res.status(400).json({ erreur: "L'ID doit être un nombre valide" });
  }

  // Chercher l'étudiant via son id
  const student = students.find(s => s.id === parseInt(paramId));

  // Règle HTTP 404 : Not Found si la boucle ne trouve personne
  if (!student) {
    return res.status(404).json({ erreur: "Étudiant non trouvé" });
  }

  // Règle HTTP 200 : OK + l'étudiant
  res.status(200).json(student);
});

module.exports = router;
