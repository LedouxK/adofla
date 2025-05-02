import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import ChatTicket from '#models/chat_ticket'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ticket_id: number

  @column()
  declare user_id: number

  @column()
  declare is_admin: boolean

  @column()
  declare message: string

  @column()
  declare read: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: any

  @belongsTo(() => ChatTicket)
  declare ticket: any
}