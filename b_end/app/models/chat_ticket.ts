import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import ChatMessage from '#models/chat_message'

export default class ChatTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare subject: string

  @column()
  declare status: 'open' | 'closed' | 'pending'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: any

  @hasMany(() => ChatMessage)
  declare messages: any
}