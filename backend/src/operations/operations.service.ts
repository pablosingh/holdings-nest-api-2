import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { buildUpdate } from '../db/build-update';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateOperationDto) {
    const { rows } = await this.db.query(
      `INSERT INTO operation (ticker, number, price, total, buy, exchange, comment, cripto_id, holding_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [dto.ticker.toUpperCase(), dto.number, dto.price, dto.total, dto.buy, dto.exchange ?? null, dto.comment ?? null, dto.cripto_id, dto.holding_id ?? null],
    );
    return rows[0];
  }

  async findAll(cripto_id?: number, holding_id?: number) {
    let query = `SELECT o.*, c.ticker AS cripto_ticker FROM operation o JOIN cripto c ON c.id = o.cripto_id`;
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (cripto_id) { conditions.push(`o.cripto_id = $${idx++}`); params.push(cripto_id); }
    if (holding_id) { conditions.push(`o.holding_id = $${idx++}`); params.push(holding_id); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY o.date DESC';

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async findOne(id: number) {
    const { rows } = await this.db.query(
      `SELECT o.*, c.ticker AS cripto_ticker FROM operation o JOIN cripto c ON c.id = o.cripto_id WHERE o.id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Operation #${id} not found`);
    return rows[0];
  }

  async update(id: number, dto: UpdateOperationDto) {
    await this.findOne(id);
    const q = buildUpdate('operation', id, {
      ...dto,
      ticker: dto.ticker?.toUpperCase(),
    }, { number: '"number"' });
    if (!q) return this.findOne(id);
    const { rows } = await this.db.query(q.text, q.values);
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM operation WHERE id = $1', [id]);
    return { deleted: true };
  }
}
