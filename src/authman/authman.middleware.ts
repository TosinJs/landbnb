import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

enum Role {
    basic = "BASIC",
    admin = "ADMIN",
    owner = "OWNER",
  } 
export interface RequestWithUser extends Request {
    user: any,
    roles?: Role[],
}

function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload: any) => {
            if (err) {
                reject(err)
                return
            }
            const returnPayload = { id: payload.id, username: payload.username }
            resolve(returnPayload)
        })
    })
}

export async function verifyIdToken(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        let tokenString = req.headers.authorization
        if (!tokenString) {
            throw new HttpException("No ID Token", HttpStatus.UNAUTHORIZED)
        }
        const tokenArray = tokenString.split(" ")
        const user = await verifyToken(tokenArray[1])
        req.user = user
        next()
    } catch (error) {
        if (error.message == "jwt expired") {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
        }
        next()
    }
}

export async function verifyAccessToken(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        let tokenString = req.headers.authorization
        if (!tokenString) {
            throw new HttpException("Unauthorized, Auth Credentials Required", HttpStatus.FORBIDDEN)
        }
        const tokenArray = tokenString.split(" ")
        const user = await verifyToken(tokenArray[1])
        if (!user) {
            throw new HttpException("Unauthorized, Auth Credentials Required", HttpStatus.FORBIDDEN)
        }
        if (user.id == req.params?.id) {
            req.roles.push(Role.owner)
        }
        req.roles = [Role.basic]
        next()
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN)
    }
}