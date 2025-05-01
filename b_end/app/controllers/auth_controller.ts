import { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import UserRole from '#models/user_role'

export default class AuthController {
  /**
   * Méthode d'inscription pour les nouveaux utilisateurs
   */
  public async register({ request, response }: HttpContext) {
    try {
      // Récupérer les données du formulaire
      const { first_name, last_name, email, password, password_confirmation } = request.only([
        'first_name',
        'last_name',
        'email',
        'password',
        'password_confirmation'
      ])

      // Vérifier que les mots de passe correspondent
      if (password !== password_confirmation) {
        return response.badRequest({ 
          message: 'Les mots de passe ne correspondent pas',
          field: 'password_confirmation'
        })
      }

      // Vérifier la robustesse du mot de passe
      if (password.length < 8) {
        return response.badRequest({ 
          message: 'Le mot de passe doit contenir au moins 8 caractères',
          field: 'password'
        })
      }

      // Regex pour vérifier que le mot de passe contient au moins une lettre majuscule, une lettre minuscule et un chiffre
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!passwordRegex.test(password)) {
        return response.badRequest({
          message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
          field: 'password'
        })
      }

      // Vérifier si l'email existe déjà
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({ 
          message: 'Un utilisateur avec cet email existe déjà',
          field: 'email'
        })
      }

      // Récupérer le rôle utilisateur normal (non-admin)
      const userRole = await UserRole.findBy('role_name', 'User')
      if (!userRole) {
        return response.internalServerError({ message: 'Erreur lors de la récupération des rôles utilisateur' })
      }

      // Générer un token de vérification
      const verificationToken = (await promisify(randomBytes)(32)).toString('hex')

      // Créer l'utilisateur
      const user = await User.create({
        first_name,
        last_name,
        email,
        password,
        role_id: userRole.id,
        email_verified: false,
        verification_token: verificationToken
      })

      // Créer automatiquement un profil pour l'utilisateur
      try {
        // Importer le modèle Profile
        const Profile = (await import('#models/profile')).default
        
        // Créer un profil avec les informations de base
        await Profile.create({
          user_id: user.id,
          name: `${first_name} ${last_name}`.trim(), // Nom complet pour compatibilité
          role: 'Membre', // Rôle par défaut
          p_pic: 'default.jpg', // Image de profil par défaut
          about: '' // Description vide par défaut
        })
        
        console.log(`Profil créé automatiquement pour l'utilisateur ${user.id}`)
      } catch (profileError) {
        console.error('Erreur lors de la création du profil:', profileError)
        // On continue le processus même si la création du profil échoue
      }
      
      // Envoyer l'email de vérification
      try {
        await mail.send((message: any) => {
          message
            .to(email)
            .from('noreply@flapicms.com', "L'équipe FlapiCMS")
            .subject('Vérification de votre adresse email')
            .htmlView('verify_email', { token: verificationToken, first_name })
        })
      } catch (mailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', mailError)
        // En environnement de développement, on peut continuer même si l'email n'est pas envoyé
        // En production, il faudrait gérer cette erreur différemment
      }

      return response.created({
        message: 'Votre compte a été créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error)
      return response.internalServerError({
        message: 'Erreur lors de l\'inscription',
        error: error.message
      })
    }
  }

  /**
   * Vérification de l'email via le token
   */
  public async verifyEmail({ params, response }: HttpContext) {
    try {
      const { token } = params

      // Vérifier que le token existe
      const user = await User.findBy('verification_token', token)
      if (!user) {
        return response.badRequest({ message: 'Lien de vérification invalide ou expiré' })
      }

      // Marquer l'email comme vérifié
      user.email_verified = true
      user.verification_token = null
      await user.save()

      // Construire l'URL avec un paramètre de succès pour la page de connexion
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const loginUrl = `${frontendUrl}/login?accountActivated=true`
      
      // Retourner une réponse avec l'URL de redirection
      return response.ok({ 
        message: 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.',
        redirectTo: loginUrl
      })
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email :', error)
      return response.internalServerError({
        message: 'Erreur lors de la vérification de l\'email',
        error: error.message
      })
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      // Vérifier si l'utilisateur existe
      const user = await User.findBy('email', email)
      if (!user) {
        return response.badRequest({ message: 'Identifiants incorrects' })
      }

      // Vérifier si l'email a été vérifié
      if (!user.email_verified) {
        return response.forbidden({ 
          message: 'Votre email n\'a pas été vérifié. Veuillez vérifier votre boîte de réception pour activer votre compte.',
          needsVerification: true,
          email: user.email
        })
      }

      // Vérifier le mot de passe
      try {
        const token = await User.accessTokens.create(
          await User.verifyCredentials(email, password)
        )
        return response.ok(token)
      } catch (error) {
        return response.badRequest({ message: 'Identifiants incorrects' })
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error)
      return response.internalServerError({
        message: 'Erreur lors de la connexion',
        error: error.message
      })
    }
  }

  /**
   * Déconnexion d'un utilisateur
   */
  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.ok({ message: 'Vous avez été déconnecté avec succès' })
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error)
      return response.internalServerError({
        message: 'Erreur lors de la déconnexion',
        error: error.message
      })
    }
  }

  /**
   * Récupérer l'utilisateur authentifié
   */
  public async me({ auth, response }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!
      
      // Charger le rôle de l'utilisateur
      await user.load('userRole')
      
      return response.ok({ user })
    } catch (error) {
      return response.unauthorized({ message: 'Non authentifié' })
    }
  }

  /**
   * Renvoyer un email de vérification
   */
  public async resendVerificationEmail({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      // Vérifier si l'utilisateur existe
      const user = await User.findBy('email', email)
      if (!user) {
        return response.notFound({ message: 'Utilisateur non trouvé' })
      }

      // Vérifier si l'email a déjà été vérifié
      if (user.email_verified) {
        return response.badRequest({ message: 'Cet email a déjà été vérifié' })
      }

      // Générer un nouveau token de vérification
      const verificationToken = (await promisify(randomBytes)(32)).toString('hex')
      user.verification_token = verificationToken
      await user.save()

      // Construire le lien de vérification
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'
      const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`

      // Envoyer l'email de vérification
      await mail.send((message: any) => {
        message
          .to(email)
          .from('noreply@flapicms.com', "L'équipe FlapiCMS")
          .subject('Vérification de votre adresse email')
          .html(`
            <h1>Vérification de votre adresse email</h1>
            <p>Pour vérifier votre adresse email et activer votre compte, veuillez cliquer sur le lien suivant :</p>
            <p><a href="${verificationUrl}" style="padding: 10px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 5px;">Vérifier mon email</a></p>
            <p>Ou copiez-collez cette URL dans votre navigateur : ${verificationUrl}</p>
            <p>Ce lien expirera dans 24 heures.</p>
            <p>L'équipe FlapiCMS</p>
          `)
      })

      return response.ok({ message: 'Un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.' })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification :', error)
      return response.internalServerError({
        message: 'Erreur lors de l\'envoi de l\'email de vérification',
        error: error.message
      })
    }
  }
}