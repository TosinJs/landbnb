import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { RentListingDto } from './dto/rent-listing.dto';
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

  async findAll() {
    const listings = await this.prisma.listing.findMany({
      include: {
        tenants: true,
        reviews: true,
      }
    })
    if (listings.length < 1) {
      throw new HttpException("listings not found", HttpStatus.NOT_FOUND)
    }
    return listings
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

  async rent(id: number, rentListingDto: RentListingDto) {
    const listing = await this.prisma.listing.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    if (!listing.available || listing.ownerId == rentListingDto.userId) {
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
                  id: rentListingDto.userId
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
