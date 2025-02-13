import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import UserRole from '#models/user_role'

export default class extends BaseSeeder {
  async run() {
    await UserRole.createMany([
      {
        id: 1,
        role_name: 'Admin',
      },
      {
        id: 2,
        role_name: 'User',
      },
    ])
    await User.createMany([
      {
        role_id: 1,
        email: 'admin@example.com',
        password: '123456',
      },
    ])
  }
}

