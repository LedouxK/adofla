// app/Controllers/Http/PaymentController.ts
import { HttpContext } from '@adonisjs/core/http'

import Stripe from 'stripe';

const { STRIPE_SECRET_KEY } = process.env;

// Ensure STRIPE_SECRET_KEY is defined, or throw an error if not.
if (!STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is not defined in the environment variables.');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

// export default stripe;

export default class PaymentController {

    public async sessions({ request, response }: HttpContext) {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Node.js and Express book'
                        },
                        unit_amount: 50 * 100
                    },
                    quantity: 1
                }           
            ],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['FR']
            },
            success_url: `http://localhost:3333/api/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3333/api/cancel`
        })
    
        // response.redirect(session.url)
        response.status(200).send(session.url);
      }
  // Create a Payment Intent
  public async createCustomer({ request, response }: HttpContext) {
        try {
            const data = request.only(['name', 'email'])
            const customer = await stripe.customers.create(data);
    
            response.status(200).send(customer);
    
        } catch (error) {
            response.status(400).send({success:false,msg:error.message});
        }
    
  }
  public async addNewCard({ request, response }: HttpContext) {
    try {

        const { customer_id, card_Name, card_ExpYear, card_ExpMonth, card_Number, card_CVC } = 
        request.only(['customer_id', 'card_Name', 'card_ExpYear', 'card_ExpMonth', 'card_Number', 'card_CVC' ])
        

        const card_token = await stripe.tokens.create({
            card:{
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        response.status(200).send(card_token);

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });

        response.status(200).send({ card: card.id });

    } catch (error) {
        response.status(400).send({success:false,msg:error.message});
    }

}
public async createCharges({ request, response }: HttpContext) {
    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'tester@gmail.com',
            amount: parseInt(request.body.amount)*100, //amount*100
            currency:'INR',
            card: request.body.card_id,
            customer: request.body.customer_id
        });

        response.status(200).send(createCharge);

    } catch (error) {
        response.status(400).send({success:false,msg:error.message});
    }
}
}
