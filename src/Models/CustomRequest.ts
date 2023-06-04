import { Request } from "express";
import User from "./User";

export default interface CustomRequest extends Request {
  user: User
  workspace?: string
}