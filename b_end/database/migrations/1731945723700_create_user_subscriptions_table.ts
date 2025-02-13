import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.integer('subscription_id').unsigned().references('id').inTable('subscriptions').onDelete('CASCADE').notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.string('status').defaultTo('active');

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}