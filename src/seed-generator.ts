import { faker } from '@faker-js/faker';
import type { FieldConfig, OrmType, SeedConfig, SeedGeneratorOptions } from './types';

/**
 * Gerador de dados fake para seed
 */
export class SeedGenerator {
  private orm: OrmType;
  private client: any;
  private verbose: boolean;
  private usedUniqueValues: Map<string, Set<any>> = new Map();

  constructor(options: SeedGeneratorOptions) {
    this.orm = options.orm;
    this.client = options.client;
    this.verbose = options.verbose ?? true;
  }

  /**
   * Gera um valor baseado no tipo de campo
   */
  private generateFieldValue(
    fieldName: string,
    config: FieldConfig,
    index: number
  ): any {
    // Se for opcional e cair na probabilidade, retorna null
    if (config.optional) {
      const probability = config.nullProbability ?? 0.1;
      if (Math.random() < probability) {
        return null;
      }
    }

    let value: any;

    switch (config.type) {
      case 'uuid':
        value = faker.string.uuid();
        break;
      case 'string':
        value = faker.lorem.word();
        break;
      case 'email':
        value = faker.internet.email();
        break;
      case 'password':
        value = faker.internet.password();
        break;
      case 'firstName':
        value = faker.person.firstName();
        break;
      case 'lastName':
        value = faker.person.lastName();
        break;
      case 'fullName':
        value = faker.person.fullName();
        break;
      case 'phone':
        value = faker.phone.number();
        break;
      case 'url':
        value = faker.internet.url();
        break;
      case 'number':
      case 'float':
        value = faker.number.float({
          min: config.min ?? 0,
          max: config.max ?? 1000,
          multipleOf: config.precision ?? 0.01,
        });
        break;
      case 'int':
        value = faker.number.int({
          min: config.min ?? 0,
          max: config.max ?? 1000,
        });
        break;
      case 'boolean':
        value = faker.datatype.boolean();
        break;
      case 'date':
      case 'datetime':
        value = faker.date.recent();
        break;
      case 'pastDate':
        value = faker.date.past();
        break;
      case 'futureDate':
        value = faker.date.future();
        break;
      case 'text':
      case 'paragraph':
        value = faker.lorem.paragraphs();
        break;
      case 'sentence':
        value = faker.lorem.sentence();
        break;
      case 'address':
        value = faker.location.streetAddress();
        break;
      case 'city':
        value = faker.location.city();
        break;
      case 'country':
        value = faker.location.country();
        break;
      case 'zipCode':
        value = faker.location.zipCode();
        break;
      case 'company':
        value = faker.company.name();
        break;
      case 'jobTitle':
        value = faker.person.jobTitle();
        break;
      case 'avatar':
        value = faker.image.avatar();
        break;
      case 'image':
        value = faker.image.url();
        break;
      case 'slug':
        value = faker.lorem.slug();
        break;
      case 'json':
        value = JSON.stringify({
          key: faker.lorem.word(),
          value: faker.lorem.sentence(),
        });
        break;
      case 'enum':
        if (!config.enumValues || config.enumValues.length === 0) {
          throw new Error(`Campo ${fieldName}: enumValues é obrigatório para tipo 'enum'`);
        }
        value = faker.helpers.arrayElement(config.enumValues);
        break;
      case 'custom':
        if (!config.customFn) {
          throw new Error(`Campo ${fieldName}: customFn é obrigatório para tipo 'custom'`);
        }
        value = config.customFn(index);
        break;
      default:
        value = faker.lorem.word();
    }

    // Garante unicidade se necessário
    if (config.unique) {
      const key = `${fieldName}`;
      if (!this.usedUniqueValues.has(key)) {
        this.usedUniqueValues.set(key, new Set());
      }

      const usedValues = this.usedUniqueValues.get(key)!;
      let attempts = 0;
      const maxAttempts = 1000;

      while (usedValues.has(value) && attempts < maxAttempts) {
        value = this.generateFieldValue(fieldName, { ...config, unique: false }, index);
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error(`Não foi possível gerar valor único para ${fieldName} após ${maxAttempts} tentativas`);
      }

      usedValues.add(value);
    }

    return value;
  }

  /**
   * Gera um registro completo
   */
  private generateRecord(config: SeedConfig, index: number): any {
    const record: any = { ...config.staticData };

    for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
      record[fieldName] = this.generateFieldValue(fieldName, fieldConfig, index);
    }

    return record;
  }

  /**
   * Insere dados no banco baseado no ORM
   */
  private async insertData(model: string, data: any[]): Promise<void> {
    switch (this.orm) {
      case 'prisma':
        if (!this.client) {
          throw new Error('Cliente Prisma não fornecido');
        }
        await this.client[model].createMany({ data });
        break;

      case 'typeorm':
        if (!this.client) {
          throw new Error('Repository TypeORM não fornecido');
        }
        await this.client.save(data);
        break;

      case 'sequelize':
        if (!this.client) {
          throw new Error('Model Sequelize não fornecido');
        }
        await this.client.bulkCreate(data);
        break;

      case 'mongoose':
        if (!this.client) {
          throw new Error('Model Mongoose não fornecido');
        }
        await this.client.insertMany(data);
        break;

      default:
        throw new Error(`ORM '${this.orm}' não suportado`);
    }
  }

  /**
   * Executa o seed
   */
  async seed(configs: SeedConfig | SeedConfig[]): Promise<void> {
    const configArray = Array.isArray(configs) ? configs : [configs];

    for (const config of configArray) {
      if (this.verbose) {
        console.log(`🌱 Gerando ${config.count} registros para ${config.model}...`);
      }

      const records: any[] = [];

      for (let i = 0; i < config.count; i++) {
        let record = this.generateRecord(config, i);

        // Hook antes de criar
        if (config.beforeCreate) {
          record = await config.beforeCreate(record, i);
        }

        records.push(record);
      }

      // Insere os dados
      await this.insertData(config.model, records);

      // Hook após criar
      if (config.afterCreate) {
        for (let i = 0; i < records.length; i++) {
          await config.afterCreate(records[i], i);
        }
      }

      if (this.verbose) {
        console.log(`✅ ${config.count} registros criados para ${config.model}`);
      }
    }

    // Limpa valores únicos usados
    this.usedUniqueValues.clear();
  }
}

