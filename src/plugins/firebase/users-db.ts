import { User } from '@/interfaces/authentication.interface'
import GenericDB from './generic-db'

export default class UsersDB extends GenericDB<User> {
  constructor() {
    super('users')
  }
}
