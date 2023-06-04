import ApiError from "../Exceptions/ApiError";
import { Request, Response } from "express";
export default function(err: any, req: Request, res: Response, next: Function) {
  console.log(err.message);
  if (err instanceof ApiError) {
    console.log(`${err.status}: ${err.message}`);
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }
  return res.status(500).json({message: 'Непредвиденная ошибка'});
}