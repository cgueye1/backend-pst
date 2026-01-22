# Guide des Tests Unitaires - Backend

## Installation

```bash
cd backend
npm install
```

## Exécution des Tests

### Tous les tests
```bash
npm test
```

### Tests en mode watch (développement)
```bash
npm run test:watch
```

### Tests avec couverture de code
```bash
npm run test:coverage
```

## Structure des Tests

Les tests sont organisés dans le dossier `__tests__/` :

```
backend/
├── __tests__/
│   ├── api/
│   │   ├── users/
│   │   │   └── route.test.ts
│   │   ├── drivers/
│   │   │   └── subscription/
│   │   │       └── alertes.test.ts
│   │   └── parents/
│   │       └── alertes.test.ts
│   ├── services/
│   │   ├── userServices.test.ts
│   │   └── notificationService.test.ts
│   └── lib/
│       └── validation.test.ts
```

## Tests Disponibles

### Services
- ✅ `userServices.test.ts` - Tests pour la création, lecture, mise à jour et suppression d'utilisateurs
- ✅ `notificationService.test.ts` - Tests pour l'envoi de notifications aux admins

### API Routes
- ✅ `users/route.test.ts` - Tests pour GET et POST /api/users
- ✅ `drivers/subscription/alertes.test.ts` - Tests pour le CRON d'alertes d'abonnements
- ✅ `parents/alertes.test.ts` - Tests pour le CRON de rappels de trajets

### Utilitaires
- ✅ `validation.test.ts` - Tests pour la validation Zod

## Configuration Jest

La configuration Jest se trouve dans `jest.config.js` :
- Environnement : Node.js
- Preset : ts-jest
- Coverage : 60% minimum requis

## Mocking

Les tests utilisent des mocks pour :
- Base de données (`lib/db`)
- Services externes (bcrypt, nodemailer, twilio)
- Authentification (`lib/auth`)

## Exemple de Test

```typescript
describe('createUser', () => {
  it('should create a user with default password', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'driver'
    };

    mockBcryptHash.mockResolvedValue('hashed_password');
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, ...userData }]
    });

    const result = await createUser(userData);

    expect(result).toHaveProperty('id', 1);
  });
});
```

## Bonnes Pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Mocking** : Mocker toutes les dépendances externes
3. **Nettoyage** : Utiliser `beforeEach` pour réinitialiser les mocks
4. **Assertions** : Vérifier à la fois le succès et les cas d'erreur
5. **Coverage** : Viser au moins 60% de couverture de code

## Ajouter de Nouveaux Tests

1. Créer un fichier `*.test.ts` dans `__tests__/`
2. Importer les fonctions à tester
3. Mocker les dépendances avec `jest.mock()`
4. Écrire les tests avec `describe()` et `it()`
5. Exécuter `npm test` pour vérifier

## Dépannage

### Erreur "Cannot find module"
- Vérifier que les chemins d'import sont corrects
- Utiliser `@/` pour les imports relatifs au root

### Erreur "Timeout"
- Augmenter `testTimeout` dans `jest.config.js`
- Vérifier que les mocks sont correctement configurés

### Tests qui échouent
- Vérifier les mocks avec `console.log(mockQuery.mock.calls)`
- S'assurer que les données mockées correspondent au format attendu

