import Subscription from '#models/subscription';
import UserSubscription from '#models/user_subscription';
import type { HttpContext } from '@adonisjs/core/http'
import { request } from 'http';

export default class UserSubscriptionsController {
  async allActiveSubscriptions({ auth, request, response }: HttpContext) {
    try {
      // Get the authenticated user
      const user = auth.user;

      var filter_email = request.input('email')
      var filter_sub_id = request.input('sub_id')
      var filter_status = request.input('status')

      const page = request.input('page', 1);
    const per_page = request.input('per_page');

      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' });
      }

      // Fetch active subscriptions for the user
        var query = UserSubscription.query()
        .preload('subscription')
        .preload('user');

        // Apply filter based on email if provided
        if (filter_email) {
        query = query.whereHas('user', (userQuery) => {
          userQuery.where('email', 'like', `%${filter_email}%`);
        });
        }
        if (filter_sub_id) {
          query = query.where('subscription_id', filter_sub_id);
          }
          if (filter_status) {
            query = query.where('status', filter_status);
            }

        // Execute the query
        var subscriptions = await query.paginate(page, per_page);

      // Return the subscriptions
      return response.ok(subscriptions);
    } catch (error) {
      console.error(error);
      return response.internalServerError({ message: 'Unable to fetch subscriptions' });
    }
  }
    async activeSubscriptions({ auth, response }: HttpContext) {
        try {
          // Get the authenticated user
          const user = auth.user;
    
          if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
    
          // Fetch active subscriptions for the user
          const subscriptions = await UserSubscription.query()
            .preload('subscription')
            .where('user_id', user.id)
            .where('status', 'active')
            .orderBy('end_date', 'asc');
    
          // Return the subscriptions
          return response.ok(subscriptions);
        } catch (error) {
          console.error(error);
          return response.internalServerError({ message: 'Unable to fetch subscriptions' });
        }
      }
    async subsscriptionHistory({ auth, response }: HttpContext) {
        try {
          // Get the authenticated user
          const user = auth.user;
    
          if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
    
          // Fetch active subscriptions for the user
          const subscriptions = await UserSubscription.query()
            .preload('subscription')
            .where('user_id', user.id)
            .where('status', 'inactive')
            .orderBy('id', 'desc');
    
          // Return the subscriptions
          return response.ok(subscriptions);
        } catch (error) {
          console.error(error);
          return response.internalServerError({ message: 'Unable to fetch subscriptions' });
        }
      }
    // async updateSubscription({ request, response }: HttpContext) {
    //     try {
    //         const data:any = request.only(['new_sub_id, old_sub_id']);

    //         this.unsubscribe({subscription_id: data['old_sub_id']})
    //         this.subscribe({subscription_id: data['new_sub_id']})
            
    //         return response.status(200).json({
    //             success: true,
    //             message: 'Modified',
    //         });
    //     } catch (error) {
    //         console.error('Subscription error:', error);
    //         return response.status(500).json({
    //             success: false,
    //             message: 'An error occurred while processing the subscription',
    //         });
    //     }
    // }
    async updateSubscription({auth, request, response }: HttpContext) {
        try {
            const user = auth.getUserOrFail()
          // Extract `new_sub_id` and `old_sub_id` from the request body
          const { new_sub_id, old_sub_id, type, user_id } = request.only(['new_sub_id', 'old_sub_id', 'type', 'user_id']);
      
          var userId = user_id ? user_id : user.id
          // Validate that both IDs are provided
          if (!new_sub_id || !old_sub_id || !type) {
            return response.status(400).json({
              success: false,
              message: 'Both new_sub_id and old_sub_id and type are required.',
            });
          }
      
          // Find the subscription
          const subscrip = await UserSubscription.query()
            .where('subscription_id', old_sub_id)
            .where('user_id', userId)
            .where('status', 'active')
            .first();
    
          if (!subscrip) {
            return response.notFound({ message: 'Subscription not found' });
          }
    
          subscrip.status = 'inactive';
          await subscrip.save();


          //subscribe
          const plan = await Subscription.find(new_sub_id);
      
          var day = 0;
            if (type == 'day') {
                day = 1
            }
            else if (type == 'month') {
                day = 1 * 30
            }
            else if (type == 'year') {
                day = 1 * 365
            }

            // Create or update the subscription for the user
            const subscription = await UserSubscription.create(
                {
                    user_id: userId,
                    subscription_id: new_sub_id,
                    start_date: new Date(),
                    end_date: new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000),
                    status: 'active',
                }
            );
      
          // Return success response
          return response.status(200).json({
            success: true,
            message: 'Subscription updated successfully.',
          });
        } catch (error) {
          console.error('Subscription error:', error);
      
          return response.status(500).json({
            success: false,
            message: 'An error occurred while updating the subscription.',
          });
        }
      }
      
    async subscribe({ request, auth, response }: HttpContext) {
        try {
            // Ensure the user is authenticated
            const user = auth.getUserOrFail();
            
            // Validate the incoming request
            const { subscription_id, type, user_id } = request.only(['subscription_id', 'type', 'user_id']);

            var userId = user_id > 0 ? user_id : user.id;

            if (!subscription_id) {
                return response.status(400).json({
                    success: false,
                    message: 'Plan ID is required',
                });
            }
            
            const isSubscribed = await UserSubscription.query().where('user_id', userId)
            .where('status', 'active').first();

            if(isSubscribed)
            {
                return response.status(200).json({
                    success: false,
                    message: 'Already Subscribed!',
                    data: isSubscribed
                });
            }
            // Check if the plan exists
            const plan = await Subscription.find(subscription_id);
            if (!plan) {
                return response.status(404).json({
                    success: false,
                    message: 'Plan not found',
                });
            }

            var day = 0;
            if (type == 'day') {
                day = 1
            }
            else if (type == 'month') {
                day = 1 * 30
            }
            else if (type == 'year') {
                day = 1 * 365
            }

            // Create or update the subscription for the user
            const subscription = await UserSubscription.create(
                {
                    user_id: userId,
                    subscription_id: subscription_id,
                    start_date: new Date(),
                    end_date: new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000),
                    status: 'active',
                }
            );

            return response.status(200).json({
                success: true,
                message: 'Subscription successful',
                subscription,
            });
        } catch (error) {
            console.error('Subscription error:', error);
            return response.status(500).json({
                success: false,
                message: 'An error occurred while processing the subscription',
            });
        }
    }
    async unsubscribe({ auth, request, response }: HttpContext) {
        try {
          // Ensure the user is authenticated
          const user = auth.user;
          if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
    
          // Get the subscription ID from the request
          const subscriptionId = request.input('subscriptionId');
          const user_id = request.input('user_id');

          var userId = user_id ? user_id : user.id

          if (!subscriptionId) {
            return response.badRequest({ message: 'Subscription ID is required' });
          }
    
          // Find the subscription
          const subscription = await UserSubscription.query()
            .where('id', subscriptionId)
            .where('user_id', userId)
            .first();
    
          if (!subscription) {
            return response.notFound({ message: 'Subscription not found' });
          }
    
          subscription.status = 'inactive';
          await subscription.save();
    
          return response.ok({ message: 'Successfully unsubscribed', subscription });
        } catch (error) {
          console.error(error);
          return response.internalServerError({ message: 'Unable to unsubscribe' });
        }
      }
}