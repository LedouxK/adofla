import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  from: {
    address: 'henrysommeilflapicms@gmail.com',
    name: 'Sub Manage',
  },

  mailers: {
    smtp: transports.smtp({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,

      auth: {
        type: 'login', // Cette propriété est requise
        user: 'henrysommeilflapicms@gmail.com',
        pass: env.get('SMTP_PASSWORD') || '',
      },

      tls: {},
      ignoreTLS: false,
      requireTLS: false,
      pool: false,
      maxConnections: 5,
      maxMessages: 100,
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
