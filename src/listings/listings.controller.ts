import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { User } from 'src/decorators/decorators';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Roles } from 'src/decorators/roles.decorator';

enum Role {
  basic = "BASIC",
  admin = "ADMIN",
  owner = "OWNER",
}

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @Roles(Role.basic)
  create(@Body() createListingDto: CreateListingDto) {
    try {
      return this.listingsService.create(createListingDto);
    } catch (error) {
      console.log(error)
    }
  }

  @Get()
  findAll(@User() user?: any) {
    return this.listingsService.findAll(user);
  }

  @Get("profile")
  @Roles(Role.basic)
  @Roles(Role.owner)
  findAllForUser(@Query('id') id: string) {
    return this.listingsService.findAllForUser(+id);
  }

  @Get("profile/rentals")
  @Roles(Role.basic)
  @Roles(Role.owner)
  findMyRentals(@Query('id') id: string) {
    return this.listingsService.findMyRentals(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.basic)
  @Roles(Role.owner)
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(+id, updateListingDto);
  }

  @Delete(':id')
  @Roles(Role.basic)
  @Roles(Role.owner)
  remove(@Param('id') id: string) {
    return this.listingsService.remove(+id);
  }

  @Post("/rent/:id")
  @Roles(Role.basic)
  rent(@Param("id") id: string, @Query("userId") userId: string) {
    return this.listingsService.rent(+id, +userId)
  }

  @Post("/reviews/:id")
  @Roles(Role.basic)
  review(@Param("id") id: string, @Body() createReviewDto: CreateReviewDto) {
    return this.listingsService.review(+id, createReviewDto)
  }
}
