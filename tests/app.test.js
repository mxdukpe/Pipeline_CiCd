const request = require('supertest');
const app = require('../src/app');
const { resetData } = require('../src/data');

// Avant CHAQUE test, on remet le tableau d'étudiants à 0 pour éviter la triche
beforeEach(() => {
  resetData();
});

describe('=== TESTS DE NOTRE API ===', () => {

  // --- GET TESTS (Les 5 premiers obligatoires) ---
  describe('Tests GET /students', () => {
    it('1. GET /students doit renvoyer 200 et un tableau', async () => {
      const res = await request(app).get('/students');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('2. GET /students doit renvoyer tous les anciens étudiants initiaux', async () => {
      const res = await request(app).get('/students');
      expect(res.body.length).toBe(5); // On en a mis 5 de base !
    });

    it('3. GET /students/:id valide doit renvoyer letudiant correspondant', async () => {
      const res = await request(app).get('/students/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it('4. GET /students/:id inexistant doit renvoyer 404', async () => {
      const res = await request(app).get('/students/999');
      expect(res.statusCode).toBe(404);
    });

    it('5. GET /students/:id invalide (ex: abc) doit renvoyer 400', async () => {
      const res = await request(app).get('/students/abc');
      expect(res.statusCode).toBe(400);
    });
  });

});
