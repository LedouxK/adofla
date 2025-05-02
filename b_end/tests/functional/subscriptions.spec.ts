import { test } from '@japa/runner'
import User from '#models/user'
import UserRole from '#models/user_role'
import Subscription from '#models/subscription'


test.group('Subscriptions Controller', (group) => {
  
  group.each.setup(async () => {

    
    // Récupérer les rôles existants
    let userRole = await UserRole.findBy('role_name', 'User')
    let adminRole = await UserRole.findBy('role_name', 'Admin')
    
    // Si les rôles n'existent pas, nous devons faire une vérification et les récupérer par ID
    if (!userRole || !adminRole) {
      // Récupérer tous les rôles disponibles
      const roles = await UserRole.all()
      if (roles.length >= 2) {
        // Utiliser les deux premiers rôles disponibles comme remplacement
        userRole = roles[0]
        adminRole = roles[1] 
      } else {
        throw new Error('Les rôles User et Admin doivent exister dans la base de données pour exécuter ce test')
      }
    }
    
    // Créer des utilisateurs pour les tests
    await User.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test_user@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: true
    })
    
    // Créer un utilisateur admin
    await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: 'Password123',
      role_id: adminRole.id,
      email_verified: true
    })
    
    // Ne pas obtenir de tokens dans le setup - on le fera dans chaque test individuel
    
    // Créer un abonnement de test
    await Subscription.create({
      name: 'Basic Plan',
      description: 'Abonnement de base mensuel',
      price: 9.99,
      duration: 30, // jours
      is_active: true,
      features: JSON.stringify(['Accès de base', 'Support email']),
      // Pas de référence à des services de paiement externes
    })
    
    await Subscription.create({
      name: 'Premium Plan',
      description: 'Abonnement premium annuel',
      price: 99.99,
      duration: 365, // jours
      is_active: true,
      features: JSON.stringify(['Accès premium', 'Support prioritaire', 'Fonctionnalités avancées']),
      // Pas de référence à des services de paiement externes
    })
  })

  test('should list all active subscriptions', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.get('/api/subscriptions')
      .bearerToken(userToken)
    
    response.assertStatus(200)
    response.assertBodyContains([{ name: 'Basic Plan' }, { name: 'Premium Plan' }])
  })
  
  test('should get subscription by id', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)
    
    // D'abord créer un abonnement pour le test
    const subscription = await Subscription.create({
      name: 'Test Plan',
      description: 'Plan for testing',
      price: 19.99,
      is_active: true,
      duration: 30,
      features: JSON.stringify(['Feature 1', 'Feature 2']),
      // Pas de référence à des services de paiement externes
    })
    
    const response = await client.get(`/api/subscriptions/${subscription.id}`)
      .bearerToken(userToken)
    
    response.assertStatus(200)
    response.assertBodyContains({ name: 'Test Plan', price: 19.99 })
  })
  
  test('admin should be able to create a new subscription', async ({ client, assert }) => {
    // Obtenir un token admin
    const loginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const adminToken = loginResponse.body().token
    assert.exists(adminToken)
    
    const response = await client.post('/api/subscriptions')
      .bearerToken(adminToken)
      .json({
        name: 'Enterprise Plan',
        description: 'Plan pour les entreprises',
        price: 199.99,
        duration: 365,
        is_active: true,
        features: ['Accès complet', 'Support dédié', 'API illimitée'],
        // Pas de référence à des services de paiement externes
      })
    
    response.assertStatus(201)
    response.assertBodyContains({ 
      name: 'Enterprise Plan',
      price: 199.99
    })
    
    // Vérifier que l'abonnement a bien été créé
    const subscription = await Subscription.findBy('name', 'Enterprise Plan')
    assert.exists(subscription)
  })
  
  test('admin should be able to update a subscription', async ({ client, assert }) => {
    // Obtenir un token admin
    const loginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const adminToken = loginResponse.body().token
    assert.exists(adminToken)
    
    // D'abord créer un abonnement pour le test
    const subscription = await Subscription.create({
      name: 'Update Test Plan',
      description: 'Plan for testing updates',
      price: 29.99,
      is_active: true,
      duration: 30,
      features: JSON.stringify(['Feature 1', 'Feature 2']),
    })
    
    const response = await client.put(`/api/subscriptions/${subscription.id}`)
      .bearerToken(adminToken)
      .json({
        price: 12.99,
        description: 'Abonnement de base mensuel mis à jour'
      })
    
    response.assertStatus(200)
    
    // Vérifier que les modifications ont été appliquées
    const updatedSubscription = await Subscription.find(subscription.id)
    assert.equal(updatedSubscription?.price, 12.99)
    assert.equal(updatedSubscription?.description, 'Abonnement de base mensuel mis à jour')
  })
  
  test('admin should be able to deactivate a subscription', async ({ client, assert }) => {
    // Obtenir un token admin
    const loginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const adminToken = loginResponse.body().token
    assert.exists(adminToken)
    
    // D'abord créer un abonnement pour le test
    const subscription = await Subscription.create({
      name: 'Deactivate Test Plan',
      description: 'Plan for testing deactivation',
      price: 39.99,
      is_active: true,
      duration: 30,
      features: JSON.stringify(['Feature 1', 'Feature 2']),
      // Pas de référence à des services de paiement externes
    })
    
    const response = await client.put(`/api/subscriptions/${subscription.id}`)
      .bearerToken(adminToken)
      .json({
        is_active: false
      })
    
    response.assertStatus(200)
    
    // Vérifier que l'abonnement a bien été désactivé
    const deactivatedSubscription = await Subscription.find(subscription.id)
    assert.isFalse(deactivatedSubscription?.is_active)
  })
  
  test('non-admin user should not be able to create subscriptions', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.post('/api/subscriptions')
      .bearerToken(userToken)
      .json({
        name: 'Unauthorized Plan',
        description: 'Plan non autorisé',
        price: 19.99,
        duration: 30,
        is_active: true,
        features: ['Feature 1', 'Feature 2'],
        // Pas de référence à des services de paiement externes
      })
    
    response.assertStatus(403) // Forbidden
  })
})
