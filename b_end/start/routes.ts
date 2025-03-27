/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import mail from '@adonisjs/mail/services/main' // Ajout de l'import mail

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
// import Route from '@ioc:Adonis/Core/Route'

const UsersController = () => import('#controllers/users_controller')
const SubscriptionsController = () => import('#controllers/subscriptions_controller')
const UserSubscriptionsController = () => import('#controllers/user_subscriptions_controller')
const ProfilesController = () => import('#controllers/profiles_controller')

const PaymentController = () => import('#controllers/payments_controller')

router
  .group(() => {
    router.post('login', [UsersController, 'login'])
    router.post('sendResetEmail', [UsersController, 'sendResetEmail'])
    router.post('resetPassword', [UsersController, 'resetPassword'])
    router.get('sessions', [PaymentController, 'sessions'])

    router.post('createCustomer', [PaymentController, 'createCustomer'])
    router.post('addNewCard', [PaymentController, 'addNewCard'])
    router.post('createCharges', [PaymentController, 'createCharges'])
  })
  .prefix('/api')

router
  .group(() => {
    router.get('logout', [UsersController, 'logout'])
    router.get('authUser', [UsersController, 'authUser'])
    router.post('changePassword', [UsersController, 'changePassword'])

    router.post('toModifyListSubscriptions', [SubscriptionsController, 'toModifyListSubscriptions'])
    router.get('subscriptions', [SubscriptionsController, 'index'])
    router.get('subscriptions/:id', [SubscriptionsController, 'show'])
    router.post('subscribe', [UserSubscriptionsController, 'subscribe'])
    // router.post('addAdminSubscribe', [UserSubscriptionsController, 'addAdminSubscribe'])
    router.post('unsubscribe', [UserSubscriptionsController, 'unsubscribe'])
    router.get('activeSubscriptions', [UserSubscriptionsController, 'activeSubscriptions'])
    router.get('subsscriptionHistory', [UserSubscriptionsController, 'subsscriptionHistory'])
    router.post('updateSubscription', [UserSubscriptionsController, 'updateSubscription'])

    router.post('profile', [ProfilesController, 'store'])
    router.get('profile', [ProfilesController, 'index'])
    router.post('profilePicture', [ProfilesController, 'profilePicture'])
  })
  .prefix('/api')
  .use(middleware.auth())

router
  .group(() => {
    router.post('users', [UsersController, 'store'])
    router.get('users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])

    router.post('subscriptions', [SubscriptionsController, 'store'])

    router.put('subscriptions/:id', [SubscriptionsController, 'update'])
    router.delete('subscriptions/:id', [SubscriptionsController, 'destroy'])

    router.post('allActiveSubscriptions', [UserSubscriptionsController, 'allActiveSubscriptions'])
  })
  .prefix('/api')
  .use(middleware.admin())

// Route de test d'email ajoutée
router.get('/api/test-email', async ({ response }) => {
  try {
    await mail.send((message) => {
      message
        .to('ton-email@example.com') // Remplace par ton adresse email réelle
        .subject('Test Email de Sub Manage')
        .html("<p>Ceci est un test pour vérifier que l'envoi d'email fonctionne</p>")
    })
    return response.json({ success: true, message: 'Email de test envoyé' })
  } catch (error) {
    console.error('Erreur test email:', error)
    return response.status(500).json({ success: false, error: error.message })
  }
})
