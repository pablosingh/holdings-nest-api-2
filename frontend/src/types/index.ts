export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Cripto {
  id: number;
  ticker: string;
  price: string;
  updated_price: string;
}

export interface Holding {
  id: number;
  date: string;
  ticker: string;
  amount: string;
  initial_price: string;
  initial_total: string;
  user_id: number;
  user_name?: string;
}

export interface Operation {
  id: number;
  date: string;
  ticker: string;
  number: string;
  price: string;
  total: string;
  buy: boolean;
  exchange: string | null;
  comment: string | null;
  cripto_id: number;
  holding_id: number | null;
  cripto_ticker?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateCriptoDto {
  ticker: string;
  price: number;
}

export interface UpdateCriptoDto {
  ticker?: string;
  price?: number;
}

export interface CreateHoldingDto {
  ticker: string;
  amount: number;
  initial_price: number;
  initial_total: number;
  user_id: number;
}

export interface UpdateHoldingDto {
  ticker?: string;
  amount?: number;
  initial_price?: number;
  initial_total?: number;
  user_id?: number;
}

export interface CreateOperationDto {
  ticker: string;
  number: number;
  price: number;
  total: number;
  buy: boolean;
  exchange?: string;
  comment?: string;
  user_id: number;
}

export interface UpdateOperationDto {
  ticker?: string;
  number?: number;
  price?: number;
  total?: number;
  buy?: boolean;
  exchange?: string;
  comment?: string;
  user_id?: number;
}
