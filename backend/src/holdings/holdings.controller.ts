import { Controller, Get, Param, Query } from '@nestjs/common';
import { HoldingsService } from './holdings.service';

@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  // @Post()
  // create(@Body() dto: CreateHoldingDto) {
  //   return this.holdingsService.create(dto);
  // }

  @Get()
  findAll(@Query('user_id') user_id?: string) {
    return this.holdingsService.findAll(user_id ? +user_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holdingsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateHoldingDto) {
  //   return this.holdingsService.update(+id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.holdingsService.remove(+id);
  // }
}
