import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { RentListingDto } from './dto/rent-listing.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(+id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(+id);
  }

  @Post("/rent/:id")
  rent(@Param("id") id: string, @Body() rentListingDto: RentListingDto) {
    return this.listingsService.rent(+id, rentListingDto)
  }

  @Post("/reviews/:id")
  review(@Param("id") id: string, @Body() createReviewDto: CreateReviewDto) {
    return this.listingsService.review(+id, createReviewDto)
  }
}
