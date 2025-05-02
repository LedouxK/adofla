import { test } from '@japa/runner'
import UserRole from '#models/user_role'
import User from '#models/user'


test.group('Auth Controller', (group) => {

  group.each.setup(async () => {

    
    // Vérifier si le rôle de test existe déjà
    const existingRole = await UserRole.findBy('role_name', 'Auth Tester')
    
    // Créer un rôle uniquement s'il n'existe pas déjà
    if (!existingRole) {
      await UserRole.create({
        role_name: 'Auth Tester'
      })
    }
  })

  test('should register a new user', async ({ client, assert }) => {
    const response = await client.post('/api/register').json({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'Password123',
      password_confirmation: 'Password123'
    })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Votre compte a été créé avec succès' })
    
    // Vérifier que l'utilisateur a été créé en base de données
    const user = await User.findBy('email', 'test@example.com')
    assert.exists(user)
  })

  test('should not register with weak password', async ({ client }) => {
    const response = await client.post('/api/register').json({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'weak',
      password_confirmation: 'weak'
    })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Le mot de passe doit contenir au moins 8 caractères' })
  })

  test('should not register with mismatched passwords', async ({ client }) => {
    const response = await client.post('/api/register').json({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'Password123',
      password_confirmation: 'DifferentPassword123'
    })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Les mots de passe ne correspondent pas' })
  })

  test('should login with valid credentials', async ({ client, assert }) => {
    // Créer un utilisateur pour le test
    const userRole = await UserRole.findBy('role_name', 'User')
    await User.create({
      first_name: 'Login',
      last_name: 'Test',
      email: 'login@example.com',
      password: 'Password123',
      role_id: userRole!.id,
      email_verified: true
    })

    const response = await client.post('/api/login').json({
      email: 'login@example.com',
      password: 'Password123'
    })

    response.assertStatus(200)
    response.assertBodyContains({ type: 'bearer' })
    // Vérifier la présence du token
    assert.exists(response.body().token)
  })

  test('should not login with unverified email', async ({ client }) => {
    // Créer un utilisateur non vérifié
    const userRole = await UserRole.findBy('role_name', 'User')
    await User.create({
      first_name: 'Unverified',
      last_name: 'User',
      email: 'unverified@example.com',
      password: 'Password123',
      role_id: userRole!.id,
      email_verified: false,
      verification_token: 'test-token'
    })

    const response = await client.post('/api/login').json({
      email: 'unverified@example.com',
      password: 'Password123'
    })

    response.assertStatus(403)
    response.assertBodyContains({ needsVerification: true })
  })

  test('should logout successfully', async ({ client }) => {
    // Créer un utilisateur
    const userRole = await UserRole.findBy('role_name', 'User')
    await User.create({
      first_name: 'Logout',
      last_name: 'Test',
      email: 'logout@example.com',
      password: 'Password123',
      role_id: userRole!.id,
      email_verified: true
    })

    // Connecter l'utilisateur pour obtenir un token
    const loginResponse = await client.post('/api/login').json({
      email: 'logout@example.com',
      password: 'Password123'
    })

    const token = loginResponse.body().token

    // Tester la déconnexion
    const response = await client.post('/api/logout').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Vous avez été déconnecté avec succès' })
  })
})
