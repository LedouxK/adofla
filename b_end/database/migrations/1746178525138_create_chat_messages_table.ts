import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Référence au ticket auquel ce message est associé
      table.integer('ticket_id').unsigned().references('id').inTable('chat_tickets').onDelete('CASCADE')
      
      // Référence à l'utilisateur qui a envoyé le message
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      // Indique si le message provient d'un administrateur
      table.boolean('is_admin').defaultTo(false)
      
      // Contenu du message
      table.text('message').notNullable()
      
      // Indique si le message a été lu
      table.boolean('read').defaultTo(false)

      // Horodatage
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}