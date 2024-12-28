import { IUser } from '@/interfaces/authentication.interface'
import GenericDB from './generic-db'

export default class UsersDB extends GenericDB<IUser> {
  constructor() {
    super('users')
  }
}
