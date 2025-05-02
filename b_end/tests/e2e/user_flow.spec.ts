import { test } from '@japa/runner'
import UserRole from '#models/user_role'
import User from '#models/user'


test.group('User Flow E2E Tests', (group) => {
  group.each.setup(async () => {

    
    // Vérifier si le rôle de test existe déjà
    const existingRole = await UserRole.findBy('role_name', 'E2E Tester')
    
    // Créer un rôle uniquement s'il n'existe pas déjà
    if (!existingRole) {
      await UserRole.create({
        role_name: 'E2E Tester'
      })
    }
  })

  test('complete user journey: register, verify email, login, check profile, logout', async ({ client, assert }) => {
    // 1. Inscription
    const registerResponse = await client.post('/register').json({
      first_name: 'E2E',
      last_name: 'Test',
      email: 'e2e_test@example.com',
      password: 'Password123',
      password_confirmation: 'Password123'
    })

    registerResponse.assertStatus(201)
    
    // 2. Vérifier que l'utilisateur est créé
    const user = await User.findBy('email', 'e2e_test@example.com')
    assert.exists(user)
    
    // 3. Simuler la vérification d'email (ce qui est généralement fait via un lien dans un email)
    const token = user!.verification_token
    const verifyResponse = await client.get(`/verify-email/${token}`)
    verifyResponse.assertStatus(200)
    
    // Vérifier que l'email est marqué comme vérifié
    await user!.refresh()
    assert.isTrue(user!.email_verified)
    
    // 4. Connexion
    const loginResponse = await client.post('/login').json({
      email: 'e2e_test@example.com',
      password: 'Password123'
    })

    loginResponse.assertStatus(200)
    const authToken = loginResponse.body().token
    assert.exists(authToken)
    
    // 5. Récupérer le profil
    const profileResponse = await client.get('/me').bearerToken(authToken)
    profileResponse.assertStatus(200)
    profileResponse.assertBodyContains({ user: { email: 'e2e_test@example.com' } })
    
    // 6. Déconnexion
    const logoutResponse = await client.post('/logout').bearerToken(authToken)
    logoutResponse.assertStatus(200)
    
    // 7. Vérifier que le token n'est plus valide
    const reCheckProfileResponse = await client.get('/me').bearerToken(authToken)
    reCheckProfileResponse.assertStatus(401) // Unauthorized
  })
})
