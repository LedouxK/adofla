import { test } from '@japa/runner'
import User from '#models/user'
import { ApiClient, ApiResponse } from '@japa/api-client'  // Import du client
import type { Group } from '@japa/runner/core'
import type { Assert } from '@japa/assert'

test.group('Auth', (group: Group): void => {
  let user: User
  let token: string
  let adminUser: User
  let adminToken: string

  group.setup(async (): Promise<void> => {
    // Crée un utilisateur administrateur pour les tests
    adminUser = await User.create({
      email: 'adminn@example.com',
      password: 'adminpassword',
      role_id: 1, // Assurez-vous que l'utilisateur a un rôle administrateur
    })

    // Crée un utilisateur pour les tests classiques
    user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role_id: 2, // Assurez-vous que l'utilisateur a un rôle non admin
    })
  })

  // Test de connexion avec des identifiants valides (tout utilisateur)
  test('Un utilisateur peut se connecter avec des identifiants valides', async ({
    client,
    assert,
  }: {
    client: ApiClient
    assert: Assert
  }): Promise<void> => {
    // Obtenez le token pour l'utilisateur standard
    const response: ApiResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().token, 'Le token doit être renvoyé')
  })

  test('L\'utilisateur peut se déconnecter avec succès', async ({
    client
  }: {
    client: ApiClient
  }): Promise<void> => {

    const connectresponse: ApiResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })

    token = connectresponse.body().token


    // Étape 1 : Déconnexion de l'utilisateur testuser@exemple.com
    const response: ApiResponse = await client.get('/api/logout').bearerToken(token) // Utilisation du token de l'utilisateur
    response.assertBodyContains({ message: 'success' })
  })

  // Test de connexion avec un mauvais mot de passe (tout utilisateur)
  test('Un utilisateur ne peut pas se connecter avec un mauvais mot de passe', async ({
    client,
  }: {
    client: ApiClient
  }): Promise<void> => {
    const response: ApiResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'wrongpassword',
    })

    response.assertStatus(400)
  })


  // Test d'enregistrement d'un nouvel utilisateur (seul un administrateur peut le faire)
  test('Un nouvel utilisateur peut être enregistré par un administrateur', async ({
    client,
    assert,
  }: {
    client: ApiClient
    assert: Assert
  }): Promise<void> => {

    // Obtenez le token de l'administrateur pour les tests qui nécessitent un admin
    const adminLoginResponse: ApiResponse = await client.post('/api/login').json({
      email: adminUser.email,
      password: 'adminpassword',
    })
    adminToken = adminLoginResponse.body().token

    // Utilisez l'administrateur pour enregistrer un nouvel utilisateur
    const response: ApiResponse = await client
      .post('/api/users')
      .bearerToken(adminToken) // Utilisez le token de l'administrateur
      .json({
        email: 'newuser@example.com',
        password: 'securepassword',
        role_id: 2, // L'utilisateur créé aura un rôle non admin
      })

    response.assertStatus(201)
    assert.equal(response.body().email, 'newuser@example.com')

    // Vérifier si l'utilisateur a bien été ajouté en base de données
    const userInDb: User | null = await User.findBy('email', 'newuser@example.com')
    assert.exists(userInDb, 'L’utilisateur n’a pas été trouvé dans la base de données')
    assert.equal(userInDb?.email, 'newuser@example.com')
  })


  // Test de changement de mot de passe (tout utilisateur peut changer son mot de passe)
  test('Un utilisateur peut changer son mot de passe', async ({
    client,
    assert,
  }: {
    client: ApiClient
    assert: Assert
  }): Promise<void> => {

    const connectresponse: ApiResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password123',
    })

    token = connectresponse.body().token

    const newPassword = 'newpassword123'
    
    const response: ApiResponse = await client
      .post('/api/changePassword')
      .bearerToken(token) // Utilisation du token pour l'utilisateur authentifié
      .json({
        current_password: 'password123',
        new_password: newPassword,
        confirm_password: newPassword,
      })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Password changed successfully' })

    // Vérifier que le mot de passe a bien été modifié en base de données
    const updatedUser = await User.find(user.id)
    assert.notEqual(updatedUser?.password, 'password123', 'Le mot de passe doit avoir changé')
  })
})

test('Un administrateur peut supprimer un utilisateur', async ({
  client,
  assert,
}: {
  client: ApiClient
  assert: Assert
}): Promise<void> => {
  // Étape 1 : Connexion de l'administrateur pour obtenir un token valide
  const adminLoginResponse: ApiResponse = await client.post('/api/login').json({
    email: 'adminn@example.com',
    password: 'adminpassword',
  })
  const adminToken = adminLoginResponse.body().token // Récupère le token de l'administrateur

  // Étape 2 : Création d'un utilisateur à supprimer (si nécessaire, ou utilisez un utilisateur déjà existant)
  const newUserResponse: ApiResponse = await client
    .post('/api/users')
    .bearerToken(adminToken) // Utilisation du token de l'administrateur
    .json({
      email: 'userToDelete@example.com',
      password: 'securepassword',
      role_id: 2, // L'utilisateur créé aura un rôle non admin
    })
  const userId = newUserResponse.body().id; // Récupère l'ID de l'utilisateur à supprimer

  // Étape 3 : Suppression de l'utilisateur
  const deleteResponse: ApiResponse = await client
    .delete(`/api/users/${userId}`) // Envoie une requête DELETE pour supprimer l'utilisateur
    .bearerToken(adminToken) // Utilisation du token de l'administrateur
  deleteResponse.assertStatus(204) // Vérifier que la suppression a réussi (204 No Content)

  // Étape 4 : Vérifier que l'utilisateur a bien été supprimé de la base de données
  const deletedUser = await User.find(userId)
  assert.isNull(deletedUser, 'L\'utilisateur n\'a pas été supprimé de la base de données')
})
