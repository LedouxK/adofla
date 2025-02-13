# Tests Unitaires Backend

Ce document décrit la stratégie, la configuration et des exemples de tests unitaires pour le backend de l'application.  
Les tests se concentrent sur le comportement isolé de chaque composant du système, notamment :
- **Controllers**
- **Services**
- **Models**
- **Validators**
- **Middleware**

## Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Configuration](#configuration)
  - [Installation](#installation)
  - [Configuration Japa](#configuration-japa)
- [Tests des Controllers](#tests-des-controllers)
  - [AuthController](#authcontroller)
  - [SubscriptionController](#subscriptioncontroller)
  - [UserController](#usercontroller)
- [Tests des Services](#tests-des-services)
  - [PaymentService](#paymentservice)
  - [EmailService](#emailservice)
  - [NotificationService](#notificationservice)
- [Tests des Models](#tests-des-models)
  - [User Model](#user-model)
  - [Subscription Model](#subscription-model)
  - [Payment Model](#payment-model)
- [Tests des Validators](#tests-des-validators)
  - [UserValidator](#uservalidator)
  - [SubscriptionValidator](#subscriptionvalidator)
- [Tests des Middleware](#tests-des-middleware)
  - [AuthMiddleware](#authmiddleware)
  - [RoleMiddleware](#rolemiddleware)
- [Bonnes Pratiques](#bonnes-pratiques)

## Vue d'Ensemble

Les tests unitaires backend permettent de :
- Vérifier le comportement isolé de chaque composant
- Garantir la fiabilité des fonctionnalités critiques
- Faciliter la maintenance et les refactorisations
- Documenter le comportement attendu du système

## Configuration

### Installation

```bash
# Installation des dépendances pour les tests unitaires
npm i -D @japa/runner @japa/spec-reporter @types/supertest supertest
npm i -D @japa/assert @japa/api-client
```

### Configuration Japa

```typescript
// tests/bootstrap.ts
import { configure, processCliArgs, run } from '@japa/runner'
import { specReporter } from '@japa/spec-reporter'
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'

configure({
  files: ['tests/unit/**/*.spec.ts'],
  plugins: [
    assert(),
    apiClient('http://localhost:3333')
  ],
  reporters: [specReporter()],
  setup: [
    async () => {
      await require('../start/env').default()
      await require('../start/database').default()
      
      process.env.NODE_ENV = 'testing'
      process.env.DB_CONNECTION = 'sqlite'
      process.env.DB_DATABASE = ':memory:'
    }
  ],
  teardown: [
    async () => {
      await Database.manager.closeAll()
    }
  ]
})

run()
```

## Tests des Controllers

### AuthController

```typescript
import { test } from '@japa/runner'
import AuthController from 'App/Controllers/Http/AuthController'
import { UserFactory } from 'Database/factories/UserFactory'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('AuthController', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('login avec succès', async ({ assert }) => {
    const user = await UserFactory.create()
    const controller = new AuthController()
    const ctx = HttpContextFactory.create()

    ctx.request.body = {
      email: user.email,
      password: 'password123'
    }

    const response = await controller.login(ctx)
    
    assert.exists(response.token)
    assert.equal(response.user.id, user.id)
    assert.notExists(response.user.password)
  })

  test('gestion des erreurs de login', async ({ assert }) => {
    const controller = new AuthController()
    const ctx = HttpContextFactory.create()

    ctx.request.body = {
      email: 'invalid@test.com',
      password: 'wrong'
    }

    try {
      await controller.login(ctx)
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.status, 401)
      assert.equal(error.message, 'Identifiants invalides')
    }
  })

  test('déconnexion utilisateur', async ({ assert }) => {
    const user = await UserFactory.create()
    const controller = new AuthController()
    const ctx = HttpContextFactory.create()
    
    ctx.auth = { user, logout: () => Promise.resolve() }
    
    const response = await controller.logout(ctx)
    assert.equal(response.status, 200)
  })
})
```

### SubscriptionController

```typescript
test.group('SubscriptionController', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('création d\'un abonnement', async ({ assert }) => {
    const user = await UserFactory.create()
    const controller = new SubscriptionController()
    const ctx = HttpContextFactory.create()

    ctx.request.body = {
      plan: 'pro',
      paymentMethodId: 'pm_card_visa',
      couponCode: 'WELCOME20'
    }
    ctx.auth.user = user

    const response = await controller.create(ctx)
    
    assert.equal(response.status, 'active')
    assert.equal(response.plan, 'pro')
    assert.exists(response.startDate)
    assert.exists(response.endDate)
  })

  test('annulation d\'abonnement avec période de grâce', async ({ assert }) => {
    const subscription = await SubscriptionFactory
      .with('user')
      .create()
    
    const controller = new SubscriptionController()
    const ctx = HttpContextFactory.create()
    ctx.auth.user = subscription.user

    const response = await controller.cancel(ctx)
    await subscription.refresh()
    
    assert.equal(subscription.status, 'cancelled')
    assert.exists(subscription.cancelledAt)
    assert.exists(subscription.gracePeriodEndDate)
  })

  test('changement de plan d\'abonnement', async ({ assert }) => {
    const subscription = await SubscriptionFactory
      .with('user')
      .create({ plan: 'basic' })
    
    const controller = new SubscriptionController()
    const ctx = HttpContextFactory.create()
    
    ctx.auth.user = subscription.user
    ctx.request.body = { plan: 'pro' }

    const response = await controller.changePlan(ctx)
    await subscription.refresh()
    
    assert.equal(subscription.plan, 'pro')
    assert.exists(subscription.planChangedAt)
  })
})
```

## Tests des Services

### PaymentService

```typescript
test.group('PaymentService', () => {
  test('création d\'un paiement avec succès', async ({ assert }) => {
    const service = new PaymentService()
    const mockStripe = new Stripe('fake-key')

    // Mock Stripe
    mockStripe.paymentIntents.create = async () => ({
      id: 'pi_123',
      client_secret: 'secret_123',
      status: 'succeeded',
      amount: 2999,
      currency: 'eur'
    })

    const result = await service.createPayment({
      amount: 2999,
      currency: 'eur',
      paymentMethodId: 'pm_card_visa',
      description: 'Abonnement Pro'
    })

    assert.equal(result.status, 'succeeded')
    assert.exists(result.client_secret)
    assert.equal(result.amount, 2999)
  })

  test('gestion des erreurs de paiement', async ({ assert }) => {
    const service = new PaymentService()
    
    try {
      await service.createPayment({
        amount: 2999,
        currency: 'eur',
        paymentMethodId: 'pm_card_declined'
      })
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.code, 'card_declined')
      assert.exists(error.message)
    }
  })

  test('remboursement d\'un paiement', async ({ assert }) => {
    const service = new PaymentService()
    const paymentId = 'pi_123'

    const result = await service.refundPayment(paymentId)
    
    assert.equal(result.status, 'succeeded')
    assert.exists(result.refundId)
  })
})
```

### EmailService

```typescript
test.group('EmailService', () => {
  test('envoi d\'email de bienvenue', async ({ assert }) => {
    const service = new EmailService()
    const user = await UserFactory.create()

    const result = await service.sendWelcomeEmail(user)
    
    assert.equal(result.status, 'sent')
    assert.equal(result.to, user.email)
    assert.include(result.html, user.name)
  })

  test('envoi d\'email de réinitialisation avec token', async ({ assert }) => {
    const service = new EmailService()
    const user = await UserFactory.create()
    const token = 'reset-token-123'

    const result = await service.sendPasswordReset(user, token)
    
    assert.equal(result.status, 'sent')
    assert.include(result.html, token)
    assert.include(result.html, user.name)
  })

  test('gestion des erreurs d\'envoi', async ({ assert }) => {
    const service = new EmailService()
    const user = await UserFactory.create()

    // Simuler une erreur SMTP
    service.mailer.sendMail = () => {
      throw new Error('SMTP Error')
    }

    try {
      await service.sendWelcomeEmail(user)
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.message, 'SMTP Error')
    }
  })
})
```

## Tests des Models

### User Model

```typescript
test.group('User Model', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('hashage automatique du mot de passe', async ({ assert }) => {
    const user = new User()
    user.password = 'password123'
    
    assert.notEqual(user.password, 'password123')
    assert.isTrue(await Hash.verify(user.password, 'password123'))
  })

  test('relations avec les abonnements', async ({ assert }) => {
    const user = await UserFactory
      .with('subscriptions', 2)
      .create()
    
    await user.load('subscriptions')
    
    assert.lengthOf(user.subscriptions, 2)
    assert.instanceOf(user.subscriptions[0], Subscription)
  })

  test('méthodes personnalisées', async ({ assert }) => {
    const user = await UserFactory.create()
    
    assert.isFalse(await user.hasActiveSubscription())
    
    await SubscriptionFactory.create({
      userId: user.id,
      status: 'active'
    })
    
    assert.isTrue(await user.hasActiveSubscription())
  })
})
```

### Subscription Model

```typescript
test.group('Subscription Model', () => {
  test('calcul de fin d\'abonnement', async ({ assert }) => {
    const subscription = await SubscriptionFactory.create()
    
    const endDate = subscription.calculateEndDate()
    const expectedDate = DateTime.now().plus({ months: 1 })
    
    assert.equal(
      endDate.toFormat('yyyy-MM-dd'),
      expectedDate.toFormat('yyyy-MM-dd')
    )
  })

  test('vérification de période d\'essai', async ({ assert }) => {
    const subscription = await SubscriptionFactory.create({
      trialEndsAt: DateTime.now().plus({ days: 7 })
    })
    
    assert.isTrue(subscription.isInTrial())
    assert.equal(subscription.trialDaysLeft(), 7)
  })

  test('calcul de prochain paiement', async ({ assert }) => {
    const subscription = await SubscriptionFactory.create({
      currentPeriodEndsAt: DateTime.now().plus({ days: 30 })
    })
    
    const nextPaymentDate = subscription.nextPaymentDate()
    assert.equal(
      nextPaymentDate.toFormat('yyyy-MM-dd'),
      DateTime.now().plus({ days: 30 }).toFormat('yyyy-MM-dd')
    )
  })
})
```

## Tests des Validators

### UserValidator

```typescript
test.group('UserValidator', () => {
  test('validation des données utilisateur valides', async ({ assert }) => {
    const validator = new UserValidator()
    
    const validData = {
      email: 'test@test.com',
      password: 'Password123!',
      name: 'John Doe',
      phone: '+33612345678'
    }
    
    const result = await validator.validate(validData)
    assert.isEmpty(result.errors)
  })

  test('validation des erreurs', async ({ assert }) => {
    const validator = new UserValidator()
    
    const invalidData = {
      email: 'invalid-email',
      password: '123', // trop court
      name: '',
      phone: 'not-a-phone'
    }
    
    const result = await validator.validate(invalidData)
    assert.isNotEmpty(result.errors)
    assert.property(result.errors, 'email')
    assert.property(result.errors, 'password')
    assert.property(result.errors, 'name')
    assert.property(result.errors, 'phone')
  })

  test('validation des règles personnalisées', async ({ assert }) => {
    const validator = new UserValidator()
    
    const data = {
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'different123'
    }
    
    const result = await validator.validate(data)
    assert.property(result.errors, 'passwordConfirmation')
  })
})
```

## Tests des Middleware

### AuthMiddleware

```typescript
test.group('AuthMiddleware', () => {
  test('autorise les requêtes authentifiées', async ({ assert }) => {
    const middleware = new AuthMiddleware()
    const ctx = HttpContextFactory.create()
    const user = await UserFactory.create()
    
    ctx.request.header('Authorization', `Bearer ${user.generateToken()}`)
    
    await middleware.handle(ctx, () => {})
    assert.equal(ctx.auth.user.id, user.id)
  })

  test('bloque les requêtes non authentifiées', async ({ assert }) => {
    const middleware = new AuthMiddleware()
    const ctx = HttpContextFactory.create()
    
    try {
      await middleware.handle(ctx, () => {})
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.status, 401)
    }
  })

  test('gère les tokens expirés', async ({ assert }) => {
    const middleware = new AuthMiddleware()
    const ctx = HttpContextFactory.create()
    const expiredToken = 'expired.token.here'
    
    ctx.request.header('Authorization', `Bearer ${expiredToken}`)
    
    try {
      await middleware.handle(ctx, () => {})
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.status, 401)
      assert.equal(error.message, 'Token expiré')
    }
  })
})
```

## Bonnes Pratiques

### 1. Organisation des Tests

```plaintext
tests/unit/
├── controllers/
│   ├── AuthController.spec.ts
│   └── SubscriptionController.spec.ts
├── services/
│   ├── PaymentService.spec.ts
│   └── EmailService.spec.ts
├── models/
│   ├── User.spec.ts
│   └── Subscription.spec.ts
├── validators/
│   └── UserValidator.spec.ts
└── middleware/
    └── AuthMiddleware.spec.ts
```

### 2. Helpers de Test

```typescript
// tests/helpers/index.ts
export function createAuthContext(user?: User) {
  const ctx = HttpContextFactory.create()
  if (user) {
    ctx.auth = { user, isAuthenticated: true }
  }
  return ctx
}

export function createValidationContext(data: any) {
  const ctx = HttpContextFactory.create()
  ctx.request.body = data
  return ctx
}

export async function createTestTransaction() {
  await Database.beginGlobalTransaction()
  return () => Database.rollbackGlobalTransaction()
}
```

### 3. Factories

```typescript
// database/factories/UserFactory.ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import { SubscriptionFactory } from './SubscriptionFactory'

export const UserFactory = Factory
  .define(User, ({ faker }) => ({
    email: faker.internet.email(),
    password: 'password123',
    name: faker.name.fullName(),
    phone: faker.phone.number('+336########'),
    isVerified: true
  }))
  .relation('subscriptions', () => SubscriptionFactory)
  .build()

// database/factories/SubscriptionFactory.ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import Subscription from 'App/Models/Subscription'
import { DateTime } from 'luxon'

export const SubscriptionFactory = Factory
  .define(Subscription, ({ faker }) => ({
    plan: faker.helpers.arrayElement(['basic', 'pro', 'enterprise']),
    status: 'active',
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({ months: 1 }),
    trialEndsAt: DateTime.now().plus({ days: 14 })
  }))
  .build()
``` 