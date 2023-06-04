import User from './User'

export default interface UserWithPassword extends User {
  password: string;
}