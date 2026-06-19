import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';

@Injectable()
export class HoldingsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateHoldingDto) {
    const { rows } = await this.db.query(
      `INSERT INTO holding (ticker, amount, initial_price, initial_total, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [dto.ticker.toUpperCase(), dto.amount, dto.initial_price, dto.initial_total, dto.user_id],
    );
    return rows[0];
  }

  async findAll(user_id?: number) {
    let query = `SELECT h.*, u.name AS user_name FROM holding h JOIN "user" u ON u.id = h.user_id`;
    const params: number[] = [];

    if (user_id) {
      query += ' WHERE h.user_id = $1';
      params.push(user_id);
    }

    query += ' ORDER BY h.date DESC';
    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async findOne(id: number) {
    const { rows } = await this.db.query(
      `SELECT h.*, u.name AS user_name FROM holding h JOIN "user" u ON u.id = h.user_id WHERE h.id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Holding #${id} not found`);
    return rows[0];
  }

  async update(id: number, dto: UpdateHoldingDto) {
    await this.findOne(id);
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (dto.ticker !== undefined) { fields.push(`ticker = $${idx++}`); values.push(dto.ticker.toUpperCase()); }
    if (dto.amount !== undefined) { fields.push(`amount = $${idx++}`); values.push(dto.amount); }
    if (dto.initial_price !== undefined) { fields.push(`initial_price = $${idx++}`); values.push(dto.initial_price); }
    if (dto.initial_total !== undefined) { fields.push(`initial_total = $${idx++}`); values.push(dto.initial_total); }
    if (dto.user_id !== undefined) { fields.push(`user_id = $${idx++}`); values.push(dto.user_id); }

    if (!fields.length) return this.findOne(id);

    values.push(id);
    const { rows } = await this.db.query(
      `UPDATE holding SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM holding WHERE id = $1', [id]);
    return { deleted: true };
  }
}
