import { test } from '@japa/runner'
import User from '#models/user'
import UserRole from '#models/user_role'


test.group('Users Controller', (group) => {
  let userId: number
  

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
    
    // Créer un utilisateur standard
    const user = await User.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test_user@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: true
    })
    
    userId = user.id
    
    // Créer un utilisateur admin pour les tests
    await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: 'Password123',
      role_id: adminRole.id,
      email_verified: true
    })
    
    // Créer quelques utilisateurs supplémentaires pour les tests
    await User.create({
      first_name: 'User1',
      last_name: 'Test',
      email: 'user1@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: true
    })
    
    await User.create({
      first_name: 'User2',
      last_name: 'Test',
      email: 'user2@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: false
    })
  })

  test('admin should be able to list all users', async ({ client, assert }) => {
    // Obtenir un token admin
    const adminLoginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    adminLoginResponse.assertStatus(200)
    const adminToken = adminLoginResponse.body().token
    assert.exists(adminToken)

    const response = await client.get('/api/users')
      .bearerToken(adminToken)
    
    response.assertStatus(200)
    // Vérifier que la réponse contient une liste d'utilisateurs
    response.assertBodyContains([
      { email: 'test_user@example.com' },
      { email: 'admin@example.com' },
      { email: 'user1@example.com' }
    ])
  })
  
  test('admin should be able to get user by id', async ({ client, assert }) => {
    // Obtenir un token admin
    const adminLoginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    adminLoginResponse.assertStatus(200)
    const adminToken = adminLoginResponse.body().token
    assert.exists(adminToken)
    
    const response = await client.get(`/api/users/${userId}`)
      .bearerToken(adminToken)
    
    response.assertStatus(200)
    response.assertBodyContains({ 
      email: 'test_user@example.com',
      first_name: 'Test',
      last_name: 'User'
    })
  })
  
  test('admin should be able to update user', async ({ client, assert }) => {
    // Obtenir un token admin
    const adminLoginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    adminLoginResponse.assertStatus(200)
    const adminToken = adminLoginResponse.body().token
    assert.exists(adminToken)
    
    const response = await client.put(`/api/users/${userId}`)
      .bearerToken(adminToken)
      .json({
        first_name: 'Updated',
        last_name: 'Name'
      })
    
    response.assertStatus(200)
    
    // Vérifier que les modifications ont été appliquées
    const updatedUser = await User.find(userId)
    assert.equal(updatedUser?.first_name, 'Updated')
    assert.equal(updatedUser?.last_name, 'Name')
  })
  
  test('regular user should not be able to access user list', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const userLoginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    userLoginResponse.assertStatus(200)
    const userToken = userLoginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.get('/api/users')
      .bearerToken(userToken)
    
    response.assertStatus(403) // Forbidden
  })
  
  test('regular user should be able to access their own data', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const userLoginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    userLoginResponse.assertStatus(200)
    const userToken = userLoginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.get(`/api/users/${userId}`)
      .bearerToken(userToken)
    
    response.assertStatus(200)
    response.assertBodyContains({ email: 'test_user@example.com' })
  })
  
  test('regular user should not be able to access another user data', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const userLoginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    userLoginResponse.assertStatus(200)
    const userToken = userLoginResponse.body().token
    assert.exists(userToken)
    
    // Trouver l'ID d'un autre utilisateur
    const otherUser = await User.findBy('email', 'user1@example.com')
    assert.exists(otherUser)
    
    const response = await client.get(`/api/users/${otherUser?.id}`)
      .bearerToken(userToken)
    
    response.assertStatus(403) // Forbidden
  })
  
  test('regular user should be able to update their own password', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const userLoginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    userLoginResponse.assertStatus(200)
    const userToken = userLoginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.put(`/api/users/${userId}/password`)
      .bearerToken(userToken)
      .json({
        current_password: 'Password123',
        new_password: 'NewPassword123',
        new_password_confirmation: 'NewPassword123'
      })
    
    response.assertStatus(200)
    
    // Vérifier qu'on peut se connecter avec le nouveau mot de passe
    const loginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'NewPassword123'
    })
    
    loginResponse.assertStatus(200)
    assert.exists(loginResponse.body().token)
  })
  
  test('should not update password if current password is incorrect', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const userLoginResponse = await client.post('/api/login').json({
      email: 'test_user@example.com',
      password: 'Password123'
    })
    
    userLoginResponse.assertStatus(200)
    const userToken = userLoginResponse.body().token
    assert.exists(userToken)
    
    const response = await client.put(`/api/users/${userId}/password`)
      .bearerToken(userToken)
      .json({
        current_password: 'WrongPassword',
        new_password: 'NewPassword123',
        new_password_confirmation: 'NewPassword123'
      })
    
    response.assertStatus(400) // Bad Request
  })
  
  test('admin should be able to change user role', async ({ client, assert }) => {
    // Obtenir un token admin
    const adminLoginResponse = await client.post('/api/login').json({
      email: 'admin@example.com',
      password: 'Password123'
    })
    
    adminLoginResponse.assertStatus(200)
    const adminToken = adminLoginResponse.body().token
    assert.exists(adminToken)
    
    // Récupérer le rôle admin
    const adminRole = await UserRole.findBy('role_name', 'Admin')
    assert.exists(adminRole)
    
    const response = await client.put(`/api/users/${userId}/role`)
      .bearerToken(adminToken)
      .json({
        role_id: adminRole?.id
      })
    
    response.assertStatus(200)
    
    // Vérifier que le rôle a été modifié
    const updatedUser = await User.find(userId)
    assert.equal(updatedUser?.role_id, adminRole?.id)
  })
})
