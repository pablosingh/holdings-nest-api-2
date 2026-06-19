import { PartialType } from '@nestjs/mapped-types';
import { CreateCriptoDto } from './create-cripto.dto';

export class UpdateCriptoDto extends PartialType(CreateCriptoDto) {}
