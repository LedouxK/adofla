# Plan de Tests Complet avec Exemples

## 🎯 Frontend (Nuxt.js)

### 1. Tests Unitaires des Composants
**Outils**: `@vue/test-utils` + `vitest`

#### Navigation et Layout
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Navigation from '@/components/Navigation.vue'

describe('Navigation', () => {
  it('affiche tous les liens requis', () => {
    const wrapper = mount(Navigation)
    expect(wrapper.find('a[href="/accueil"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/profil"]').exists()).toBe(true)
  })

  it('met en surbrillance le lien actif', () => {
    const wrapper = mount(Navigation, {
      global: {
        mocks: {
          $route: { path: '/accueil' }
        }
      }
    })
    expect(wrapper.find('a[href="/accueil"].active').exists()).toBe(true)
  })
})
```

#### Formulaires et Authentification
```typescript
describe('Login Page', () => {
  it('affiche les messages d\'erreur appropriés', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('input[type="email"]').setValue('email.invalide')
    await wrapper.find('button[type="submit"]').click()
    expect(wrapper.find('.error-message').text()).toBe('Email invalide')
  })
  
  it('gère la soumission réussie', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('button[type="submit"]').click()
    // Vérifier la redirection et la mise à jour du store
  })
})
```

#### Composant de Changement de Mot de Passe
```typescript
describe('ChangePassword Component', () => {
  it('valide la correspondance des mots de passe', async () => {
    const wrapper = mount(ChangePassword)
    await wrapper.find('#new-password').setValue('newPass123')
    await wrapper.find('#confirm-password').setValue('differentPass')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('.error-message').text()).toContain('Les mots de passe ne correspondent pas')
  })

  it('vérifie la force du mot de passe', async () => {
    const wrapper = mount(ChangePassword)
    await wrapper.find('#new-password').setValue('weak')
    expect(wrapper.find('.password-strength').text()).toContain('Mot de passe trop faible')
  })
})
```

#### Composant d'Abonnements
```typescript
describe('Subscriptions Component', () => {
  it('affiche correctement les plans', () => {
    const wrapper = mount(SubscriptionsAbout)
    const plans = wrapper.findAll('.subscription-plan')
    expect(plans).toHaveLength(3) // Basic, Pro, Enterprise
    expect(plans[0].find('.price').text()).toContain('€')
  })

  it('gère le processus de paiement', async () => {
    const wrapper = mount(SubscriptionsAbout)
    await wrapper.find('.select-plan-button').trigger('click')
    expect(wrapper.emitted('plan-selected')).toBeTruthy()
  })
})
```

### 2. Tests du Store (Pinia)

#### Store d'Authentification
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('gère le login avec succès', async () => {
    const store = useAuthStore()
    await store.login({
      email: 'test@test.com',
      password: 'password123'
    })
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBeDefined()
  })

  it('gère la persistance de session', async () => {
    const store = useAuthStore()
    await store.checkAuth()
    expect(store.isAuthenticated).toBe(true)
  })
})
```

#### Store Administrateur
```typescript
describe('Admin Store', () => {
  it('charge les statistiques', async () => {
    const store = useAdminStore()
    await store.loadStats()
    expect(store.stats.totalUsers).toBeGreaterThan(0)
    expect(store.stats.activeSubscriptions).toBeDefined()
  })

  it('gère la pagination des utilisateurs', async () => {
    const store = useAdminStore()
    await store.loadUsers({ page: 1, perPage: 10 })
    expect(store.users.length).toBeLessThanOrEqual(10)
    expect(store.totalPages).toBeDefined()
  })
})
```

## 🔒 Backend (AdonisJS)

### 1. Tests des Contrôleurs

#### AuthController
```typescript
import { test } from '@japa/runner'

test.group('AuthController', () => {
  test('login retourne un token valide', async ({ client }) => {
    const response = await client
      .post('/api/auth/login')
      .json({
        email: 'test@test.com',
        password: 'password123'
      })
    
    response.assertStatus(200)
    response.assertBodyContains({ token: response.body().token })
  })

  test('reset password flow complet', async ({ client }) => {
    // Demande de réinitialisation
    const resetResponse = await client
      .post('/api/auth/forgot-password')
      .json({ email: 'test@test.com' })
    resetResponse.assertStatus(200)

    // Vérification du token et changement du mot de passe
    const token = await Database.from('password_resets').first()
    const changeResponse = await client
      .post('/api/auth/reset-password')
      .json({
        token: token.token,
        password: 'newPassword123',
        password_confirmation: 'newPassword123'
      })
    changeResponse.assertStatus(200)
  })
})
```

#### AdminController
```typescript
test.group('AdminController', () => {
  test('liste des utilisateurs avec pagination', async ({ client }) => {
    const response = await client
      .get('/api/admin/users')
      .query({ page: 1, perPage: 10 })
      .loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains({
      data: response.body().data,
      meta: {
        total: response.body().meta.total,
        per_page: 10,
        current_page: 1
      }
    })
  })

  test('statistiques globales', async ({ client }) => {
    const response = await client
      .get('/api/admin/statistics')
      .loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains({
      total_users: response.body().total_users,
      active_subscriptions: response.body().active_subscriptions,
      monthly_revenue: response.body().monthly_revenue
    })
  })
})
```

