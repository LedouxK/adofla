import { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'

export default class SubscriptionsController {
  public async toModifyListSubscriptions({ request, response }: HttpContext) {
    const id = request.input('id');
    // const subscriptions = await Subscription.query().whereNot('id', id);
    const subscriptions = await Subscription.query();

    return response.json(subscriptions)
  }

  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1);
    const per_page = request.input('per_page');
    const subscriptions = await Subscription.all()
    // const subscriptions = await Subscription.query().paginate(page, per_page)
    return response.json(subscriptions)
  }

  public async store({ request, response }: HttpContext) {
    // const data = request.only(['name', 'price', 'durationValue', 'durationUnit', 'description'])
    const data = request.only(['name', 'price', 'description'])

    const subscription = await Subscription.create(data)
    return response.created(subscription)
  }

  public async show({ params, response }: HttpContext) {
    const subscription = await Subscription.findOrFail(params.id)
    return response.json(subscription)
  }

  public async update({ params, request, response }: HttpContext) {
    const subscription = await Subscription.findOrFail(params.id)
    const data = request.only(['name', 'price', 'description'])
    subscription.merge(data)
    await subscription.save()
    return response.json(subscription)
  }

  public async destroy({ params, response }: HttpContext) {
    const subscription = await Subscription.findOrFail(params.id)
    await subscription.delete()
    return response.json({ message: 'Subscription deleted successfully' })
  }
}
