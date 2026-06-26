import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { rows } = await this.db.query(
      'SELECT id, name, email, password FROM "user" WHERE email = $1',
      [dto.email],
    );

    if (!rows.length) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = rows[0];
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: { id: user.id, name: user.name, email: user.email } };
  }
}
