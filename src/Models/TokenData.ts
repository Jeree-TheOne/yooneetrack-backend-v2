import Token from "./Token";
import User from "./User";

export default interface TokenData extends Token {
  user: User;
}