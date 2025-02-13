import { DateTime } from 'luxon'

import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Subscription from '#models/subscription'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class UserSubscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare subscription_id: number

  @column()
  declare start_date: Date

  @column()
  declare end_date: Date

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  declare user: HasOne<typeof User>
  
  @hasOne(() => Subscription, {
    localKey: 'subscription_id',
    foreignKey: 'id',
  })
  declare subscription: HasOne<typeof Subscription>

}