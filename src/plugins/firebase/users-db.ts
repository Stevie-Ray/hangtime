import { IUser } from '@/interfaces/user.interface'
import GenericDB from './generic-db'

export default class UsersDB extends GenericDB<IUser> {
  constructor() {
    super('users')
  }
}
