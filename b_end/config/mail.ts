import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * A static address for the "from" property. It will be
   * used unless an explicit from address is set on the
   * Email
   */
  from: {
    address: 'noreply@example.com',
    name: 'Sub Manage',
  },

  /**
   * A static address for the "reply-to" property. It will be
   * used unless an explicit replyTo address is set on the
   * Email
   */
  replyTo: {
    address: '',
    name: '',
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or the same transport with a different
   * options.
   */
  
    mailers: {
      smtp: transports.smtp({
        host: env.get('SMTP_HOST'),
        port: env.get('SMTP_PORT'),
        secure: false,
  
        auth: {
          type: 'login',
          user: env.get('SMTP_USERNAME'),
          pass: env.get('SMTP_PASSWORD')
        },

        secure: true, // Set to true for SSL
        debug: true, // Enable debug logging
        logger: true, // Enable detailed logs
  
        tls: {},
  
        ignoreTLS: false,
        requireTLS: false,
  
        pool: false,
        maxConnections: 5,
        maxMessages: 100,
      })
    }
  
  
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}