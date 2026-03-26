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
      // --- POST TESTS ---
  describe('Tests POST /students', () => {
    it('6. POST avec données valides', async () => {
      const newStudent = { firstName: "John", lastName: "Doe", email: "john@test.com", grade: 20, field: "informatique" };
      const res = await request(app).post('/students').send(newStudent);
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeGreaterThan(0);
    });

    it('7. POST sans champ obligatoire doit renvoyer 400', async () => {
      const invalidStudent = { firstName: "John" }; 
      const res = await request(app).post('/students').send(invalidStudent);
      expect(res.statusCode).toBe(400);
    });

    it('8. POST avec note invalide doit renvoyer 400', async () => {
      const newStudent = { firstName: "John", lastName: "Doe", email: "j@test.com", grade: 25, field: "informatique" };
      const res = await request(app).post('/students').send(newStudent);
      expect(res.statusCode).toBe(400);
    });

    it('9. POST avec email existant renvoie 409', async () => {
      // Alice existe déjà avec 'alice@example.com' !
      const duplicateStudent = { firstName: "Copy", lastName: "Cat", email: "alice@example.com", grade: 15, field: "informatique" };
      const res = await request(app).post('/students').send(duplicateStudent);
      expect(res.statusCode).toBe(409);
    });
  });

  // --- PUT TESTS ---
  describe('Tests PUT /students/:id', () => {
    it('10. PUT valide renvoie 200', async () => {
      const modif = { firstName: "AliceModif", lastName: "Dupont", email: "alice@example.com", grade: 20, field: "physique" };
      const res = await request(app).put('/students/1').send(modif);
      expect(res.statusCode).toBe(200);
      expect(res.body.firstName).toBe("AliceModif");
    });

    it('11. PUT inexistant renvoie 404', async () => {
      const modif = { firstName: "Phantom", lastName: "Ghost", email: "p@ex.com", grade: 10, field: "chimie" };
      const res = await request(app).put('/students/999').send(modif);
      expect(res.statusCode).toBe(404);
    });
  });

  // --- DELETE TESTS ---
  describe('Tests DELETE /students/:id', () => {
    it('12. DELETE valide renvoie 200', async () => {
      const res = await request(app).delete('/students/1');
      expect(res.statusCode).toBe(200);
    });

    it('13. DELETE inexistant renvoie 404', async () => {
      const res = await request(app).delete('/students/999');
      expect(res.statusCode).toBe(404);
    });
  });

  // --- STATS & SEARCH ---
  describe('Tests GET Stats & Search', () => {
    it('14. GET /stats', async () => {
      const res = await request(app).get('/students/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalStudents');
    });

    it('15. GET /search?q=alice', async () => {
      const res = await request(app).get('/students/search?q=alice');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  });

});
