import jwt from "jsonwebtoken";
import { UserSimpleDTO } from "../dto/user.dto";
import dataSource from "../db/dataSource";
import { Employee } from "../db/models/Employee";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key"
export function getUserFromToken(token: string): Promise<UserSimpleDTO | null> {
  if (!token) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    const formatedToken = token.replace("Bearer ", "").replace("bearer ", "");
    jwt.verify(
      formatedToken,
      AUTH_SECRET_KEY,
      async (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          const user = await dataSource
            .getRepository(Employee)
            .findOne({ where: { id: decoded.userId } });
          resolve({
            id: user?.id,
            email: user?.email,
            role: user?.role
          });
        }
      }
    );
  });
}
