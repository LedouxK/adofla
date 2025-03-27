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
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // Verify the current password
      const isPasswordValid = await Hash.verify(user.password, current_password)
      if (!isPasswordValid) {
        return response.badRequest({ message: 'Current password is incorrect' })
      }

      // Check if the new password matches the confirmation password
      if (new_password !== confirm_password) {
        return response.badRequest({
          message: 'New password and confirmation password do not match',
        })
      }

      // Update the user's password
      user.password = new_password
      await user.save()

      // Return success response
      return response.ok({ message: 'Password changed successfully' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Failed to change password',
        error: error.message,
      })
    }
  }
  public async sendResetEmail({ request, response }: HttpContext) {
    const email = request.input('email')

    // Check if user exists
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({ message: 'Email not found' })
    }

    // Generate Reset Token
    const random = await promisify(randomBytes)(32)
    const token = random.toString('hex')

    const password_resets = await ResetPassword.create({ email, token })

    // Send Reset Email
    await mail.send((message: any) => {
      message.to(email).subject('Password Reset Request').htmlView('reset_password', { token })
    })

    return response.json({ message: 'Password reset email sent' })
  }

  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    // Validate token
    const tokenRecord = await ResetPassword.query().where('token', token).first()

    if (!tokenRecord) {
      return response.status(400).json({ message: 'Invalid or expired token' })
    }

    // Update user password
    const user = await User.findBy('email', tokenRecord.email)
    if (user) {
      user.password = password
      await user.save()
    }

    // Delete the token
    await ResetPassword.query().where('token', token).delete()

    return response.json({ message: 'Password reset successfully' })
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

  // Create a new user
  public async store({ request, response }: HttpContext) {
    const { email, password, role_id } = request.only(['email', 'password', 'role_id'])
    const user = await User.create({ email, password, role_id })

    return response.created(user)
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
