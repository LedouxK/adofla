# Tests Backend (AdonisJS)

Ce document présente la stratégie de tests pour la partie backend de notre application AdonisJS. Il détaille en détail la configuration, la structure des tests, les types de tests réalisés ainsi que les pratiques recommandées pour garantir la qualité, la performance et la sécurité de notre système.

---

## 📚 Vue d'Ensemble

Les tests backend couvrent l'ensemble des aspects critiques de notre système, notamment :

- **Tests Unitaires** : Vérification isolée des controllers, services, models, validateurs et middleware.
- **Tests d'Intégration** : Validation des routes API, des flux de données et des interactions avec la base de données ainsi que les services externes.
- **Tests de Performance** : Simulation de charge et de stress pour mesurer les temps de réponse et l'efficacité du système.
- **Tests de Sécurité** : Vérification de la résistance du système aux attaques courantes (injections, faille d'authentification, etc.).

---

## 🎯 Structure du Backend

Voici l'organisation du code backend et de la suite de tests :

```
backend/
├── app/
│   ├── Controllers/
│   │   └── Http/
│   │       ├── AuthController.ts
│   │       └── SubscriptionController.ts
│   ├── Models/
│   │   ├── User.ts
│   │   └── Subscription.ts
│   ├── Services/
│   │   ├── PaymentService.ts
│   │   └── EmailService.ts
│   └── Middleware/
│       └── Auth.ts
├── tests/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   ├── integration/
│   │   ├── api/
│   │   └── flows/
│   └── performance/
│       └── scenarios/
└── config/
```

---

## 🛠️ Configuration des Tests

### Installation

Installez les dépendances nécessaires pour les tests backend :

```bash
npm i -D @japa/runner @japa/spec-reporter @japa/api-client
npm i -D @types/supertest supertest
npm i -D artillery
```

### Configuration Japa

Créez un fichier de bootstrap (par exemple `tests/bootstrap.ts`) pour initialiser Japa avec le reporter, l'API client et les setups nécessaires :

```typescript
// tests/bootstrap.ts
import { configure, processCliArgs, run } from '@japa/runner'
import { specReporter } from '@japa/spec-reporter'
import { apiClient } from '@japa/api-client'

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [
    specReporter(),
    apiClient('http://localhost:3333')
  ],
  setup: [
    async () => {
      // Initialisation de l'environnement et de la base de données
      await require('../start/env')
      await require('../start/database')
    }
  ]
})

run()
```

---

## 📊 Types de Tests

### Tests Unitaires
- **Controllers** : AuthController, SubscriptionController, etc.
- **Services** : PaymentService, EmailService.
- **Models** : User, Subscription.
- **Validators & Middleware** : Vérification des règles de validation et des contrôles d'accès.

*Voir le détail dans [Tests Unitaires](./03_Backend/03_1_Unitaires.md).*

### Tests d'Intégration
- **Routes API** : Inscription, login, gestion des abonnements, etc.
- **Flux Complets** : Simulation de parcours utilisateur du début à la fin.
- **Interactions avec la Base de Données** : Exécution des migrations et vérification des seeds.
- **Intégrations Externes** : Connexion aux services tiers (Stripe, Email, etc.).

*Voir le détail dans [Tests d'Intégration](./03_Backend/03_2_Integration.md).*

### Tests de Performance
- **Charge et Stress** : Simulation de haute intensité de requêtes et test d'endurance.
- **Benchmarks** : Mesure des temps de réponse et analyse des ressources utilisées.

*Voir le détail dans [Tests de Performance](./03_Backend/03_3_Performance.md).*

### Tests de Sécurité
- **Authentification & Autorisation** : Tests de robustesse des tokens, gestion des sessions et protection contre les attaques.
- **Vulnérabilités d'Injection** : SQL, NoSQL et XSS.
- **Validation des Données** : Assainissement et vérification des entrées.

*Voir le détail dans [Tests de Sécurité](./03_Backend/03_4_Securite.md).*

---

## 🎯 Composants Critiques

Les zones sensibles à couvrir incluent :

### Authentification
- Processus de login et d'inscription
- Gestion et validation des tokens JWT
- Récupération et réinitialisation du mot de passe

### Gestion des Abonnements
- Création et suivi des abonnements
- Intégration avec Stripe et gestion des paiements

### Administration
- Gestion des utilisateurs et des abonnements
- Tableaux de bord et rapports statistiques

---

## 📈 Métriques de Couverture

### Objectifs de Couverture
- **Controllers** : 100%
- **Services** : 100%
- **Models** : 95%
- **Middleware** : 100%

### Suivi
Exemple de scripts dans `package.json` :
```json
{
  "scripts": {
    "test": "node ace test",
    "test:coverage": "node ace test --coverage",
    "test:perf": "artillery run tests/performance/scenarios.yml"
  }
}
```

---

## 🔄 Workflow de Test

1. **Développement Local**
   ```bash
   npm run test:watch
   ```
2. **Avant Commit**
   ```bash
   npm run test
   npm run test:coverage
   ```
3. **Intégration Continue**
   ```bash
   npm run test:ci
   ```

---

## 📝 Bonnes Pratiques

### Organisation des Tests
Structurez vos tests dans des dossiers clairs pour faciliter leur maintenance :
```
tests/
├── unit/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middleware/
├── integration/
│   ├── api/
│   └── flows/
└── performance/
    └── scenarios/
```

### Nommage des Tests
Utilisez des descriptions explicites pour chaque cas de test :
```typescript
test.group('AuthController', () => {
  test('devrait authentifier un utilisateur valide', async ({ assert }) => {
    // ...
  })
})
```

### Utilisation d'Attributs de Test
Facilitez la sélection d'éléments dans vos tests (ex. via Supertest ou Japa) en utilisant des en-têtes ou des attributs spécifiques :
```typescript
const response = await supertest(BASE_URL)
  .get('/api/users')
  .set('x-test-id', 'list-users')
```

---

## 🔍 Navigation Détaillée

Pour plus de détails sur chaque catégorie de tests, consultez les documents suivants :
- [Tests Unitaires](./03_Backend/03_1_Unitaires.md)
  - Configuration, exemples et meilleures pratiques
- [Tests d'Intégration](./03_Backend/03_2_Integration.md)
  - Setup, cas d'utilisation et patterns
- [Tests de Performance](./03_Backend/03_3_Performance.md)
  - Configuration Artillery, scénarios et analyse des résultats
- [Tests de Sécurité](./03_Backend/03_4_Securite.md)
  - Authentification, autorisation et protection des données

---

Ce résumé offre une vision globale et structurée du plan de tests pour le backend. Il sert de référence pour garantir la qualité, la performance et la sécurité du système, tout en facilitant la maintenance et l'évolution continue de l'infrastructure de tests. 