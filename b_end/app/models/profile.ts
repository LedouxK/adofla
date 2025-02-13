import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'

import User from '#models/user'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare name: string

  @column()
  declare p_pic: string

  @column()
  declare role: string

  @column()
  declare about: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

    @hasOne(() => User, {
      localKey: 'user_id',
      foreignKey: 'id',
    })
    declare user: HasOne<typeof User>
}