### 2. Tests de Base de Données

```typescript
test.group('Database Tests', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('création et relations utilisateur', async ({ assert }) => {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password123'
    })

    const subscription = await Subscription.create({
      user_id: user.id,
      plan: 'pro',
      status: 'active'
    })

    await user.load('subscription')
    assert.equal(user.subscription.plan, 'pro')
  })
})
```

### 3. Tests de Middleware

```typescript
test.group('Middleware Tests', () => {
  test('auth middleware bloque les requêtes non authentifiées', async ({ client }) => {
    const response = await client.get('/api/protected-route')
    response.assertStatus(401)
  })

  test('admin middleware vérifie les permissions', async ({ client }) => {
    const response = await client
      .get('/api/admin/users')
      .loginAs(regularUser)
    response.assertStatus(403)
  })

  test('rate limiting', async ({ client }) => {
    for (let i = 0; i < 60; i++) {
      await client.post('/api/auth/login')
    }
    const response = await client.post('/api/auth/login')
    response.assertStatus(429)
  })
})
```

## 📱 Tests E2E (Cypress)

```typescript
describe('Parcours Utilisateur Complet', () => {
  it('inscription et utilisation', () => {
    // Inscription
    cy.visit('/register')
    cy.get('[data-test="email"]').type('nouveau@test.com')
    cy.get('[data-test="password"]').type('Password123!')
    cy.get('[data-test="submit"]').click()

    // Vérification de l'email
    cy.get('.verification-notice').should('be.visible')

    // Choix d'un abonnement
    cy.visit('/subscriptions')
    cy.get('[data-test="plan-pro"]').click()
    cy.get('[data-test="card-number"]').type('4242424242424242')
    cy.get('[data-test="card-expiry"]').type('1225')
    cy.get('[data-test="card-cvc"]').type('123')
    cy.get('[data-test="submit-payment"]').click()

    // Vérification du succès
    cy.url().should('include', '/dashboard')
    cy.get('.subscription-status').should('contain', 'Pro')
  })
})
```

## 🚀 Tests de Performance

```yaml
# artillery.yml
config:
  target: "http://localhost:3333"
  phases:
    - duration: 60
      arrivalRate: 20
      rampTo: 100
    - duration: 300
      arrivalRate: 100
  plugins:
    metrics-by-endpoint: {}

scenarios:
  - name: "Charge utilisateur standard"
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/categories"
      - think: 1
      - post:
          url: "/api/auth/login"
          json:
            email: "test@test.com"
            password: "password123"

  - name: "Charge administrative"
    weight: 20
    flow:
      - get:
          url: "/api/admin/statistics"
      - think: 1
      - get:
          url: "/api/admin/users"
```

## 🔐 Tests de Sécurité

```typescript
test.group('Security Tests', () => {
  test('protection XSS', async ({ client }) => {
    const response = await client
      .post('/api/users')
      .json({
        name: '<script>alert("xss")</script>',
        email: 'test@test.com'
      })
    
    const user = await User.last()
    assert.notEqual(user.name, '<script>alert("xss")</script>')
  })

  test('protection CSRF', async ({ client }) => {
    const response = await client
      .post('/api/users')
      .header('X-CSRF-TOKEN', 'invalid-token')
    
    response.assertStatus(419)
  })

  test('validation upload de fichiers', async ({ client }) => {
    const response = await client
      .post('/api/upload')
      .file('avatar', Buffer.from('test'), {
        filename: 'malicious.php',
        contentType: 'application/x-php'
      })
    
    response.assertStatus(422)
  })
})
```

## 📊 Configuration CI/CD

```yaml
# .github/workflows/tests.yml
name: Tests Complets
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install Dependencies
        run: |
          npm ci
          npm run build

      - name: Run Linting
        run: npm run lint

      - name: Run Unit Tests
        run: npm run test:unit

      - name: Run E2E Tests
        run: npm run test:e2e
        env:
          CYPRESS_BASE_URL: http://localhost:3000

      - name: Run API Tests
        run: npm run test:api
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          JWT_SECRET: test_secret
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_KEY }}

      - name: Run Security Scans
        run: |
          npm run security:audit
          npm run test:security

      - name: Upload Coverage
        uses: codecov/codecov-action@v2
```

## 💡 Bonnes Pratiques

1. **Organisation des Tests**
```
tests/
├── e2e/
│   ├── specs/
│   │   ├── auth.spec.ts
│   │   ├── admin.spec.ts
│   │   └── subscription.spec.ts
│   └── support/
├── unit/
│   ├── components/
│   ├── stores/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── security/
```

2. **Scripts NPM**
```json
{
  "scripts": {
    "test": "npm-run-all test:*",
    "test:unit": "vitest run",
    "test:e2e": "cypress run",
    "test:api": "node ace test",
    "test:security": "npm audit && snyk test",
    "test:perf": "artillery run tests/performance/scenarios.yml",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

3. **Variables d'Environnement de Test**
```env
# .env.testing
NODE_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_VIEWS=false
SESSION_DRIVER=memory
STRIPE_SECRET_KEY=sk_test_...
``` 