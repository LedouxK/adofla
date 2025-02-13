import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    // Ensure the user is authenticated
    await ctx.auth.authenticate()

    // Check if the user role_id is 1 (Admin)
    if (ctx.auth.user && ctx.auth.user.role_id === 1) {
      // Proceed to the next middleware or controller
      return next()
    }

    // Deny access if not admin
    return ctx.response.unauthorized({
      message: 'Access denied. Admins only.',
    })
  }
}
