import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Référence à l'utilisateur qui a créé le ticket
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      // Sujet du ticket
      table.string('subject').notNullable()
      
      // Statut du ticket: 'open', 'closed', 'pending'
      table.enum('status', ['open', 'closed', 'pending']).defaultTo('open')

      // Horodatage
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}