import { Controller, Get, Param } from '@nestjs/common';
import { CriptosService } from './criptos.service';

@Controller('criptos')
export class CriptosController {
  constructor(private readonly criptosService: CriptosService) {}

  // @Post()
  // create(@Body() dto: CreateCriptoDto) {
  //   return this.criptosService.create(dto);
  // }

  @Get()
  findAll() {
    return this.criptosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criptosService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateCriptoDto) {
  //   return this.criptosService.update(+id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.criptosService.remove(+id);
  // }
}
