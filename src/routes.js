const express = require('express');
const router = express.Router();

// On importe notre fausse BDD de l'étape 3
const { students, getNextId } = require('./data');

// 1. GET /students -> Objectif : Récupérer tous les étudiants
router.get('/', (req, res) => {
  res.status(200).json(students);
});

// --- ATTENTION: CES 2 ROUTES DOIVENT ÊTRE AVANT LE /:id ---

// 6. GET /students/stats -> Objectif : Statistiques sur les étudiants
router.get('/stats', (req, res) => {
  if (students.length === 0) {
    return res.status(200).json({ totalStudents: 0, averageGrade: 0, studentsByField: {}, bestStudent: null });
  }

  const totalStudents = students.length;
  
  // Calcul de la moyenne
  const sumGrades = students.reduce((acc, student) => acc + student.grade, 0);
  const averageGrade = parseFloat((sumGrades / totalStudents).toFixed(2));

  // Répartition par filière
  const studentsByField = students.reduce((acc, student) => {
    acc[student.field] = (acc[student.field] || 0) + 1;
    return acc;
  }, {});

  // Recherche du meilleur étudiant
  const bestStudent = students.reduce((best, student) => (student.grade > best.grade ? student : best), students[0]);

  res.status(200).json({
    totalStudents,
    averageGrade,
    studentsByField,
    bestStudent
  });
});

// 7. GET /students/search -> Objectif : Rechercher un étudiant par nom/prénom
router.get('/search', (req, res) => {
  const query = req.query.q; // On récupère "?q=..."

  if (!query || query.trim() === "") {
    return res.status(400).json({ erreur: "Le paramètre de recherche 'q' est absent ou vide" });
  }

  const lowerQuery = query.toLowerCase(); // insensible à la casse
  
  const results = students.filter(s => 
    s.firstName.toLowerCase().includes(lowerQuery) || 
    s.lastName.toLowerCase().includes(lowerQuery)
  );

  res.status(200).json(results);
});

// -----------------------------------------------------------


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

// 4. PUT /students/:id -> Objectif : Modifier un étudiant existant
router.put('/:id', (req, res) => {
  const paramId = parseInt(req.params.id);

  if (isNaN(paramId)) {
    return res.status(400).json({ erreur: "L'ID doit être un nombre valide" });
  }

  const studentIndex = students.findIndex(s => s.id === paramId);

  // Règle 404 : L'ID n'existe pas
  if (studentIndex === -1) {
    return res.status(404).json({ erreur: "Étudiant non trouvé" });
  }

  const { firstName, lastName, email, grade, field } = req.body;

  // Règle 400 : Les mêmes validations que le POST
  if (!firstName || !lastName || !email || grade === undefined || !field) {
    return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
  }
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).json({ erreur: "Le prénom et nom doivent faire au moins 2 caractères" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erreur: "Format d'email invalide" });
  }

  // Règle 409 : L'email est pris par un AUTRE étudiant
  const emailExists = students.find(s => s.email === email && s.id !== paramId);
  if (emailExists) {
    return res.status(409).json({ erreur: "Cet email est déjà pris par un autre étudiant" });
  }
  
  if (typeof grade !== 'number' || grade < 0 || grade > 20) {
    return res.status(400).json({ erreur: "La note (grade) doit être un nombre entre 0 et 20" });
  }
  
  const validFields = ["informatique", "mathématiques", "physique", "chimie"];
  if (!validFields.includes(field)) {
    return res.status(400).json({ erreur: "Filière invalide" });
  }

  // Si tout est beau, on écrase l'ancien étudiant avec les nouvelles valeurs
  const updatedStudent = { id: paramId, firstName, lastName, email, grade, field };
  students[studentIndex] = updatedStudent;

  // Code 200 OK
  res.status(200).json(updatedStudent);
});


// 5. DELETE /students/:id -> Objectif : Supprimer un étudiant
router.delete('/:id', (req, res) => {
  const paramId = parseInt(req.params.id);
  
  if (isNaN(paramId)) {
    return res.status(400).json({ erreur: "L'ID doit être un nombre valide" });
  }

  const studentIndex = students.findIndex(s => s.id === paramId);

  // Règle 404 : L'ID n'existe pas
  if (studentIndex === -1) {
    return res.status(404).json({ erreur: "Étudiant non trouvé" });
  }

  // Destruction de l'étudiant 
  students.splice(studentIndex, 1);

  // Code 200 OK + Message
  res.status(200).json({ message: "Étudiant supprimé avec succès" });
});



module.exports = router;
