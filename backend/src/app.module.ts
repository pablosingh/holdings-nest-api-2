import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { CriptosModule } from './criptos/criptos.module';
import { HoldingsModule } from './holdings/holdings.module';
import { OperationsModule } from './operations/operations.module';

@Module({
  imports: [DbModule, UsersModule, CriptosModule, HoldingsModule, OperationsModule],
})
export class AppModule {}
