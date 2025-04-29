// File: app/Controllers/Http/UserSubscriptionsController.ts

import { DateTime } from 'luxon'
import type { HttpContextContract } from '@adonisjs/core/build/standalone'
import Subscription from '#models/subscription'
import UserSubscription from '#models/user_subscription'
import User from '#models/user'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class UserSubscriptionsController {
  public async allActiveSubscriptions({ auth, request, response }: HttpContextContract) {
    await auth.authenticate()

    const filterEmail = request.input('email')
    const filterSubId = request.input<number>('sub_id')
    const filterStatus = request.input<string>('status')
    const page = request.input<number>('page', 1)
    const perPage = request.input<number>('per_page', 10)

    let query = UserSubscription.query().preload('subscription').preload('user')

    if (filterEmail) {
      query = query.whereHas('user', (uq: ModelQueryBuilderContract<typeof User>) => {
        uq.where('email', 'like', `%${filterEmail}%`)
      })
    }
    if (filterSubId) {
      query = query.where('subscription_id', filterSubId)
    }
    if (filterStatus) {
      query = query.where('status', filterStatus)
    }

    const subscriptions = await query.paginate(page, perPage)
    return response.ok(subscriptions)
  }

  public async activeSubscriptions({ auth, response }: HttpContextContract) {
    await auth.authenticate()
    const userId = auth.user!.id

    const subscriptions = await UserSubscription.query()
      .preload('subscription')
      .where('user_id', userId)
      .where('status', 'active')
      .orderBy('end_date', 'asc')

    return response.ok(subscriptions)
  }

  public async subscriptionHistory({ auth, response }: HttpContextContract) {
    await auth.authenticate()
    const userId = auth.user!.id

    const subscriptions = await UserSubscription.query()
      .preload('subscription')
      .where('user_id', userId)
      .where('status', 'inactive')
      .orderBy('end_date', 'desc')

    return response.ok(subscriptions)
  }

  public async subscribe({ request, auth, response }: HttpContextContract) {
    const user = await auth.getUserOrFail()
    const subscriptionId = request.input<number>('subscription_id')
    let type = request.input<string>('type')
    
    // Standardiser le format du type (accepter à la fois month/year et monthly/yearly)
    if (type === 'month') type = 'monthly'
    if (type === 'year') type = 'yearly'

    if (!subscriptionId || !['monthly', 'yearly'].includes(type)) {
      return response.badRequest({
        message: 'subscription_id et type (monthly|yearly ou month|year) sont requis.',
      })
    }

    const existing = await UserSubscription.query()
      .where('user_id', user.id)
      .where('status', 'active')
      .first()

    // Si l'utilisateur a déjà un abonnement actif, on le désactive avant d'en créer un nouveau
    if (existing) {
      // Si l'utilisateur essaie de s'abonner au même forfait qu'il a déjà
      if (existing.subscription_id === subscriptionId && existing.type === type) {
        return response.badRequest({ 
          message: 'Vous êtes déjà abonné à ce forfait.' 
        })
      }

      // Désactiver l'ancien abonnement
      existing.status = 'inactive'
      await existing.save()
    }

    const plan = await Subscription.find(subscriptionId)
    if (!plan) {
      return response.notFound({ message: 'Plan non trouvé.' })
    }

    const months = type === 'yearly' ? 12 : 1
    const pricePaid = type === 'yearly' ? Number((plan.price * 12 * 0.8).toFixed(2)) : plan.price

    const startDate = DateTime.now()
    const endDate = startDate.plus({ months })

    const userSub = await UserSubscription.create({
      user_id: user.id,
      subscription_id: subscriptionId,
      type: type,
      price_paid: pricePaid,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    })

    // Indiquer si c'était un changement d'abonnement ou un nouvel abonnement
    return response.ok({ 
      success: true, 
      subscription: userSub,
      changed: existing ? true : false 
    })
  }

  public async updateSubscription({ request, auth, response }: HttpContextContract) {
    const user = await auth.getUserOrFail()
    const oldSubId = request.input<number>('old_sub_id')
    const newSubId = request.input<number>('new_sub_id')
    const type = request.input<'monthly' | 'yearly'>('type')

    if (!oldSubId || !newSubId || !['monthly', 'yearly'].includes(type)) {
      return response.badRequest({ message: 'old_sub_id, new_sub_id et type sont requis.' })
    }

    const oldSub = await UserSubscription.query()
      .where('user_id', user.id)
      .where('subscription_id', oldSubId)
      .where('status', 'active')
      .firstOrFail()

    oldSub.status = 'inactive'
    await oldSub.save()

    const plan = await Subscription.find(newSubId)
    if (!plan) {
      return response.notFound({ message: 'Nouveau plan non trouvé.' })
    }

    const months = type === 'yearly' ? 12 : 1
    const pricePaid = type === 'yearly' ? Number((plan.price * 12 * 0.8).toFixed(2)) : plan.price

    const startDate = DateTime.now()
    const endDate = startDate.plus({ months })

    const newSub = await UserSubscription.create({
      user_id: user.id,
      subscription_id: newSubId,
      type: type,
      price_paid: pricePaid,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    })

    return response.ok({ success: true, subscription: newSub })
  }

  public async adminSubscribe({ request, auth, response }: HttpContextContract) {
    // Vérifier l'authentification et les droits d'administrateur
    await auth.authenticate()
    const admin = auth.user
    
    // Vérifier que l'utilisateur est administrateur (role_id === 1)
    if (!admin || admin.role_id !== 1) {
      return response.unauthorized({ message: 'Seuls les administrateurs peuvent attribuer des abonnements.' })
    }

    // Récupérer les paramètres de la requête
    const userId = request.input<number>('user_id')
    const subscriptionId = request.input<number>('subscription_id')
    let type = request.input<string>('type')
    
    // Standardiser le format du type (accepter à la fois month/year et monthly/yearly)
    if (type === 'month') type = 'monthly'
    if (type === 'year') type = 'yearly'

    if (!userId || !subscriptionId || !['monthly', 'yearly'].includes(type)) {
      return response.badRequest({
        message: 'user_id, subscription_id et type (monthly|yearly ou month|year) sont requis.',
      })
    }

    // Vérifier que l'utilisateur existe
    const targetUser = await User.find(userId)
    if (!targetUser) {
      return response.notFound({ message: 'Utilisateur non trouvé.' })
    }

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const existing = await UserSubscription.query()
      .where('user_id', userId)
      .where('status', 'active')
      .first()

    // Si l'utilisateur a déjà un abonnement actif, le désactiver
    if (existing) {
      // Si c'est le même abonnement, renvoyer une erreur
      if (existing.subscription_id === subscriptionId && existing.type === type) {
        return response.badRequest({ 
          message: 'L\'utilisateur est déjà abonné à ce forfait.' 
        })
      }

      // Désactiver l'ancien abonnement
      existing.status = 'inactive'
      await existing.save()
    }

    // Récupérer le plan d'abonnement
    const plan = await Subscription.find(subscriptionId)
    if (!plan) {
      return response.notFound({ message: 'Plan non trouvé.' })
    }

    // Calculer les dates et le prix
    const months = type === 'yearly' ? 12 : 1
    const pricePaid = type === 'yearly' ? Number((plan.price * 12 * 0.8).toFixed(2)) : plan.price

    const startDate = DateTime.now()
    const endDate = startDate.plus({ months })

    // Créer le nouvel abonnement
    const userSub = await UserSubscription.create({
      user_id: userId,
      subscription_id: subscriptionId,
      type: type,
      price_paid: pricePaid,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    })

    return response.ok({ 
      success: true, 
      subscription: userSub,
      changed: existing ? true : false 
    })
  }

  public async unsubscribe({ auth, request, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié.' })
    }

    const subId = request.input<number>('subscriptionId')
    if (!subId) {
      return response.badRequest({ message: 'subscriptionId est requis.' })
    }

    const subscription = await UserSubscription.query()
      .where('id', subId)
      .where('user_id', user.id)
      .firstOrFail()

    subscription.status = 'inactive'
    await subscription.save()

    return response.ok({ success: true, message: 'Désabonnement réussi.' })
  }
}
