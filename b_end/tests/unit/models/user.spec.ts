import { test } from '@japa/runner'
import User from '#models/user'


test.group('User Model', (group) => {

  group.each.setup(async () => {

  })
  test('should hash password before saving', async ({ assert }) => {
    const user = new User()
    user.first_name = 'Test'
    user.last_name = 'User'
    user.email = 'test@example.com'
    user.password = 'Password123'
    user.role_id = 1 // Assurez-vous que ce rôle existe dans votre base de données
    
    // Vérifier que le mot de passe est modifié après sauvegarde
    const originalPassword = user.password
    await user.save()
    
    assert.notEqual(user.password, originalPassword)
    assert.isTrue(user.password.startsWith('$'))
  })

  test('can verify credentials with correct password', async ({ assert }) => {
    const email = 'verify@example.com'
    const password = 'Password123'
    
    // Créer un utilisateur pour tester
    const user = new User()
    user.first_name = 'Verify'
    user.last_name = 'User'
    user.email = email
    user.password = password
    user.role_id = 1 // Assurez-vous que ce rôle existe dans votre base de données
    await user.save()
    
    // Vérifier les identifiants
    try {
      const result = await User.verifyCredentials(email, password)
      assert.exists(result)
      assert.equal(result.email, email)
    } catch (error) {
      assert.fail('Verification des identifiants échouée: ' + error.message)
    }
  })

  test('cannot verify credentials with incorrect password', async ({ assert }) => {
    const email = 'wrong@example.com'
    const password = 'Password123'
    
    // Créer un utilisateur pour tester
    const user = new User()
    user.first_name = 'Wrong'
    user.last_name = 'User'
    user.email = email
    user.password = password
    user.role_id = 1 // Assurez-vous que ce rôle existe dans votre base de données
    await user.save()
    
    // Test avec mauvais mot de passe
    try {
      await User.verifyCredentials(email, 'WrongPassword123')
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.exists(error)
    }
  })
})
