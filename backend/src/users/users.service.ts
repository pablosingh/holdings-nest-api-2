import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
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
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.name !== undefined) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.email !== undefined) { fields.push(`email = $${idx++}`); values.push(dto.email); }
    if (dto.password !== undefined) { fields.push(`password = $${idx++}`); values.push(dto.password); }

    if (!fields.length) return this.findOne(id);

    values.push(id);
    const { rows } = await this.db.query(
      `UPDATE "user" SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email`,
      values,
    );
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM "user" WHERE id = $1', [id]);
    return { deleted: true };
  }
}
