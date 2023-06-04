export default interface User {
  id: string;
  login: string;
  email: string;
  firstName?: string;
  secondName?: string;
  isBlocked: boolean;
  isPremium: boolean;
  isActivated: boolean;
  createdAt: Date;
  avatar: string;
}