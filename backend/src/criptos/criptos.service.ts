import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCriptoDto } from './dto/create-cripto.dto';
import { UpdateCriptoDto } from './dto/update-cripto.dto';

@Injectable()
export class CriptosService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateCriptoDto) {
    const { rows } = await this.db.query(
      'INSERT INTO cripto (ticker, price) VALUES ($1, $2) RETURNING *',
      [dto.ticker.toUpperCase(), dto.price],
    );
    return rows[0];
  }

  async findAll() {
    const { rows } = await this.db.query('SELECT * FROM cripto ORDER BY ticker');
    return rows;
  }

  async findOne(id: number) {
    const { rows } = await this.db.query('SELECT * FROM cripto WHERE id = $1', [id]);
    if (!rows.length) throw new NotFoundException(`Cripto #${id} not found`);
    return rows[0];
  }

  async update(id: number, dto: UpdateCriptoDto) {
    await this.findOne(id);
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.ticker !== undefined) { fields.push(`ticker = $${idx++}`); values.push(dto.ticker.toUpperCase()); }
    if (dto.price !== undefined) { fields.push(`price = $${idx++}`); values.push(dto.price); }

    if (!fields.length) return this.findOne(id);

    fields.push(`updated_price = NOW()`);
    values.push(id);
    const { rows } = await this.db.query(
      `UPDATE cripto SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM cripto WHERE id = $1', [id]);
    return { deleted: true };
  }
}
