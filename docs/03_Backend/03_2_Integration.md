# Tests d'Intégration Backend

Ce document décrit la stratégie, la configuration et des exemples de tests d'intégration pour le backend de l'application.  
Ces tests vérifient l'interaction entre les différentes parties du système, notamment :

- **Routes et Endpoints**
- **Flux de données complets**
- **Interactions avec la base de données**
- **Intégrations externes** (Stripe, Email, etc.)

## Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Configuration](#configuration)
  - [Installation](#installation)
  - [Configuration de la Base de Données](#configuration-de-la-base-de-données)
- [Tests des Routes API](#tests-des-routes-api)
  - [Routes d'Authentification](#routes-dauthentification)
  - [Routes d'Abonnement](#routes-dabonnement)
  - [Routes Administrateur](#routes-administrateur)
- [Tests des Flux Complets](#tests-des-flux-complets)
  - [Processus de Paiement](#processus-de-paiement)
  - [Gestion des Utilisateurs](#gestion-des-utilisateurs)
  - [Gestion des Abonnements](#gestion-des-abonnements)
- [Tests de Base de Données](#tests-de-base-de-données)
  - [Migrations et Seeds](#migrations-et-seeds)
  - [Transactions et Rollbacks](#transactions-et-rollbacks)
- [Tests des Intégrations Externes](#tests-des-intégrations-externes)
  - [Service Email](#service-email)
  - [Intégration Stripe](#intégration-stripe)
  - [Service de Notification](#service-de-notification)
- [Bonnes Pratiques](#bonnes-pratiques)

## Vue d'Ensemble

Les tests d'intégration backend permettent de valider que :

- Les routes et endpoints répondent correctement aux requêtes HTTP
- Les flux complets fonctionnent comme prévu
- La base de données est correctement intégrée
- Les services externes sont bien configurés et gérés

## Configuration

### Installation

```bash
# Installation des dépendances pour les tests d'intégration
npm i -D supertest @types/supertest
npm i -D @japa/api-client
```

### Configuration de la Base de Données

```typescript
// config/database.ts
{
  testing: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_TEST
    },
    migrations: {
      tableName: 'adonis_schema',
      disableTransactions: false
    },
    pool: {
      min: 1,
      max: 2
    }
  }
}
```

## Tests des Routes API

### Routes d'Authentification

```typescript
import { test } from '@japa/runner'
import supertest from 'supertest'
import { UserFactory } from 'Database/factories/UserFactory'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Routes d\'Authentification', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('inscription utilisateur avec validation email', async ({ assert }) => {
    const response = await supertest(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Password123!',
        name: 'Test User'
      })

    assert.equal(response.status, 201)
    assert.exists(response.body.token)
    assert.equal(response.body.user.email, 'test@test.com')
    assert.isFalse(response.body.user.isVerified)

    // Vérification de l'email
    const verifyResponse = await supertest(BASE_URL)
      .get(`/api/auth/verify/${response.body.verificationToken}`)

    assert.equal(verifyResponse.status, 200)
    const user = await Database.from('users')
      .where('email', 'test@test.com')
      .first()
    assert.isTrue(user.is_verified)
  })

  test('login avec gestion des tentatives', async ({ assert }) => {
    const user = await UserFactory.create()

    // Tentatives échouées
    for (let i = 0; i < 3; i++) {
      await supertest(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrong_password'
        })
    }

    // Vérification du blocage
    const blockedResponse = await supertest(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'wrong_password'
      })

    assert.equal(blockedResponse.status, 429)
    assert.include(blockedResponse.body.message, 'trop de tentatives')

    // Attente et réessai
    await new Promise(resolve => setTimeout(resolve, 60000))

    const successResponse = await supertest(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'password123'
      })

    assert.equal(successResponse.status, 200)
    assert.exists(successResponse.body.token)
  })

  test('gestion complète du mot de passe oublié', async ({ assert }) => {
    const user = await UserFactory.create()

    // Demande de réinitialisation
    const resetRequest = await supertest(BASE_URL)
      .post('/api/auth/forgot-password')
      .send({ email: user.email })

    assert.equal(resetRequest.status, 200)

    // Récupération du token depuis la base de données
    const resetToken = await Database
      .from('password_resets')
      .where('email', user.email)
      .first()

    // Réinitialisation du mot de passe
    const resetResponse = await supertest(BASE_URL)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken.token,
        password: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!'
      })

    assert.equal(resetResponse.status, 200)

    // Vérification du nouveau mot de passe
    const loginResponse = await supertest(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'NewPassword123!'
      })

    assert.equal(loginResponse.status, 200)
  })
})
```

### Routes d'Abonnement

```typescript
test.group('Routes d\'Abonnement', (group) => {
  test('cycle de vie complet d\'un abonnement', async ({ assert }) => {
    const user = await UserFactory.create()
    const token = await user.generateToken()

    // Création avec période d'essai
    const createResponse = await supertest(BASE_URL)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: 'pro',
        paymentMethodId: 'pm_card_visa',
        withTrial: true
      })

    assert.equal(createResponse.status, 201)
    assert.equal(createResponse.body.status, 'active')
    assert.exists(createResponse.body.trialEndsAt)

    // Mise à jour du plan
    const upgradeResponse = await supertest(BASE_URL)
      .put('/api/subscriptions/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: 'enterprise',
        immediatePayment: true
      })

    assert.equal(upgradeResponse.status, 200)
    assert.equal(upgradeResponse.body.plan, 'enterprise')

    // Ajout d'un moyen de paiement de secours
    const backupPaymentResponse = await supertest(BASE_URL)
      .post('/api/subscriptions/payment-method')
      .set('Authorization', `Bearer ${token}`)
      .send({
        paymentMethodId: 'pm_card_mastercard',
        setAsDefault: false
      })

    assert.equal(backupPaymentResponse.status, 200)

    // Annulation avec période de grâce
    const cancelResponse = await supertest(BASE_URL)
      .post('/api/subscriptions/cancel')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reason: 'too_expensive',
        feedback: 'Le prix est trop élevé'
      })

    assert.equal(cancelResponse.status, 200)
    assert.equal(cancelResponse.body.status, 'cancelled')
    assert.exists(cancelResponse.body.gracePeriodEndsAt)
  })

  test('gestion des erreurs de paiement', async ({ assert }) => {
    const user = await UserFactory.create()
    const token = await user.generateToken()

    // Création avec carte déclinée
    const createResponse = await supertest(BASE_URL)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: 'pro',
        paymentMethodId: 'pm_card_declined'
      })

    assert.equal(createResponse.status, 400)
    assert.include(createResponse.body.message, 'paiement refusé')

    // Notification de l'échec
    const webhookResponse = await supertest(BASE_URL)
      .post('/api/webhooks/stripe')
      .send({
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            customer: user.stripeCustomerId,
            last_payment_error: {
              message: 'Carte déclinée'
            }
          }
        }
      })

    assert.equal(webhookResponse.status, 200)

    // Vérification de la notification
    const notification = await Database
      .from('notifications')
      .where('user_id', user.id)
      .first()

    assert.exists(notification)
    assert.equal(notification.type, 'payment_failed')
  })
})
```

## Tests des Flux Complets

### Processus de Paiement

```typescript
test.group('Processus de Paiement', () => {
  test('paiement complet avec gestion des erreurs', async ({ assert }) => {
    const user = await UserFactory.create()
    const token = await user.generateToken()

    // Création de l'intention de paiement
    const intentResponse = await supertest(BASE_URL)
      .post('/api/payments/create-intent')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 2999,
        currency: 'eur',
        description: 'Abonnement Pro',
        metadata: {
          plan: 'pro',
          userId: user.id
        }
      })

    assert.equal(intentResponse.status, 200)
    assert.exists(intentResponse.body.clientSecret)

    // Simulation 3D Secure
    const threeDSecureResponse = await supertest(BASE_URL)
      .post('/api/payments/handle-3ds')
      .set('Authorization', `Bearer ${token}`)
      .send({
        paymentIntentId: intentResponse.body.paymentIntentId,
        redirectResult: 'success'
      })

    assert.equal(threeDSecureResponse.status, 200)

    // Confirmation finale
    const confirmResponse = await supertest(BASE_URL)
      .post('/api/payments/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        paymentIntentId: intentResponse.body.paymentIntentId,
        paymentMethodId: 'pm_card_visa'
      })

    assert.equal(confirmResponse.status, 200)
    assert.equal(confirmResponse.body.status, 'succeeded')

    // Vérification de la facture
    const invoiceResponse = await supertest(BASE_URL)
      .get(`/api/payments/invoice/${confirmResponse.body.invoiceId}`)
      .set('Authorization', `Bearer ${token}`)

    assert.equal(invoiceResponse.status, 200)
    assert.exists(invoiceResponse.body.pdfUrl)
  })
})
```

### Gestion des Utilisateurs

```typescript
test.group('Gestion des Utilisateurs', () => {
  test('cycle de vie utilisateur avec préférences', async ({ assert }) => {
    // Création avec préférences
    const createResponse = await supertest(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Password123!',
        name: 'Test User',
        preferences: {
          language: 'fr',
          timezone: 'Europe/Paris',
          notifications: {
            email: true,
            push: false
          }
        }
      })

    const token = createResponse.body.token
    const userId = createResponse.body.user.id

    // Mise à jour du profil avec avatar
    const avatar = Buffer.from('fake-image-data')
    const updateResponse = await supertest(BASE_URL)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', avatar, 'avatar.png')
      .field('name', 'Updated Name')
      .field('phone', '+33612345678')

    assert.equal(updateResponse.status, 200)
    assert.equal(updateResponse.body.name, 'Updated Name')
    assert.exists(updateResponse.body.avatarUrl)

    // Mise à jour des préférences
    const preferencesResponse = await supertest(BASE_URL)
      .put(`/api/users/${userId}/preferences`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'en',
        notifications: {
          email: true,
          push: true
        }
      })

    assert.equal(preferencesResponse.status, 200)
    assert.equal(preferencesResponse.body.preferences.language, 'en')

    // Export des données (GDPR)
    const exportResponse = await supertest(BASE_URL)
      .post(`/api/users/${userId}/export`)
      .set('Authorization', `Bearer ${token}`)

    assert.equal(exportResponse.status, 200)
    assert.exists(exportResponse.body.downloadUrl)

    // Suppression du compte avec confirmation
    const deleteResponse = await supertest(BASE_URL)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: 'Password123!',
        reason: 'privacy_concerns'
      })

    assert.equal(deleteResponse.status, 200)

    // Vérification de la suppression des données
    const userData = await Database
      .from('users')
      .where('id', userId)
      .first()

    assert.isNull(userData)
  })
})
```

## Tests de Base de Données

### Migrations et Seeds

```typescript
test.group('Base de Données', () => {
  test('migrations et seeds avec vérification des contraintes', async ({ assert }) => {
    // Exécution des migrations
    await ace.call('migration:run', [], { silent: true })
    
    // Vérification des tables et contraintes
    const tables = [
      'users',
      'subscriptions',
      'payments',
      'notifications'
    ]

    for (const table of tables) {
      const hasTable = await Database.rawQuery(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = '${table}'
        )
      `)
      assert.isTrue(hasTable.rows[0].exists)

      // Vérification des contraintes
      const constraints = await Database.rawQuery(`
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = '${table}'
      `)
      assert.isNotEmpty(constraints.rows)
    }

    // Exécution et vérification des seeds
    await ace.call('db:seed', [], { silent: true })
    
    const counts = await Promise.all(tables.map(table => 
      Database.from(table).count('* as total').first()
    ))

    counts.forEach((count, index) => {
      assert.isAbove(parseInt(count.total), 0, `Table ${tables[index]} devrait contenir des données`)
    })
  })
})
```

## Tests des Intégrations Externes

### Service Email

```typescript
test.group('Service Email', () => {
  test('envoi d\'emails avec templates et pièces jointes', async ({ assert }) => {
    const user = await UserFactory.create()
    
    // Email de bienvenue avec template
    const welcomeResult = await EmailService.sendWelcomeEmail(user)
    assert.equal(welcomeResult.status, 'sent')
    
    // Vérification du log
    const welcomeLog = await Database
      .from('email_logs')
      .where('user_id', user.id)
      .where('type', 'welcome')
      .first()
    
    assert.exists(welcomeLog)

    // Email avec pièce jointe
    const attachment = {
      filename: 'facture.pdf',
      content: Buffer.from('fake-pdf-content'),
      contentType: 'application/pdf'
    }

    const invoiceResult = await EmailService.sendInvoiceEmail(user, {
      invoiceNumber: 'INV-001',
      amount: 29.99,
      attachment
    })

    assert.equal(invoiceResult.status, 'sent')
    assert.include(invoiceResult.attachments[0].filename, 'facture.pdf')
  })

  test('gestion des erreurs d\'envoi avec retry', async ({ assert }) => {
    const user = await UserFactory.create()
    
    // Simulation d'erreur SMTP
    EmailService.mailer.sendMail = () => {
      throw new Error('SMTP Error')
    }

    try {
      await EmailService.sendWelcomeEmail(user)
      assert.fail('Devrait lever une erreur')
    } catch (error) {
      assert.equal(error.message, 'SMTP Error')
    }

    // Vérification de la tentative de retry
    const failedLog = await Database
      .from('email_logs')
      .where('user_id', user.id)
      .where('status', 'failed')
      .first()

    assert.exists(failedLog)
    assert.isAbove(failedLog.retry_count, 0)
  })
})
```

### Intégration Stripe

```typescript
test.group('Intégration Stripe', () => {
  test('gestion complète des webhooks Stripe', async ({ assert }) => {
    const user = await UserFactory.create()
    const stripeService = new StripeService()

    // Création du client
    const customer = await stripeService.createCustomer({
      email: user.email,
      paymentMethodId: 'pm_card_visa'
    })
    assert.exists(customer.id)
    
    // Simulation de webhooks
    const webhookEvents = [
      {
        type: 'customer.subscription.created',
        data: {
          object: {
            customer: customer.id,
            status: 'active',
            plan: { id: 'price_H5ggYwtDq4fbrJ' }
          }
        }
      },
      {
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            customer: customer.id,
            amount_paid: 2999,
            status: 'paid'
          }
        }
      },
      {
        type: 'customer.subscription.updated',
        data: {
          object: {
            customer: customer.id,
            status: 'past_due'
          }
        }
      }
    ]

    for (const event of webhookEvents) {
      const response = await supertest(BASE_URL)
        .post('/api/webhooks/stripe')
        .send(event)

      assert.equal(response.status, 200)
    }

    // Vérification des mises à jour en base
    const subscription = await Database
      .from('subscriptions')
      .where('stripe_customer_id', customer.id)
      .first()

    assert.exists(subscription)
    assert.equal(subscription.status, 'past_due')
  })
})
```

## Bonnes Pratiques

### 1. Préparation des Tests

```typescript
// tests/bootstrap.ts
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import { configure } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

configure({
  plugins: [assert(), apiClient('http://localhost:3333')],
  setup: [
    async () => {
      await Database.beginGlobalTransaction()
      return () => Database.rollbackGlobalTransaction()
    }
  ],
  teardown: [
    async () => {
      await Database.manager.closeAll()
    }
  ]
})
```

### 2. Helpers d'Intégration

```typescript
// tests/helpers/integration.ts
export async function createAuthenticatedUser(attributes = {}) {
  const user = await UserFactory.merge(attributes).create()
  const token = await user.generateToken()
  
  return {
    user,
    token,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function createTestServer() {
  const app = require('@adonisjs/core/build/standalone')
  return supertest(app)
}

export async function createTestSubscription(user, plan = 'pro') {
  const subscription = await SubscriptionFactory.merge({
    userId: user.id,
    plan,
    status: 'active'
  }).create()

  return subscription
}
```

### 3. Mocks des Services Externes

```typescript
// tests/mocks/stripe.ts
export class MockStripeService {
  customers = new Map()
  subscriptions = new Map()

  async createCustomer(data) {
    const customer = {
      id: `cus_mock${Date.now()}`,
      email: data.email,
      created: Date.now()
    }
    this.customers.set(customer.id, customer)
    return customer
  }

  async createSubscription(data) {
    const subscription = {
      id: `sub_mock${Date.now()}`,
      customer: data.customerId,
      status: 'active',
      current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000
    }
    this.subscriptions.set(subscription.id, subscription)
    return subscription
  }

  async cancelSubscription(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      subscription.status = 'cancelled'
      subscription.canceled_at = Date.now()
      this.subscriptions.set(subscriptionId, subscription)
    }
    return subscription
  }
}
``` 