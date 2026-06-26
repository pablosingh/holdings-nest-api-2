import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { CriptosModule } from './criptos/criptos.module';
import { HoldingsModule } from './holdings/holdings.module';
import { OperationsModule } from './operations/operations.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [DbModule, UsersModule, CriptosModule, HoldingsModule, OperationsModule, AuthModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
