import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService){}

  async create(createListingDto: CreateListingDto) {
    const listing = {
      ownerId: createListingDto.ownerId,
      cost: createListingDto.cost,
      title: createListingDto.title,
      description: createListingDto.description,
      maxGuests: createListingDto.maxGuests,
      numOfBeds: createListingDto.numOfBeds,
      country: createListingDto.country,
      City: createListingDto.city,
      images: createListingDto.images,
    }
    return this.prisma.listing.create({
      data: listing
    })
  }

  async findAll(user?: any, id?: number) {
    const listings = await this.prisma.listing.findMany({
      ...(id && {where: { ownerId: id }}),
      include: {
        tenants: true,
        reviews: true,
      }
    })
    if (listings.length < 1) {
      throw new HttpException("listings not found", HttpStatus.NOT_FOUND)
    }
    return { listings: listings , ...(user && { user: user}) }
  }

  async findAllForUser(id: number) {
    const listings = await this.prisma.listing.findMany({
      where: 
        { ownerId: id },
      include: {
        tenants: true,
        reviews: true,
      }
    })
    if (listings.length < 1) {
      throw new HttpException("listings not found", HttpStatus.NOT_FOUND)
    }
    return { listings: listings }
  }

  async findMyRentals(id: number) {
    const listings = await this.prisma.listing.findMany({
      where: {
        tenants: {
          some: {
            userId: id
          }
        }
      },
    })
    if (listings.length < 1) {
      throw new HttpException("listings not found", HttpStatus.NOT_FOUND)
    }
    return { listings: listings }
  }

  async findOne(id: number) {
    const listing = this.prisma.listing.findUnique({
      where: {
        id: id
      }
    })
    if (!listing) {
      throw new HttpException("listing not found", HttpStatus.NOT_FOUND)
    }
    return listing
  }

  async update(id: number, updateListingDto: UpdateListingDto) {
    return this.prisma.listing.update({
      where: {
        id: id
      },
      data: updateListingDto
    })
  }

  async remove(id: number) {
    return this.prisma.listing.delete({
      where: {
        id: id
      }
    })
  }

  async rent(id: number, userId: number) {
    const listing = await this.prisma.listing.findUniqueOrThrow({
      where: {
        id: id,
      }
    })
    if (!listing.available || listing.ownerId == userId) {
      throw new HttpException("This listing is not available", HttpStatus.FORBIDDEN)
    }
    return this.prisma.listing.update({
      where: {
        id: id
      }, 
      data: {
        available: false,
        tenants: {
          create: [
            {
              user: {
                connect: {
                  id: userId
                }
              },
              vacateDate: new Date()
            }
          ]
        }
      }
    })
  }

  async review(id: number, createReviewDto: CreateReviewDto) {
    const listing = await this.prisma.listing.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    if (listing.ownerId == createReviewDto.authorId) {
      throw new HttpException("This listing is not available", HttpStatus.FORBIDDEN)
    }
    return this.prisma.listing.update({
      where: {
        id: id
      },
      data: {
        reviews: {
          create: [
            {
              author: {
                connect: {
                  id: createReviewDto.authorId
                }
              },
              review: createReviewDto.review,
              timestamp: new Date(),
            }
          ]
        }
      }
    })
  }
}
