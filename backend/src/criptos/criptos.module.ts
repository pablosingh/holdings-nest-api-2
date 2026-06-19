import { Module } from '@nestjs/common';
import { CriptosService } from './criptos.service';
import { CriptosController } from './criptos.controller';

@Module({
  controllers: [CriptosController],
  providers: [CriptosService],
})
export class CriptosModule {}
