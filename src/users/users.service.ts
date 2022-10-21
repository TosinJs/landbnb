import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    ){}

  async create(createUserDto: CreateUserDto) {
    let { username, email, age, country, personalDesc, profilePicture } = createUserDto
    age = Number(age)
    const user = { username, email, age, country, personalDesc, profilePicture }
    // try {
    //   const response = await fetch("localhost:3000", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     mode: "cors",
    //     body: JSON.stringify(createUserDto)
    //   })
    //   user = await response.json()
    // } catch (error) {
    //   if (error instanceof HttpException) {
    //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    //   }
    //   throw error
    // }
    return this.prisma.user.create({
      data: user
    })
  }

  async findAll() {
    const users = await this.prisma.user.findMany()
    if (users.length == 0) {
      throw new HttpException("Users not found", HttpStatus.NOT_FOUND)
    }
    return users
  }

  async findOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username
      }
    })
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto
    })
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id
      }
    })
  }

  async refresh(req: Request) {
    try {
      let tokenString = req.headers.authorization
      if (!tokenString) {
          throw new HttpException("No ID Token", HttpStatus.UNAUTHORIZED)
      }
      const tokenArray = tokenString.split(" ")
      return this.httpService
        .post("http://localhost:3000/users/refresh",{
            refreshToken: tokenArray[1],
          })
        .pipe(map(res => res.data))
        .pipe(catchError(() => {
          throw new HttpException("Invalid User Credentials", HttpStatus.UNAUTHORIZED)
        }))
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }
  }
}
