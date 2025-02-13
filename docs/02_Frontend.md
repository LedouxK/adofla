# Tests Frontend (Nuxt.js)

Ce document détaille la stratégie de tests pour la partie frontend de notre application Nuxt.js. Il aborde les différents niveaux de tests qui nous permettront d'assurer la qualité et la stabilité de l'interface utilisateur.

---

## 📚 Vue d'Ensemble

La stratégie de tests frontend se décompose en trois catégories principales :

- **Tests Unitaires**  
  Vérification isolée de chaque composant, store et utilitaire.
  
- **Tests d'Intégration**  
  Validation des interactions entre composants, stores et flux de données.
  
- **Tests End-to-End (E2E)**  
  Simulation des parcours utilisateur réels pour garantir une expérience cohérente et fiable.

---

## 🎯 Structure du Projet Frontend

Voici un aperçu de l'arborescence du code frontend :

```
f_end/
├── components/
│   ├── changePassword.vue
│   └── subscriptionsAbout.vue
├── pages/
│   ├── admin/
│   │   ├── userUpdate.vue
│   │   ├── userSubscription.vue
│   │   ├── subscription.vue
│   │   └── index.vue
│   ├── admin.vue
│   ├── forgotPassword.vue
│   ├── reset-password.vue
│   ├── index.vue
│   ├── profile.vue
│   └── login.vue
├── stores/
└── utils/
```

Cette organisation permet de structurer clairement les tests en fonction des différents modules de l'application.

---

## 🛠️ Configuration des Tests

### Installation des Outils

Installez les dépendances nécessaires pour réaliser l'ensemble des tests :

```bash
npm install --save-dev @vue/test-utils vitest cypress @cypress/vue
```

### Configuration de Vitest

Le fichier de configuration pour Vitest (pour les tests unitaires et d'intégration) est le suivant :

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/'
      ]
    }
  }
})
```

### Configuration de Cypress

Pour les tests E2E, voici la configuration de base pour Cypress :

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts'
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})
```

---

## 📊 Types de Tests

- **[Tests Unitaires](./02_1_Unitaires.md)**  
  *Ciblent :* Les composants individuels, les stores Pinia et les utilitaires.
  
- **[Tests d'Intégration](./02_2_Integration.md)**  
  *Ciblent :* Les interactions entre composants, les flux de données et la navigation.
  
- **[Tests End-to-End](./02_3_E2E.md)**  
  *Ciblent :* L'ensemble des parcours utilisateur, le support multi-navigateurs et la vérification visuelle.

---

## 🎯 Composants Critiques

Voici quelques exemples de domaines critiques à tester :

### Authentification
- **Login**
- **Inscription**
- **Réinitialisation de mot de passe**

### Gestion des Abonnements
- **Visualisation des plans**
- **Processus de paiement**
- **Gestion des cartes de paiement**

### Administration
- **Gestion des utilisateurs**
- **Gestion des abonnements**
- **Tableaux de bord**

---

## 📈 Métriques de Couverture

### Objectifs
- **Composants** : 100%
- **Stores** : 100%
- **Utilitaires** : 95%
- **Parcours E2E** : Couverture de tous les flux critiques

### Suivi de la Couverture
Ajoutez ou modifiez les scripts suivants dans votre `package.json` pour générer des rapports de couverture :

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:report": "npx nyc report"
  }
}
```

---

## 🔄 Workflow de Test

### 1. En Développement Local
Utilisez la commande suivante pour lancer les tests unitaires en mode watch :
```bash
npm run test:unit -- --watch
```

### 2. Avant Chaque Commit
Assurez-vous d'exécuter :
```bash
npm run test:unit
npm run test:e2e
```

### 3. Intégration Continue (CI)
Le pipeline CI doit lancer l'ensemble des tests via :
```bash
npm run test:ci
```

---

## 📝 Bonnes Pratiques

### Nommage des Tests
Utilisez des descriptions claires pour chaque cas de test :
```typescript
describe('LoginForm', () => {
  it('devrait afficher une erreur pour un email invalide', () => {
    // ...
  })
})
```

### Organisation des Fichiers de Tests
Organisez vos fichiers de tests comme suit pour une meilleure maintenabilité :
```
tests/
├── components/
│   └── __tests__/
│       └── LoginForm.spec.ts
├── stores/
│   └── __tests__/
│       └── auth.spec.ts
└── e2e/
    └── specs/
        └── login.cy.ts
```

### Utilisation de Data-testid
Assurez-vous d'inclure des attributs `data-testid` dans vos composants pour faciliter la sélection dans vos tests :
```vue
<template>
  <button data-testid="submit-button">
    Submit
  </button>
</template>
```

---

## 🔍 Navigation Détaillée

Pour plus de détails sur chaque type de test, consultez les documents suivants :
- [Tests Unitaires](./02_1_Unitaires.md)
  - Configuration
  - Exemples
  - Meilleures pratiques
- [Tests d'Intégration](./02_2_Integration.md)
  - Setup
  - Cas d'utilisation
  - Patterns
- [Tests End-to-End](./02_3_E2E.md)
  - Configuration Cypress
  - Scénarios de test
  - Intégration CI/CD

---

Ce résumé présente de manière synthétique la stratégie de tests pour le frontend. Il sert de référence pour l'équipe, facilitant la compréhension des objectifs, de l'organisation et des outils utilisés. N'hésitez pas à adapter et enrichir ce document au fil de l'évolution du projet. 