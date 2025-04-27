import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_subscriptions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('type', ['monthly', 'yearly'])
        .notNullable()
        .defaultTo('monthly')
        .after('subscription_id')

      table.decimal('price_paid', 10, 2).notNullable().defaultTo(0).after('type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
      table.dropColumn('price_paid')
    })
  }
}
