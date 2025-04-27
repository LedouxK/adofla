import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    // Traduction des descriptions des forfaits d'abonnement en français
    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET description = ? WHERE id = ?`,
      ['Support et infrastructure dédiés à votre entreprise.', 3] // Mid-Tier Plan
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET description = ? WHERE id = ?`,
      ['Support et infrastructure dédiés à votre entreprise avec service premium.', 5] // Premium Plan
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET description = ? WHERE id = ?`,
      ['Le forfait parfait pour démarrer avec notre produit.', 6] // Free Plan
    )

    // Mise à jour des noms des forfaits si nécessaire
    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ? WHERE id = ?`,
      ['Forfait Intermédiaire', 3]
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ? WHERE id = ?`,
      ['Forfait Premium', 5]
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ? WHERE id = ?`,
      ['Forfait Gratuit', 6]
    )
  }

  async down() {
    // Restaurer les valeurs originales en anglais en cas de rollback
    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ?, description = ? WHERE id = ?`,
      ['Mid-Tier Plan', 'Support and infrastructure dedicated to your company.', 3]
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ?, description = ? WHERE id = ?`,
      ['Premium Plan', 'Dedicated support and infrastructure for your company.', 5]
    )

    await this.db.rawQuery(
      `UPDATE ${this.tableName} SET name = ?, description = ? WHERE id = ?`,
      ['Free Plan', "The perfect plan if you're just getting started with our product.", 6]
    )
  }
}