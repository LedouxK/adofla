# Tests Unitaires Frontend

Ce document décrit la stratégie et les exemples de tests unitaires pour le frontend de l'application. Nous nous concentrons sur les tests isolés des composants, des stores et des utilitaires en utilisant :
- **@vue/test-utils** : pour monter et interagir avec les composants Vue
- **Vitest** : framework de test rapide et léger
- **jsdom** : pour simuler un environnement DOM en Node.js

## Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Tests des Composants](#tests-des-composants)
  - [Composants d'Authentification](#composants-dauthentification)
  - [Composants d'Abonnement](#composants-dabonnement)
- [Tests des Stores (Pinia)](#tests-des-stores-pinia)
- [Tests des Utilitaires](#tests-des-utilitaires)
- [Mocks et Stubs](#mocks-et-stubs)
- [Couverture de Code](#couverture-de-code)
- [Bonnes Pratiques](#bonnes-pratiques)

## Vue d'Ensemble

Les tests unitaires du frontend permettent de :
- Vérifier l'initialisation et le comportement de chaque composant
- Tester les interactions utilisateur et la gestion d'état dans les stores
- Valider les fonctions utilitaires (validation, formatage, etc.)

## Tests des Composants

### Composants d'Authentification

#### LoginForm

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import LoginForm from '@/components/LoginForm.vue'

describe('LoginForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LoginForm)
  })

  it('initialise avec des valeurs par défaut', () => {
    expect(wrapper.vm.email).toBe('')
    expect(wrapper.vm.password).toBe('')
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.errors).toEqual({})
  })

  it('valide le format de l\'email', async () => {
    const emailInput = wrapper.find('[data-testid="email-input"]')
    
    // Test avec un email invalide
    await emailInput.setValue('email-invalide')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('.error-message').text()).toContain('email invalide')

    // Test avec un email valide
    await emailInput.setValue('test@example.com')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('désactive le bouton pendant le chargement', async () => {
    await wrapper.setData({ isLoading: true })
    expect(wrapper.find('[data-testid="submit-button"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })
})
```

#### ChangePassword

```typescript
describe('ChangePassword', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ChangePassword)
  })

  it('vérifie la force du mot de passe en temps réel', async () => {
    const passwordInput = wrapper.find('#new-password')
    
    // Mot de passe faible
    await passwordInput.setValue('weak')
    expect(wrapper.find('.password-strength').text()).toContain('faible')
    
    // Mot de passe fort
    await passwordInput.setValue('StrongP@ssw0rd123!')
    expect(wrapper.find('.password-strength').text()).toContain('fort')
  })

  it('vérifie la correspondance des mots de passe', async () => {
    const newPassword = 'StrongP@ssw0rd123!'
    await wrapper.find('#new-password').setValue(newPassword)
    await wrapper.find('#confirm-password').setValue('DifferentPass123!')
    expect(wrapper.find('.error-message').text()).toContain('Les mots de passe ne correspondent pas')
  })
})
```

### Composants d'Abonnement

#### SubscriptionPlan

```typescript
describe('SubscriptionPlan', () => {
  it('affiche correctement les détails du plan', () => {
    const plan = {
      name: 'Pro',
      price: 29.99,
      features: ['Feature 1', 'Feature 2']
    }
    
    const wrapper = mount(SubscriptionPlan, {
      props: { plan }
    })
    
    expect(wrapper.find('.plan-name').text()).toBe('Pro')
    expect(wrapper.find('.plan-price').text()).toContain('29,99')
    expect(wrapper.findAll('.feature')).toHaveLength(2)
  })
})
```

## Tests des Stores (Pinia)

### AuthStore

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('gère le login avec succès', async () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    }
    
    await store.login({
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual(mockUser)
  })
})
```

## Tests des Utilitaires

### Validateurs

```typescript
import { validateEmail, validatePassword } from '@/utils/validators'

describe('Validators', () => {
  describe('validateEmail', () => {
    const validEmails = [
      'test@example.com',
      'user.name+tag@domain.com'
    ]
    
    validEmails.forEach(email => {
      it(`valide l'email correct : ${email}`, () => {
        expect(validateEmail(email)).toBe(true)
      })
    })
  })
})
```

## Mocks et Stubs

### API Mocks

```typescript
import { vi } from 'vitest'

const mockApi = {
  login: vi.fn(),
  getUser: vi.fn()
}

vi.mock('@/api', () => ({
  default: mockApi
}))

describe('API Mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mock une réponse API réussie', async () => {
    mockApi.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, name: 'Test' }
    })
    
    const response = await mockApi.login({
      email: 'test@example.com',
      password: 'password'
    })
    
    expect(response.token).toBeDefined()
  })
})
```

## Couverture de Code

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
})
```

## Bonnes Pratiques

1. **Organisation des Tests**
   ```typescript
   describe('ComponentName', () => {
     beforeEach(() => {
       // Réinitialisation
       localStorage.clear()
       vi.clearAllMocks()
     })

     describe('initialisation', () => {
       // Tests d'initialisation
     })
     
     describe('interactions utilisateur', () => {
       // Tests d'interactions
     })
   })
   ```

2. **Nommage des Tests**
   ```typescript
   // ❌ Mauvais
   it('test1', () => {})

   // ✅ Bon
   it('devrait afficher un message d\'erreur quand l\'email est invalide', () => {})
   ```

3. **Isolation et Nettoyage**
   - Nettoyer l'environnement entre les tests
   - Éviter les dépendances entre les tests
   - Utiliser `beforeEach` et `afterEach` pour la configuration 