import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import ResetPassword from '#models/password_reset'

import mail from '@adonisjs/mail/services/main'
import { randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import Hash from '@adonisjs/core/services/hash'

export default class UsersController {
  public async changePassword({ request, response, auth }: HttpContext) {
    try {
      // Extract current and new passwords from the request
      const { currentPassword, newPassword, confirmPassword } = request.only([
        'currentPassword',
        'newPassword',
        'confirmPassword',
      ])

      // Get the authenticated user
      const user = auth.user

      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // Verify the current password
      const isPasswordValid = await Hash.verify(user.password, currentPassword)
      if (!isPasswordValid) {
        return response.badRequest({ message: 'Current password is incorrect' })
      }

      // Check if the new password matches the confirmation password
      if (newPassword !== confirmPassword) {
        return response.badRequest({
          message: 'New password and confirmation password do not match',
        })
      }

      // Update the user's password
      user.password = newPassword
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
    try {
      const email = request.input('email')

      // Check if user exists
      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({ message: 'Email not found' })
      }

      // Generate Reset Token
      const random = await promisify(randomBytes)(32)
      const token = random.toString('hex')

      // Create reset token in database (no need to store the result)
      await ResetPassword.create({ email, token })

      // Send Reset Email
      await mail.send((message) => {
        message.to(email).subject('Password Reset Request').htmlView('reset_password', { token })
      })

      return response.json({ message: 'Password reset email sent' })
    } catch (error) {
      console.error('Reset email error:', error)
      return response.status(500).json({
        message: 'Failed to send reset email',
        error: error.message,
      })
    }
  }

  public async resetPassword({ request, response }: HttpContext) {
    try {
      const { token, password } = request.only(['token', 'password'])

      // Validate token
      const tokenRecord = await ResetPassword.query().where('token', token).first()

      if (!tokenRecord) {
        return response.status(400).json({ message: 'Invalid or expired token' })
      }

      // Update user password
      const user = await User.findBy('email', tokenRecord.email)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }

      user.password = password
      await user.save()

      // Delete the token
      await ResetPassword.query().where('token', token).delete()

      return response.json({ message: 'Password reset successfully' })
    } catch (error) {
      console.error('Reset password error:', error)
      return response.status(500).json({
        message: 'Failed to reset password',
        error: error.message,
      })
    }
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
    try {
      const { email, password, roleId } = request.only(['email', 'password', 'roleId'])
      const user = await User.create({ email, password, role_id: roleId })

      return response.created(user)
    } catch (error) {
      console.error('User creation error:', error)
      return response.status(500).json({
        message: 'Failed to create user',
        error: error.message,
      })
    }
  }

  // Get a list of all users
  public async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage')

    if (perPage > 0) {
      return await User.query().preload('userRole').paginate(page, perPage)
    }

    return await User.query().preload('userRole')
  }

  // Get a specific user by ID
  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return user
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  // Update a user's email or password
  public async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      user.merge(request.only(['email', 'password', 'roleId']))
      await user.save()
      return user
    } catch (error) {
      console.error('User update error:', error)
      return response.status(500).json({
        message: 'Failed to update user',
        error: error.message,
      })
    }
  }

  // Delete a user
  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }
}
