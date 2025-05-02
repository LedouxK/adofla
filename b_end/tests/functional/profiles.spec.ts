import { test } from '@japa/runner'
import User from '#models/user'
import UserRole from '#models/user_role'
import Profile from '#models/profile'


test.group('Profiles Controller', (group) => {
  let userId: number
  
  group.each.setup(async () => {

    
    // Récupérer le rôle utilisateur
    let userRole = await UserRole.findBy('role_name', 'User')
    
    // Si le rôle n'existe pas, nous devons faire une vérification
    if (!userRole) {
      // Récupérer tous les rôles disponibles
      const roles = await UserRole.all()
      if (roles.length > 0) {
        // Utiliser le premier rôle disponible
        userRole = roles[0]
      } else {
        throw new Error('Au moins un rôle doit exister dans la base de données pour exécuter ce test')
      }
    }
    
    // Créer un utilisateur
    const user = await User.create({
      first_name: 'Profile',
      last_name: 'Test',
      email: 'profile_test@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: true
    })
    
    userId = user.id
    
    // Créer un profil pour l'utilisateur
    await Profile.create({
      user_id: userId,
      name: 'Profile Test',
      role: 'Membre',
      p_pic: 'default.jpg',
      about: 'Ceci est un profil de test'
    })
    
    // Nous n'avons pas besoin de stocker l'ID du profil puisque nous le récupérons via la relation user_id
    
    // Ne pas obtenir de token ici, nous le ferons dans chaque test individuel
    
    // Créer un autre utilisateur avec profil pour les tests d'accès
    const otherUser = await User.create({
      first_name: 'Other',
      last_name: 'User',
      email: 'other_user@example.com',
      password: 'Password123',
      role_id: userRole.id,
      email_verified: true
    })
    
    await Profile.create({
      user_id: otherUser.id,
      name: 'Other Profile',
      role: 'Membre',
      p_pic: 'default.jpg',
      about: 'Profil d\'un autre utilisateur'
    })
  })

  test('user should be able to get their own profile', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)

    const response = await client.get('/api/profile')
      .bearerToken(userToken)
    
    response.assertStatus(200)
    response.assertBodyContains({ 
      name: 'Profile Test',
      about: 'Ceci est un profil de test'
    })
  })
  
  test('user should be able to update their profile', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)

    const response = await client.put('/api/profile')
      .bearerToken(userToken)
      .json({
        name: 'Updated Profile',
        role: 'Développeur',
        about: 'Ma bio mise à jour'
      })
    
    response.assertStatus(200)
    
    // Vérifier que les modifications ont été appliquées
    const updatedProfile = await Profile.findBy('user_id', userId)
    assert.equal(updatedProfile?.name, 'Updated Profile')
    assert.equal(updatedProfile?.role, 'Développeur')
    assert.equal(updatedProfile?.about, 'Ma bio mise à jour')
  })
  
  test('user should be able to upload a profile picture', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)

    // Note: Cette implémentation suppose que l'API accepte un JSON avec un champ 'p_pic_base64'
    // Si votre API utilise un multipart/form-data avec un vrai fichier, il faudrait adapter ce test
    
    const response = await client.put('/api/profile/picture')
      .bearerToken(userToken)
      .json({
        p_pic_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
      })
    
    response.assertStatus(200)
    
    // Vérifier que le nom de fichier a été mis à jour (nous ne pouvons pas vérifier le fichier réel)
    const updatedProfile = await Profile.findBy('user_id', userId)
    assert.notEqual(updatedProfile?.p_pic, 'default.jpg')
  })
  
  test('user should be able to view subscription history in profile', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)

    // Ce test vérifie l'accès à l'historique des abonnements depuis le profil
    // Note: la route s'appelle "subscriptionHistory" comme indiqué dans les mémoires du projet
    
    const response = await client.get('/api/profile/subscriptionHistory')
      .bearerToken(userToken)
    
    response.assertStatus(200)
    // Même si l'historique est vide, la requête doit réussir
    response.assertBodyContains([])
  })
  
  test('user should be able to view public profiles', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)
    
    // D'abord récupérer l'ID d'un autre utilisateur
    const otherUserProfile = await Profile.query().whereNot('user_id', userId).first()
    
    const response = await client.get(`/api/profiles/${otherUserProfile?.id}`)
      .bearerToken(userToken)
    
    response.assertStatus(200)
    // Vérifier que nous avons une liste de profils
    test.assert.isArray(response.body())
  })
  
  test('profile data should include user data when requested', async ({ client, assert }) => {
    // Obtenir un token utilisateur
    const loginResponse = await client.post('/api/login').json({
      email: 'profile_test@example.com',
      password: 'Password123'
    })
    
    loginResponse.assertStatus(200)
    const userToken = loginResponse.body().token
    assert.exists(userToken)
    
    // Test si le profil inclut les données utilisateur lorsqu'on le demande avec ?withUser=true
    
    const response = await client.get(`/api/profile?withUser=true`)
      .bearerToken(userToken)
    
    response.assertStatus(200)
    response.assertBodyContains({ 
      user: {
        email: 'profile_test@example.com',
        first_name: 'Profile',
        last_name: 'Test'
      }
    })
  })
})
