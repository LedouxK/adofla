import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import ResetPassword from '#models/password_reset'

import mail from '@adonisjs/mail/services/main'
import { randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
// import db from '@adonisjs/lucid/services/db'
import Hash from '@adonisjs/core/services/hash'

export default class UsersController {
  public async changePassword({ request, response, auth }: HttpContext) {
    try {
      // Extract current and new passwords from the request
      const { current_password, new_password, confirm_password } = request.only([
        'current_password',
        'new_password',
        'confirm_password',
      ])

      // Get the authenticated user
      const user = auth.user

      if (!user) {
        return response.unauthorized({ message: 'Utilisateur non authentifié' })
      }

      // Verify the current password
      const isPasswordValid = await Hash.verify(user.password, current_password)
      if (!isPasswordValid) {
        return response.badRequest({ message: 'Le mot de passe actuel est incorrect' })
      }

      // Check if the new password matches the confirmation password
      if (new_password !== confirm_password) {
        return response.badRequest({
          message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas',
        })
      }

      // Update the user's password
      user.password = new_password
      await user.save()

      // Return success response
      return response.ok({ message: 'Mot de passe modifié avec succès' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Impossible de modifier le mot de passe',
        error: error.message,
      })
    }
  }
  public async sendResetEmail({ request, response }: HttpContext) {
    const email = request.input('email')

    // Check if user exists
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({ message: 'Adresse email introuvable' })
    }

    // Generate Reset Token
    const random = await promisify(randomBytes)(32)
    const token = random.toString('hex')

    const password_resets = await ResetPassword.create({ email, token })

    // Envoyer l'email de réinitialisation
    await mail.send((message: any) => {
      message
        .to(email)
        .from('noreply@flapicms.com', "L'équipe FlapiCMS")
        .subject('Demande de réinitialisation de mot de passe')
        .htmlView('reset_password', { token })
    })

    return response.json({ message: 'Email de réinitialisation envoyé' })
  }

  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    // Validate token
    const tokenRecord = await ResetPassword.query().where('token', token).first()

    if (!tokenRecord) {
      return response.status(400).json({ message: 'Jeton invalide ou expiré' })
    }

    // Update user password
    const user = await User.findBy('email', tokenRecord.email)
    if (user) {
      user.password = password
      await user.save()
    }

    // Delete the token
    await ResetPassword.query().where('token', token).delete()

    return response.json({ message: 'Mot de passe réinitialisé avec succès' })
  }
  
  // Valider le token d'invitation et récupérer l'email associé
  public async validateToken({ params, response }: HttpContext) {
    const token = params.token
    
    if (!token) {
      return response.status(400).json({ message: 'Jeton manquant' })
    }
    
    // Vérifier que le token existe dans la base de données
    const tokenRecord = await ResetPassword.query().where('token', token).first()
    
    if (!tokenRecord) {
      return response.status(400).json({ message: 'Jeton invalide ou expiré' })
    }
    
    // Retourner l'email associé au token
    return response.json({
      valid: true,
      email: tokenRecord.email
    })
  }
  
  // Finaliser la configuration du compte
  public async setupAccount({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])
    
    // Valider le token
    const tokenRecord = await ResetPassword.query().where('token', token).first()
    
    if (!tokenRecord) {
      return response.status(400).json({ message: 'Jeton invalide ou expiré' })
    }
    
    // Mettre à jour le mot de passe de l'utilisateur
    const user = await User.findBy('email', tokenRecord.email)
    if (user) {
      user.password = password
      await user.save()
    } else {
      return response.status(404).json({ message: 'Utilisateur non trouvé' })
    }
    
    // Supprimer le token
    await ResetPassword.query().where('token', token).delete()
    
    return response.json({
      message: 'Compte configuré avec succès. Vous pouvez maintenant vous connecter.',
      email: tokenRecord.email
    })
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    return User.accessTokens.create(user)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async authUser({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user,
    }
  }

  // Create a new user with invitation email
  public async store({ request, response }: HttpContext) {
    try {
      // Récupérer uniquement l'email et le rôle (plus de mot de passe)
      const { email, role_id } = request.only(['email', 'role_id'])
      
      // Vérifier si l'email existe déjà
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({ message: 'Un utilisateur avec cet email existe déjà' })
      }
      
      // Générer un mot de passe temporaire aléatoire
      const passwordRandom = await promisify(randomBytes)(16)
      const tempPassword = passwordRandom.toString('hex')
      
      // Créer l'utilisateur avec le mot de passe temporaire
      const user = await User.create({ 
        email, 
        password: tempPassword, 
        role_id
      })
      
      // Générer un token d'invitation
      const tokenRandom = await promisify(randomBytes)(32)
      const token = tokenRandom.toString('hex')

      // Enregistrer le token pour la réinitialisation du mot de passe
      await ResetPassword.create({ email, token })

      // Construire l'URL pour le lien de configuration du compte
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'
      const setupUrl = `${frontendUrl}/setup-account/${token}`

      // Envoi de l'email d'invitation
      await mail.send((message: any) => {
        message
          .to(email)
          .from('noreply@flapicms.com', "L'équipe FlapiCMS")
          .subject('Invitation à rejoindre FlapiCMS')
          .html(`
            <h1>Bienvenue sur FlapiCMS</h1>
            <p>Vous avez été invité à rejoindre notre plateforme.</p>
            <p>Pour configurer votre compte, veuillez cliquer sur le lien suivant : <a href="${setupUrl}">Configurer mon compte</a></p>
            <p>Ce lien expirera dans 24 heures.</p>
            <p>L'équipe FlapiCMS</p>
          `)
      })  
      return response.created({
        user: { id: user.id, email: user.email, role_id: user.role_id },
        message: 'Utilisateur créé avec succès. Un email d\'invitation a été envoyé.'
      })
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      return response.internalServerError({
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      })
    }
  }

  // Get a list of all users
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const per_page = request.input('per_page')

    if (per_page > 0) {
      const users = await User.query().preload('userRole').paginate(page, per_page)
      return users
    }

    const users = await User.query().preload('userRole')
    return users
  }

  // Get a specific user by ID
  public async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return user
  }

  // Update a user's email or password
  public async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.merge(request.only(['email', 'password', 'role_id']))
    await user.save()
    return user
  }

  // Delete a user
  public async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.noContent()
  }
}
