import { test } from '@japa/runner'
import UserRole from '#models/user_role'
import Subscription from '#models/subscription'


test.group('Subscriptions Controller', (group) => {

  group.each.setup(async () => {

    
    // Récupérer les rôles existants
    let userRole = await UserRole.findBy('role_name', 'User')
    let adminRole = await UserRole.findBy('role_name', 'Admin')
    
    // Si les rôles n'existent pas, nous devons faire une vérification
    if (!userRole || !adminRole) {
      // Récupérer tous les rôles disponibles
      const roles = await UserRole.all()
      if (roles.length >= 2) {
        // Utiliser les deux premiers rôles disponibles
        userRole = roles[0]
        adminRole = roles[1]
      } else {
        throw new Error('Au moins deux rôles doivent exister dans la base de données pour exécuter ce test')
      }
    }
  })
  
  test('should list all active subscriptions', async ({ client }) => {
    // Créer des abonnements pour le test
    await Subscription.create({
      name: 'Basic Plan',
      description: 'Abonnement de base mensuel',
      price: 9.99
    })
    
    await Subscription.create({
      name: 'Premium Plan',
      description: 'Abonnement premium annuel',
      price: 99.99
    })
    
    const response = await client.get('/api/subscriptions')
    
    response.assertStatus(200)
    response.assertBodyContains([{ name: 'Basic Plan' }, { name: 'Premium Plan' }])
  })
  
  test('should get subscription by id', async ({ client }) => {
    // Créer un abonnement pour le test
    const subscription = await Subscription.create({
      name: 'Test Plan',
      description: 'Abonnement de test',
      price: 19.99
    })
    
    const response = await client.get(`/api/subscriptions/${subscription.id}`)
    
    response.assertStatus(200)
    response.assertBodyContains({ name: 'Test Plan', price: 19.99 })
  })
  
  test('should require authentication for admin operations', async ({ client }) => {
    const response = await client.post('/api/subscriptions').json({
      name: 'Unauthorized Plan',
      description: 'Cet abonnement ne devrait pas être créé',
      price: 29.99
    })
    
    // Sans token, on s'attend à une erreur d'authentification
    response.assertStatus(401) // Unauthorized
  })
  
  test('admin should be able to create a new subscription', async ({ client, assert }) => {
    // Créer un utilisateur admin et obtenir un token
    const adminRole = await UserRole.findBy('role_name', 'Admin')
    assert.exists(adminRole)
    
    // Login pour obtenir un token
    const loginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    // Si l'utilisateur admin n'existe pas encore dans la base de données,
    // ce test échouera. Cela vous indiquera que vous devez d'abord créer l'utilisateur
    // dans un test précédent ou dans un setup global
    loginResponse.assertStatus(200)
    const adminToken = loginResponse.body().token
    
    const response = await client.post('/api/subscriptions')
      .bearerToken(adminToken)
      .json({
        name: 'New Subscription',
        description: 'Nouvel abonnement test',
        price: 39.99
      })
    
    response.assertStatus(201) // Created
    response.assertBodyContains({ name: 'New Subscription' })
  })
})
