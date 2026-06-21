import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { buildUpdate } from '../db/build-update';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateUserDto) {
    const { rows } = await this.db.query(
      'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [dto.name, dto.email, dto.password],
    );
    return rows[0];
  }

  async findAll() {
    const { rows } = await this.db.query('SELECT id, name, email FROM "user" ORDER BY id');
    return rows;
  }

  async findOne(id: number) {
    const { rows } = await this.db.query('SELECT id, name, email FROM "user" WHERE id = $1', [id]);
    if (!rows.length) throw new NotFoundException(`User #${id} not found`);
    return rows[0];
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const q = buildUpdate('"user"', id, dto);
    if (!q) return this.findOne(id);
    const { rows } = await this.db.query(
      q.text.replace('RETURNING *', 'RETURNING id, name, email'),
      q.values,
    );
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM "user" WHERE id = $1', [id]);
    return { deleted: true };
  }
}
