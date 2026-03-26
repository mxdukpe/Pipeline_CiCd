// Liste initiale de 5 étudiants de test
const initialStudents = [
  { id: 1, firstName: "Alice", lastName: "Dupont", email: "alice@example.com", grade: 15, field: "informatique" },
  { id: 2, firstName: "Bob", lastName: "Martin", email: "bob@example.com", grade: 12, field: "mathématiques" },
  { id: 3, firstName: "Charlie", lastName: "Durand", email: "charlie@example.com", grade: 18, field: "physique" },
  { id: 4, firstName: "Diana", lastName: "Leroyg", email: "diana@example.com", grade: 9, field: "chimie" },
  { id: 5, firstName: "Eve", lastName: "Perrin", email: "eve@example.com", grade: 16, field: "informatique" },
];

// Notre "Base de données" en mémoire (variable qu'on va modifier)
let students = [...initialStudents];

// Fonction pour auto-incrémenter l'ID (chercher le + grand ID et faire +1)
function getNextId() {
  if (students.length === 0) return 1;
  return Math.max(...students.map(s => s.id)) + 1;
}

// Fonction exigée pour réinitialiser les données lors des tests
function resetData() {
  students.length = 0; // On vide le tableau original 
  students.push(...initialStudents); // On le re-remplit avec les données par défaut
}

// On exporte tout ça pour que notre API (app.js) puisse y accéder
module.exports = {
  students,
  resetData,
  getNextId
};
