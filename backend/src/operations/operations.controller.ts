import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  create(@Body() dto: CreateOperationDto) {
    return this.operationsService.create(dto);
  }

  @Get()
  findAll(
    @Query('cripto_id') cripto_id?: string,
    @Query('holding_id') holding_id?: string,
  ) {
    return this.operationsService.findAll(
      cripto_id ? +cripto_id : undefined,
      holding_id ? +holding_id : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOperationDto) {
    return this.operationsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsService.remove(+id);
  }
}
