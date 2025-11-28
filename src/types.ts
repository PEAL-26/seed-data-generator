
/**
 * Tipos de dados suportados para geração de seeds
 */
export type FieldType =
  | 'uuid'
  | 'string'
  | 'email'
  | 'password'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'phone'
  | 'url'
  | 'number'
  | 'int'
  | 'float'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'pastDate'
  | 'futureDate'
  | 'text'
  | 'paragraph'
  | 'sentence'
  | 'address'
  | 'city'
  | 'country'
  | 'zipCode'
  | 'company'
  | 'jobTitle'
  | 'avatar'
  | 'image'
  | 'slug'
  | 'json'
  | 'enum'
  | 'custom';

/**
 * Configuração de um campo
 */
export interface FieldConfig {
  type: FieldType;
  /** Valores possíveis para tipo 'enum' */
  enumValues?: any[];
  /** Função customizada para tipo 'custom' */
  customFn?: (index: number) => any;
  /** Valor único para cada registro */
  unique?: boolean;
  /** Valor opcional (pode ser null) */
  optional?: boolean;
  /** Probabilidade de ser null quando optional=true (0-1) */
  nullProbability?: number;
  /** Configurações adicionais específicas */
  min?: number;
  max?: number;
  precision?: number;
  /** Relacionamento com outra tabela */
  relation?: {
    model: string;
    field: string;
  };
}

/**
 * Configuração do seed
 */
export interface SeedConfig {
  /** Nome do modelo/tabela */
  model: string;
  /** Quantidade de registros a serem criados */
  count: number;
  /** Configuração dos campos */
  fields: Record<string, FieldConfig>;
  /** Dados estáticos que serão aplicados a todos os registros */
  staticData?: Record<string, any>;
  /** Hook executado antes de inserir cada registro */
  beforeCreate?: (data: any, index: number) => any | Promise<any>;
  /** Hook executado após inserir cada registro */
  afterCreate?: (data: any, index: number) => void | Promise<void>;
}

/**
 * Tipos de ORM suportados
 */
export type OrmType = 'prisma' | 'typeorm' | 'sequelize' | 'mongoose';

/**
 * Opções do gerador de seeds
 */
export interface SeedGeneratorOptions {
  orm: OrmType;
  client?: any;
  verbose?: boolean;
}