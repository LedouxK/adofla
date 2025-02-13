import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.decimal('price', 10, 2).notNullable()
      // table.integer('duration_value').notNullable() // Numeric value (e.g., 1, 2, 10)
      // table.string('duration_unit').notNullable() // Unit (e.g., day, month, year)
      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}