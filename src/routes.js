const express = require('express');
const router = express.Router();

// On importe notre fausse BDD de l'étape 3
const { students, getNextId } = require('./data');

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

// 3. POST /students -> Objectif : Créer un nouvel étudiant
router.post('/', (req, res) => {
  const { firstName, lastName, email, grade, field } = req.body;

  // Valide 1 : Tous les champs sont obligatoires
  if (!firstName || !lastName || !email || grade === undefined || !field) {
    return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
  }

  // Valide 2 : min 2 caractères
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).json({ erreur: "Le prénom et nom doivent faire au moins 2 caractères" });
  }

  // Valide 3 : format d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erreur: "Format d'email invalide" });
  }

  // Valide 4 : email unique
  const emailExists = students.find(s => s.email === email);
  if (emailExists) {
    return res.status(409).json({ erreur: "Cet email est déjà pris par un autre étudiant" });
  }

  // Valide 5 : grade entre 0 et 20
  if (typeof grade !== 'number' || grade < 0 || grade > 20) {
    return res.status(400).json({ erreur: "La note (grade) doit être un nombre entre 0 et 20" });
  }

  // Valide 6 : parcours unique
  const validFields = ["informatique", "mathématiques", "physique", "chimie"];
  if (!validFields.includes(field)) {
    return res.status(400).json({ erreur: "Filière invalide" });
  }

  // Succès ! Création avec génération de l'ID
  const newStudent = { id: getNextId(), firstName, lastName, email, grade, field };
  students.push(newStudent);

  // Renvoie un code 201 Created (très important en REST !)
  res.status(201).json(newStudent);
});


module.exports = router;
