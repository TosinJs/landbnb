import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto
    const user = { username, email }
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

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
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
}
