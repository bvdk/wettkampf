import crypto from "crypto";
import * as express from "express";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import _ from "lodash";
import passport from "passport";
import * as PasswortJWT from "passport-jwt";
import { CollectionKeys } from "../database";
import { CrudAdapter } from "../database/CrudAdapter";

const JwtStrategy = PasswortJWT.Strategy;
const ExtractJwt = PasswortJWT.ExtractJwt;

export const sha512 = (password, salt) => {
  const hash = crypto.createHmac("sha512", salt);
  /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest("hex");
  return {
    passwordHash: value,
    salt
  };
};

export const genRandomString = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

export default class PassportJSConfig {
  public static init(app: express.Application) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.post(
      "/api/graphql",
      passport.authenticate(["jwt"], { session: false })
    );

    const secret = "BVDK";

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: secret
        },
        (payload: any, next: any) => {
          const user = _.get(payload, "user");
          if (!user) {
            next(new Error("Es wurde keine gültige Session gefunden"), user);
          }
          next(null, user);
        }
      )
    );

    app.post(
      "/api/auth/login",
      express.json(),
      (req: Request, res: Response) => {
        const dbUser = CrudAdapter.find(CollectionKeys.users, {
          username: req.body.username
        });
        if (!dbUser) {
          return res.status(400).json({
            message: "Nutzer wurde nicht gefunden"
          });
        }

        const authInfo = sha512(req.body.password, dbUser.authInfo.salt);
        const success = authInfo.passwordHash === dbUser.authInfo.passwordHash;

        if (!success) {
          res.status(400).json({
            message: "Falsches Passwort"
          });
        } else {
          const token = jwt.sign({ user: dbUser }, secret);
          res.json({
            token,
            user: {
              role: dbUser.role,
              username: dbUser.username
            }
          });
        }
      }
    );
  }
}
