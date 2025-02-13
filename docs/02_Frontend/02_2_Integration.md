# Tests d'Intégration Frontend

Ce document décrit la stratégie et les exemples de tests d'intégration pour le frontend. Ces tests vérifient que :

- Les composants communiquent correctement entre eux
- Les stores et les composants interagissent correctement
- Les flux de données et les navigations respectent la logique de l'application
- Les intégrations avec les API externes se comportent comme attendu

## Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Flux Utilisateur](#flux-utilisateur)
  - [1. Authentification Complète](#1-authentification-complète)
  - [2. Gestion des Abonnements](#2-gestion-des-abonnements)
- [Navigation et Routes](#navigation-et-routes)
- [Stores et Composants](#stores-et-composants)
- [API et Composants](#api-et-composants)
- [Tests de Performance](#tests-de-performance)
- [Bonnes Pratiques](#bonnes-pratiques)

## Vue d'Ensemble

Les tests d'intégration frontend permettent de simuler des flux utilisateurs réels et de vérifier l'interaction entre plusieurs parties de l'application, telles que :
- L'authentification et la persistance de la session
- La navigation entre pages protégées
- La synchronisation entre le store et l'UI
- L'intégration avec les API externes (mockées via MSW)
- La performance globale des composants lors du rendu

## Flux Utilisateur

### 1. Authentification Complète

```typescript
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/login.vue'
import DashboardPage from '@/pages/index.vue'

describe('Flux d\'authentification', () => {
  it('gère le processus de login complet', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    const store = useAuthStore()
    
    // Simulation login
    await wrapper.find('[data-testid="email-input"]')
      .setValue('test@test.com')
    await wrapper.find('[data-testid="password-input"]')
      .setValue('Password123!')
    await wrapper.find('form').trigger('submit')
    
    // Vérifications
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toBeDefined()
    expect(wrapper.emitted('redirect')).toBeTruthy()
  })

  it('maintient la session après rafraîchissement', async () => {
    const store = useAuthStore()
    store.token = 'valid-token'
    
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            auth: { token: 'valid-token' }
          }
        })]
      }
    })
    
    await store.checkAuth()
    expect(store.isAuthenticated).toBe(true)
    expect(wrapper.find('.user-info').exists()).toBe(true)
  })
})
```

### 2. Gestion des Abonnements

```typescript
describe('Flux d\'abonnement', () => {
  it('complète le processus d\'abonnement', async () => {
    const wrapper = mount(SubscriptionFlow, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    const store = useSubscriptionStore()
    
    // Sélection du plan
    await wrapper.find('[data-testid="plan-pro"]').trigger('click')
    expect(store.selectedPlan).toBe('pro')
    
    // Saisie des informations de paiement
    await wrapper.find('[data-testid="card-number"]')
      .setValue('4242424242424242')
    await wrapper.find('[data-testid="card-expiry"]')
      .setValue('1225')
    await wrapper.find('[data-testid="card-cvc"]')
      .setValue('123')
    
    // Soumission
    await wrapper.find('form').trigger('submit')
    expect(store.subscriptionStatus).toBe('active')
    expect(wrapper.find('.success-message').exists()).toBe(true)
  })
})
```

## Navigation et Routes

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

describe('Navigation', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  it('gère la navigation protégée', async () => {
    const store = useAuthStore()
    store.isAuthenticated = false
    
    await router.push('/dashboard')
    expect(router.currentRoute.value.path).toBe('/login')
    
    store.isAuthenticated = true
    await router.push('/dashboard')
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('conserve l\'historique de navigation', async () => {
    await router.push('/profile')
    await router.push('/settings')
    await router.back()
    
    expect(router.currentRoute.value.path).toBe('/profile')
  })
})
```

## Stores et Composants

```typescript
describe('Intégration Store-Composant', () => {
  it('synchronise l\'état du store avec l\'UI', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    const store = useUserStore()
    
    // Mise à jour du store
    await store.updateProfile({
      name: 'John Doe',
      email: 'john@example.com'
    })
    
    // Vérification de l'UI
    expect(wrapper.find('.user-name').text()).toBe('John Doe')
    expect(wrapper.find('.user-email').text()).toBe('john@example.com')
  })

  it('propage les mises à jour de l\'UI au store', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    const store = useUserStore()
    
    // Modification via l'UI
    await wrapper.find('[data-testid="name-input"]')
      .setValue('Jane Doe')
    await wrapper.find('form').trigger('submit')
    
    // Vérification du store
    expect(store.user.name).toBe('Jane Doe')
  })
})
```

## API et Composants

```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      })
    )
  })
)

describe('Intégration API', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('gère les réponses API dans les composants', async () => {
    const wrapper = mount(LoginForm)
    
    await wrapper.find('form').trigger('submit')
    
    await flushPromises()
    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.find('.error').exists()).toBe(false)
  })

  it('gère les erreurs API', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401))
      })
    )
    
    const wrapper = mount(LoginForm)
    await wrapper.find('form').trigger('submit')
    
    await flushPromises()
    expect(wrapper.find('.error').exists()).toBe(true)
  })
})
```

## Tests de Performance

```typescript
import { performance } from 'perf_hooks'

describe('Performance des Composants', () => {
  it('charge la liste des utilisateurs rapidement', async () => {
    const start = performance.now()
    
    const wrapper = mount(UserList, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    await flushPromises()
    
    const duration = performance.now() - start
    expect(duration).toBeLessThan(100) // 100ms max
    expect(wrapper.findAll('.user-item')).toHaveLength(50)
  })
})
```

## Bonnes Pratiques

### 1. Setup des Tests

```typescript
import { config } from '@vue/test-utils'

// Configuration globale
config.global.mocks = {
  $t: (key: string) => key,
  $router: {
    push: vi.fn()
  }
}

// Helper de test
function createWrapper(component, options = {}) {
  return mount(component, {
    global: {
      plugins: [createTestingPinia()],
      ...options
    }
  })
}
```

### 2. Nettoyage

```typescript
describe('Component Test', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper(Component)
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
```

### 3. Assertions Communes

```typescript
expect(wrapper.emitted()).toHaveProperty('event-name')
expect(wrapper.find('.error').exists()).toBe(false)
expect(store.state.value).toBe(expected)
``` 