# 🌱 Seed Data Generator

<div align="center">

![npm version](https://img.shields.io/npm/v/seed-data-generator)
![npm downloads](https://img.shields.io/npm/dm/seed-data-generator)
![license](https://img.shields.io/npm/l/seed-data-generator)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Uma biblioteca flexível para gerar dados fake e popular sua base de dados em ambiente de desenvolvimento.

[Documentação](#-documentação) • [Instalação](#-instalação-rápida) • [Guia Rápido](#-guia-rápido) • [Exemplos](#-exemplos-práticos) • [API](#-api-reference)

</div>

---

## ✨ Por que usar?

- 🎲 **25+ tipos de dados** prontos para uso (email, phone, address, uuid, etc)
- 🔐 **Valores únicos** garantidos automaticamente
- 🎯 **Múltiplos ORMs** suportados nativamente (Prisma, TypeORM, Sequelize, Mongoose)
- 🎨 **Campos customizados** com funções próprias
- 🔗 **Relacionamentos** simples entre tabelas
- 🎛️ **Configurações flexíveis** por campo (min, max, optional, unique)
- 🪝 **Hooks** antes e depois da criação
- 📊 **Dados estáticos** compartilhados
- 🛡️ **Segurança** integrada - só executa em modo desenvolvimento
- ⚡ **Performance** otimizada para inserção em lote
- 📝 **TypeScript** first com tipos completos

## 🚀 Instalação Rápida

### 1. Instale a biblioteca

```bash
# npm
npm i -D seed-data-generator

# yarn
yarn add -D seed-data-generator

# pnpm
pnpm add -D seed-data-generator
```

> **Nota:** Instala como dependência de desenvolvimento (`-D`) pois seeds fakes só são usados em ambiente de desenvolvimento.

## 🎯 Guia Rápido

### Uso Básico (Prisma)

```typescript
import { SeedGenerator } from "seed-data-generator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seeder = new SeedGenerator({
    orm: "prisma",
    client: prisma,
    verbose: true,
  });

  await seeder.seed({
    model: "user",
    count: 50,
    fields: {
      email: { type: "email", unique: true },
      name: { type: "fullName" },
      age: { type: "int", min: 18, max: 65 },
      isActive: { type: "boolean" },
    },
  });

  console.log("✅ 50 usuários criados!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Múltiplos Modelos

```typescript
await seeder.seed([
  {
    model: "user",
    count: 50,
    fields: {
      email: { type: "email", unique: true },
      name: { type: "fullName" },
    },
  },
  {
    model: "post",
    count: 200,
    fields: {
      title: { type: "sentence" },
      content: { type: "paragraph" },
      published: { type: "boolean" },
    },
  },
]);
```

## 📦 Configuração Recomendada

### Estrutura de Arquivos

```
seu-projeto/
├── src/
│   └── database/
│       └── seeds/
│           ├── index.ts          # Arquivo principal
│           ├── user.seed.ts      # Seeds de usuários
│           ├── post.seed.ts      # Seeds de posts
│           └── product.seed.ts   # Seeds de produtos
├── package.json
└── .env
```

### Arquivo Principal de Seeds

Crie `src/database/seeds/index.ts`:

```typescript
import { SeedGenerator } from "seed-data-generator";
import { PrismaClient } from "@prisma/client";
import { userSeeds } from "./user.seed";
import { postSeeds } from "./post.seed";

const prisma = new PrismaClient();

async function main() {
  // Proteção: só executa em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    console.log("⚠️ Seeds só podem ser executados em modo desenvolvimento");
    process.exit(1);
  }

  console.log("🌱 Iniciando seeds...\n");

  const seeder = new SeedGenerator({
    orm: "prisma",
    client: prisma,
    verbose: true,
  });

  // Limpa dados existentes
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Executa seeds
  await seeder.seed([userSeeds, postSeeds]);

  console.log("\n✅ Seeds executados com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seeds:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Arquivo de Seeds Específico

Crie `src/database/seeds/user.seed.ts`:

```typescript
import type { SeedConfig } from "seed-data-generator";

export const userSeeds: SeedConfig = {
  model: "user",
  count: 50,
  fields: {
    email: { type: "email", unique: true },
    name: { type: "fullName" },
    age: { type: "int", min: 18, max: 65 },
    phone: { type: "phone", optional: true },
    bio: { type: "paragraph", optional: true, nullProbability: 0.3 },
    avatar: { type: "avatar" },
    createdAt: { type: "pastDate" },
  },
  staticData: {
    role: "USER",
    isVerified: false,
  },
  beforeCreate: async (data) => {
    // Hash de senha ou outras transformações
    data.password = "hashed_password_here";
    return data;
  },
};
```

### Scripts no package.json

```json
{
  "scripts": {
    "seed": "tsx src/database/seeds/index.ts",
    "seed:fresh": "npm run db:reset && npm run seed",
    "db:reset": "npx prisma migrate reset --force --skip-seed"
  },
  "prisma": {
    "seed": "tsx src/database/seeds/index.ts"
  }
}
```

### Variáveis de Ambiente

```bash
# .env.development
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/mydb_dev"
```

## 📚 Documentação

### 📋 Índice

- [Tipos de Dados Disponíveis](#-tipos-de-dados-disponíveis)
- [Configurações por Campo](#-configurações-por-campo)
- [Recursos Avançados](#-recursos-avançados)
- [Exemplos Práticos](#-exemplos-práticos)
- [ORMs Suportados](#-orms-suportados)
- [API Reference](#-api-reference)
- [Boas Práticas](#-boas-práticas)
- [Troubleshooting](#-troubleshooting)

## 🎲 Tipos de Dados Disponíveis

### Identificadores

| Tipo     | Descrição         | Exemplo Output                           |
| -------- | ----------------- | ---------------------------------------- |
| `uuid`   | UUID v4 único     | `"550e8400-e29b-41d4-a716-446655440000"` |
| `string` | String aleatória  | `"dolor"`                                |
| `slug`   | URL-friendly slug | `"lorem-ipsum-dolor"`                    |

**Exemplo de uso:**

```typescript
{
  id: { type: 'uuid' },
  username: { type: 'string', unique: true },
  postSlug: { type: 'slug', unique: true }
}
```

### Dados Pessoais

| Tipo        | Descrição          | Exemplo Output                                  |
| ----------- | ------------------ | ----------------------------------------------- |
| `email`     | Email válido       | `"john.doe@example.com"`                        |
| `password`  | Senha aleatória    | `"Xy3$mK9pL"`                                   |
| `firstName` | Primeiro nome      | `"John"`                                        |
| `lastName`  | Sobrenome          | `"Doe"`                                         |
| `fullName`  | Nome completo      | `"John Doe"`                                    |
| `phone`     | Número de telefone | `"+1-555-123-4567"`                             |
| `avatar`    | URL de avatar      | `"https://avatars.githubusercontent.com/u/123"` |
| `jobTitle`  | Cargo profissional | `"Software Engineer"`                           |

**Exemplo de uso:**

```typescript
{
  email: { type: 'email', unique: true },
  name: { type: 'fullName' },
  phone: { type: 'phone', optional: true }
}
```

### Números

| Tipo     | Descrição                 | Configurações Disponíveis |
| -------- | ------------------------- | ------------------------- |
| `int`    | Número inteiro            | `min`, `max`              |
| `float`  | Número decimal            | `min`, `max`, `precision` |
| `number` | Número (alias para float) | `min`, `max`, `precision` |

**Exemplo de uso:**

```typescript
{
  age: { type: 'int', min: 18, max: 65 },
  price: { type: 'float', min: 0, max: 1000, precision: 0.01 },
  rating: { type: 'float', min: 0, max: 5, precision: 0.1 }
}
```

### Datas e Horários

| Tipo         | Descrição           | Exemplo Output           |
| ------------ | ------------------- | ------------------------ |
| `date`       | Data recente        | `new Date()`             |
| `datetime`   | Data e hora recente | `new Date()`             |
| `pastDate`   | Data no passado     | `new Date('2023-01-15')` |
| `futureDate` | Data no futuro      | `new Date('2026-12-31')` |

**Exemplo de uso:**

```typescript
{
  birthDate: { type: 'pastDate' },
  createdAt: { type: 'pastDate' },
  eventDate: { type: 'futureDate' }
}
```

### Textos

| Tipo        | Descrição            | Tamanho Aproximado  |
| ----------- | -------------------- | ------------------- |
| `text`      | Múltiplos parágrafos | 500-1000 caracteres |
| `paragraph` | Parágrafo completo   | 200-300 caracteres  |
| `sentence`  | Sentença única       | 50-100 caracteres   |

**Exemplo de uso:**

```typescript
{
  title: { type: 'sentence' },
  excerpt: { type: 'sentence' },
  description: { type: 'paragraph' },
  content: { type: 'text' }
}
```

### Endereços e Localização

| Tipo      | Descrição         | Exemplo Output      |
| --------- | ----------------- | ------------------- |
| `address` | Endereço completo | `"123 Main Street"` |
| `city`    | Nome de cidade    | `"New York"`        |
| `country` | Nome de país      | `"United States"`   |
| `zipCode` | CEP/Código Postal | `"12345-678"`       |

**Exemplo de uso:**

```typescript
{
  street: { type: 'address' },
  city: { type: 'city' },
  country: { type: 'country' },
  zipCode: { type: 'zipCode' }
}
```

### Outros Tipos

| Tipo      | Descrição               | Exemplo Output                    |
| --------- | ----------------------- | --------------------------------- |
| `url`     | URL completa            | `"https://example.com/path"`      |
| `boolean` | Valor booleano          | `true` ou `false`                 |
| `company` | Nome de empresa         | `"Acme Corporation"`              |
| `image`   | URL de imagem           | `"https://picsum.photos/640/480"` |
| `json`    | Objeto JSON serializado | `"{\"key\":\"value\"}"`           |

**Exemplo de uso:**

```typescript
{
  website: { type: 'url' },
  isActive: { type: 'boolean' },
  company: { type: 'company' },
  coverImage: { type: 'image' }
}
```

### Tipos Especiais

#### Enum - Valores Fixos

Use quando o campo aceita apenas valores específicos:

```typescript
{
  status: {
    type: 'enum',
    enumValues: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED']
  },
  role: {
    type: 'enum',
    enumValues: ['USER', 'ADMIN', 'MODERATOR']
  },
  priority: {
    type: 'enum',
    enumValues: [1, 2, 3, 4, 5]
  }
}
```

#### Custom - Lógica Personalizada

Use quando precisa de lógica customizada:

```typescript
{
  // Gera código sequencial
  orderNumber: {
    type: 'custom',
    customFn: (index) => `ORD-${Date.now()}-${index.toString().padStart(5, '0')}`
  },

  // Gera array de tags aleatórias
  tags: {
    type: 'custom',
    customFn: () => {
      const allTags = ['js', 'ts', 'react', 'node', 'prisma'];
      return faker.helpers.arrayElements(allTags, { min: 1, max: 3 });
    }
  },

  // Calcula valor baseado em outro campo
  discountedPrice: {
    type: 'custom',
    customFn: (index) => {
      // Acesso via closure ou beforeCreate hook
      return originalPrice * 0.9;
    }
  }
}
```

## ⚙️ Configurações por Campo

### Valores Únicos (`unique`)

Garante que não haverá valores duplicados:

```typescript
{
  email: { type: 'email', unique: true },
  username: { type: 'string', unique: true },
  slug: { type: 'slug', unique: true }
}
```

**Como funciona:**

- Internamente mantém um Set de valores já usados
- Tenta gerar novo valor até encontrar um único
- Limite de 1000 tentativas por campo
- Ideal para: emails, usernames, slugs, códigos

### Campos Opcionais (`optional`)

Permite valores `null` com probabilidade configurável:

```typescript
{
  // 30% de chance de ser null
  bio: {
    type: 'paragraph',
    optional: true,
    nullProbability: 0.3
  },

  // 50% de chance de ser null (padrão quando não especificado)
  middleName: {
    type: 'string',
    optional: true
  },

  // 10% de chance de ser null
  phone: {
    type: 'phone',
    optional: true,
    nullProbability: 0.1
  }
}
```

**nullProbability:**

- Valor entre 0 (nunca null) e 1 (sempre null)
- Padrão: 0.1 (10% de chance)
- Só funciona quando `optional: true`

### Ranges Numéricos

Configure valores mínimos e máximos:

```typescript
{
  // Idade entre 18 e 65
  age: {
    type: 'int',
    min: 18,
    max: 65
  },

  // Preço entre 10.00 e 999.99
  price: {
    type: 'float',
    min: 10,
    max: 1000,
    precision: 0.01
  },

  // Estoque entre 0 e 10000
  stock: {
    type: 'int',
    min: 0,
    max: 10000
  },

  // Rating 0 a 5 com uma casa decimal
  rating: {
    type: 'float',
    min: 0,
    max: 5,
    precision: 0.1
  }
}
```

**Precision:**

- Define casas decimais para `float`/`number`
- `precision: 0.01` = 2 casas decimais
- `precision: 0.1` = 1 casa decimal
- `precision: 0.001` = 3 casas decimais

## 🚀 Recursos Avançados

### Dados Estáticos Compartilhados

Aplique valores fixos a todos os registros:

```typescript
{
  model: 'user',
  count: 100,
  fields: {
    email: { type: 'email', unique: true },
    name: { type: 'fullName' }
  },
  staticData: {
    role: 'USER',
    isVerified: false,
    accountType: 'FREE',
    locale: 'pt-BR'
  }
}
```

**Quando usar:**

- Valores padrão para todos os registros
- Configurações iniciais
- Flags de estado comum

### Hooks de Transformação

#### beforeCreate - Modifica antes de inserir

```typescript
{
  model: 'user',
  count: 50,
  fields: {
    email: { type: 'email' },
    password: { type: 'password' }
  },
  beforeCreate: async (data, index) => {
    // Hash de senha
    data.password = await bcrypt.hash(data.password, 10);

    // Adiciona timestamp
    data.registeredAt = new Date();

    // Username baseado no email
    data.username = data.email.split('@')[0];

    // Logs
    console.log(`Criando usuário ${index + 1}: ${data.email}`);

    return data;
  }
}
```

#### afterCreate - Executa após inserir

```typescript
{
  model: 'user',
  count: 50,
  fields: {
    email: { type: 'email' }
  },
  afterCreate: async (data, index) => {
    // Enviar email de boas-vindas
    await sendWelcomeEmail(data.email);

    // Criar registro relacionado
    await prisma.profile.create({
      data: { userId: data.id }
    });

    // Analytics
    console.log(`✓ Usuário ${index + 1} criado e notificado`);
  }
}
```

**Diferenças:**

- `beforeCreate`: modifica dados antes de salvar (retorna data modificado)
- `afterCreate`: executa ações após salvar (não retorna nada)

### Relacionamentos Entre Tabelas

#### Método 1: IDs Estáticos

```typescript
// Cria usuário específico primeiro
const admin = await prisma.user.create({
  data: { email: "admin@example.com", name: "Admin" },
});

// Usa o ID nos posts
await seeder.seed({
  model: "post",
  count: 100,
  fields: {
    title: { type: "sentence" },
    content: { type: "paragraph" },
  },
  staticData: {
    authorId: admin.id, // Todos os posts do admin
  },
});
```

#### Método 2: IDs Aleatórios

```typescript
// 1. Cria usuários
await seeder.seed({
  model: "user",
  count: 20,
  fields: {
    email: { type: "email", unique: true },
    name: { type: "fullName" },
  },
});

// 2. Busca IDs criados
const users = await prisma.user.findMany({
  select: { id: true },
});
const userIds = users.map((u) => u.id);

// 3. Cria posts com authorId aleatório
await seeder.seed({
  model: "post",
  count: 200,
  fields: {
    title: { type: "sentence" },
    content: { type: "paragraph" },
    authorId: {
      type: "custom",
      customFn: () => faker.helpers.arrayElement(userIds),
    },
  },
});
```

#### Método 3: Distribuição Controlada

```typescript
// Distribui posts igualmente entre usuários
await seeder.seed({
  model: "post",
  count: 200,
  fields: {
    title: { type: "sentence" },
    authorId: {
      type: "custom",
      customFn: (index) => userIds[index % userIds.length],
    },
  },
});
```

## 🔧 ORMs Suportados

### Prisma (Recomendado)

```typescript
import { PrismaClient } from "@prisma/client";
import { SeedGenerator } from "seed-data-generator";

const prisma = new PrismaClient();

const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma,
  verbose: true,
});

await seeder.seed({
  model: "user", // Nome do model no schema.prisma
  count: 50,
  fields: {
    email: { type: "email" },
    name: { type: "fullName" },
  },
});

await prisma.$disconnect();
```

**Schema Prisma exemplo:**

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
}
```

### TypeORM

```typescript
import { DataSource } from "typeorm";
import { SeedGenerator } from "seed-data-generator";
import { User } from "./entities/User";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "mydb",
  entities: [User],
});

await dataSource.initialize();

const userRepository = dataSource.getRepository(User);

const seeder = new SeedGenerator({
  orm: "typeorm",
  client: userRepository,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    email: { type: "email" },
    name: { type: "fullName" },
  },
});

await dataSource.destroy();
```

### Sequelize

```typescript
import { Sequelize } from "sequelize";
import { SeedGenerator } from "seed-data-generator";
import { User } from "./models/User";

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "postgres",
});

const seeder = new SeedGenerator({
  orm: "sequelize",
  client: User,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    email: { type: "email" },
    name: { type: "fullName" },
  },
});

await sequelize.close();
```

### Mongoose

```typescript
import mongoose from "mongoose";
import { SeedGenerator } from "seed-data-generator";
import { User } from "./models/User";

await mongoose.connect("mongodb://localhost:27017/mydb");

const seeder = new SeedGenerator({
  orm: "mongoose",
  client: User,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    email: { type: "email" },
    name: { type: "fullName" },
  },
});

await mongoose.disconnect();
```

## 📖 API Reference

### SeedGenerator Class

#### Constructor

```typescript
new SeedGenerator(options: SeedGeneratorOptions)
```

**Parâmetros:**

| Parâmetro | Tipo                                                 | Obrigatório | Descrição                                     |
| --------- | ---------------------------------------------------- | ----------- | --------------------------------------------- |
| `orm`     | `'prisma' \| 'typeorm' \| 'sequelize' \| 'mongoose'` | Sim         | Tipo do ORM utilizado                         |
| `client`  | `any`                                                | Sim         | Instância do cliente/repository do ORM        |
| `verbose` | `boolean`                                            | Não         | Exibir logs durante execução (padrão: `true`) |

**Exemplo:**

```typescript
const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma,
  verbose: true,
});
```

#### seed()

```typescript
async seed(configs: SeedConfig | SeedConfig[]): Promise<void>
```

Executa a geração e inserção de dados fake.

**Parâmetros:**

- `configs`: Configuração única ou array de configurações

**Retorno:** Promise<void>

**Exemplo:**

```typescript
// Single config
await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    /* ... */
  },
});

// Multiple configs
await seeder.seed([{ model: "user" /* ... */ }, { model: "post" /* ... */ }]);
```

### SeedConfig Interface

```typescript
interface SeedConfig {
  model: string;
  count: number;
  fields: Record<string, FieldConfig>;
  staticData?: Record<string, any>;
  beforeCreate?: (data: any, index: number) => any | Promise<any>;
  afterCreate?: (data: any, index: number) => void | Promise<void>;
}
```

**Propriedades:**

| Propriedade    | Tipo                          | Obrigatório | Descrição                           |
| -------------- | ----------------------------- | ----------- | ----------------------------------- |
| `model`        | `string`                      | Sim         | Nome do model/tabela                |
| `count`        | `number`                      | Sim         | Quantidade de registros             |
| `fields`       | `Record<string, FieldConfig>` | Sim         | Configuração dos campos             |
| `staticData`   | `Record<string, any>`         | Não         | Dados fixos para todos os registros |
| `beforeCreate` | `Function`                    | Não         | Hook antes de inserir               |
| `afterCreate`  | `Function`                    | Não         | Hook após inserir                   |

### FieldConfig Interface

```typescript
interface FieldConfig {
  type: FieldType;
  enumValues?: any[];
  customFn?: (index: number) => any;
  unique?: boolean;
  optional?: boolean;
  nullProbability?: number;
  min?: number;
  max?: number;
  precision?: number;
}
```

**Propriedades:**

| Propriedade       | Tipo             | Descrição                | Padrão  |
| ----------------- | ---------------- | ------------------------ | ------- |
| `type`            | `FieldType`      | Tipo do campo            | -       |
| `enumValues`      | `any[]`          | Valores para tipo enum   | -       |
| `customFn`        | `(index) => any` | Função custom            | -       |
| `unique`          | `boolean`        | Garante valores únicos   | `false` |
| `optional`        | `boolean`        | Permite null             | `false` |
| `nullProbability` | `number`         | Chance de ser null (0-1) | `0.1`   |
| `min`             | `number`         | Valor mínimo (números)   | -       |
| `max`             | `number`         | Valor máximo (números)   | -       |
| `precision`       | `number`         | Precisão decimal         | `0.01`  |

### FieldType

```typescript
type FieldType =
  | "uuid"
  | "string"
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "fullName"
  | "phone"
  | "url"
  | "number"
  | "int"
  | "float"
  | "boolean"
  | "date"
  | "datetime"
  | "pastDate"
  | "futureDate"
  | "text"
  | "paragraph"
  | "sentence"
  | "address"
  | "city"
  | "country"
  | "zipCode"
  | "company"
  | "jobTitle"
  | "avatar"
  | "image"
  | "slug"
  | "json"
  | "enum"
  | "custom";
```

## 🎯 Boas Práticas

### 1. Sempre Proteja o Ambiente

```typescript
// ✅ BOM - Verifica ambiente
if (process.env.NODE_ENV !== "development") {
  console.log("⚠️ Seeds só em desenvolvimento!");
  process.exit(1);
}

// ❌ RUIM - Sem proteção
await seeder.seed(/* ... */);
```

### 2. Limpe Dados Antes de Criar

```typescript
// ✅ BOM - Ordem correta (filho → pai)
await prisma.comment.deleteMany();
await prisma.post.deleteMany();
await prisma.user.deleteMany();

await seeder.seed([
  /* ... */
]);

// ❌ RUIM - Pode dar erro de constraint
await prisma.user.deleteMany(); // Erro se tem posts relacionados
```

### 3. Ordem de Criação é Importante

```typescript
// ✅ BOM - Pai primeiro, filho depois
await seeder.seed([
  { model: "user" /* ... */ }, // 1. Cria usuários
  { model: "post" /* ... */ }, // 2. Cria posts (precisa de userId)
]);

// ❌ RUIM - Vai dar erro de FK
await seeder.seed([
  { model: "post" /* ... */ }, // Erro: userId não existe ainda
  { model: "user" /* ... */ },
]);
```

### 4. Use Valores Únicos Quando Necessário

```typescript
// ✅ BOM - Campos que devem ser únicos
{
  email: { type: 'email', unique: true },
  username: { type: 'string', unique: true },
  slug: { type: 'slug', unique: true }
}

// ⚠️ ATENÇÃO - Sem unique pode gerar duplicados
{
  email: { type: 'email' } // Pode gerar emails iguais!
}
```

### 5. Hash de Senhas

```typescript
// ✅ BOM - Hash antes de salvar
{
  model: 'user',
  fields: {
    password: { type: 'password' }
  },
  beforeCreate: async (data) => {
    data.password = await bcrypt.hash(data.password, 10);
    return data;
  }
}

// ❌ RUIM - Senha em texto puro
{
  model: 'user',
  fields: {
    password: { type: 'password' }
  }
}
```

### 6. Quantidade Realista

```typescript
// ✅ BOM - Quantidade para desenvolvimento
{ model: 'user', count: 50 }
{ model: 'post', count: 200 }
{ model: 'comment', count: 1000 }

// ❌ RUIM - Muito pesado
{ model: 'user', count: 100000 } // Vai deixar o banco lento!
```

### 7. Organize em Arquivos Separados

```
src/database/seeds/
├── index.ts           # Orquestra tudo
├── config/
│   └── seeder.ts      # Instância do seeder
├── users.seed.ts      # Seeds de usuários
├── posts.seed.ts      # Seeds de posts
└── products.seed.ts   # Seeds de produtos
```

### 8. Use TypeScript para Type Safety

```typescript
import type { SeedConfig } from "seed-data-generator";

// ✅ BOM - Com tipos
export const userSeeds: SeedConfig = {
  model: "user",
  count: 50,
  fields: {
    email: { type: "email", unique: true },
  },
};

// ⚠️ FUNCIONA mas sem autocomplete
export const userSeeds = {
  model: "user",
  count: 50,
  fields: {
    email: { type: "emial" }, // Typo não detectado
  },
};
```

### 9. Logs Úteis

```typescript
{
  model: 'user',
  count: 100,
  fields: { /* ... */ },
  beforeCreate: (data, index) => {
    if ((index + 1) % 20 === 0) {
      console.log(`✓ ${index + 1}/100 usuários criados`);
    }
    return data;
  },
  afterCreate: async (data, index) => {
    // Última operação
    if (index === 99) {
      console.log('🎉 Todos os usuários foram criados!');
    }
  }
}
```

### 10. Tratamento de Erros

```typescript
async function main() {
  try {
    await seeder.seed([
      /* configs */
    ]);
    console.log("✅ Seeds executados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seeds:");

    if (error.code === "P2002") {
      console.error("→ Violação de constraint unique");
    } else if (error.code === "P2003") {
      console.error("→ Violação de foreign key");
    } else {
      console.error(error);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
```

## 🐛 Troubleshooting

### Erro: "customFn é obrigatório para tipo 'custom'"

**Problema:** Usou type `'custom'` sem fornecer função.

```typescript
// ❌ ERRO
{ field: { type: 'custom' } }

// ✅ SOLUÇÃO
{ field: { type: 'custom', customFn: (i) => `value-${i}` } }
```

### Erro: "enumValues é obrigatório para tipo 'enum'"

**Problema:** Usou type `'enum'` sem fornecer valores.

```typescript
// ❌ ERRO
{ status: { type: 'enum' } }

// ✅ SOLUÇÃO
{ status: { type: 'enum', enumValues: ['ACTIVE', 'INACTIVE'] } }
```

### Erro: "Não foi possível gerar valor único após 1000 tentativas"

**Problema:** Campo `unique: true` mas poucos valores possíveis.

```typescript
// ❌ PROBLEMA - Apenas ~100 firstNames disponíveis
{
  count: 1000,
  fields: {
    name: { type: 'firstName', unique: true }
  }
}

// ✅ SOLUÇÃO 1 - Use campo com mais variações
{
  count: 1000,
  fields: {
    email: { type: 'email', unique: true } // Infinitas combinações
  }
}

// ✅ SOLUÇÃO 2 - Reduza a quantidade
{
  count: 50,
  fields: {
    name: { type: 'firstName', unique: true }
  }
}

// ✅ SOLUÇÃO 3 - Use custom com index
{
  count: 1000,
  fields: {
    username: {
      type: 'custom',
      customFn: (i) => `user_${i}`,
      unique: true
    }
  }
}
```

### Erro: "Cliente Prisma não fornecido"

**Problema:** Esqueceu de passar o client.

```typescript
// ❌ ERRO
const seeder = new SeedGenerator({
  orm: "prisma",
  verbose: true,
});

// ✅ SOLUÇÃO
const prisma = new PrismaClient();
const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma, // ← Adicione isto!
  verbose: true,
});
```

### Erro: Foreign Key Constraint

**Problema:** Tentou criar filho antes do pai.

```typescript
// ❌ PROBLEMA
await seeder.seed([
  { model: "post" /* precisa de userId */ },
  { model: "user" /* ... */ },
]);

// ✅ SOLUÇÃO - Crie na ordem correta
await seeder.seed([{ model: "user" /* ... */ }, { model: "post" /* ... */ }]);
```

### Erro: Unique Constraint Violation

**Problema:** Tentou inserir valor duplicado em campo único.

```typescript
// ❌ PROBLEMA
{
  email: { type: 'email' } // Sem unique: true
}
// Pode gerar emails iguais!

// ✅ SOLUÇÃO
{
  email: { type: 'email', unique: true }
}
```

### Seeds não aparecem no banco

**Checklist:**

1. ✅ Conexão com banco está correta?
2. ✅ Modelo/tabela existe no schema?
3. ✅ Permissões de escrita no banco?
4. ✅ Verificar logs com `verbose: true`
5. ✅ Verificar se está no ambiente correto

```typescript
// Debug
const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma,
  verbose: true, // ← Ative os logs
});

// Teste conexão
console.log("🔍 Testando conexão...");
await prisma.$connect();
console.log("✅ Conectado ao banco!");

// Conta registros antes
const beforeCount = await prisma.user.count();
console.log(`📊 Usuários antes: ${beforeCount}`);

await seeder.seed(/* ... */);

// Conta registros depois
const afterCount = await prisma.user.count();
console.log(`📊 Usuários depois: ${afterCount}`);
```

### Performance Lenta

**Problema:** Muitos registros ou hooks pesados.

```typescript
// ❌ LENTO - 10.000 registros de uma vez
{
  model: 'user',
  count: 10000,
  fields: { /* ... */ },
  beforeCreate: async (data) => {
    await someSlowOperation(); // Operação lenta
    return data;
  }
}

// ✅ RÁPIDO - Em lotes menores
for (let i = 0; i < 10; i++) {
  await seeder.seed({
    model: 'user',
    count: 1000, // 1000 por vez
    fields: { /* ... */ }
  });
  console.log(`✓ Lote ${i + 1}/10 completo`);
}

// ✅ RÁPIDO - Sem hooks pesados
{
  model: 'user',
  count: 10000,
  fields: { /* ... */ }
  // Sem beforeCreate pesado
}
```

### Erro: Cannot find module 'seed-data-generator'

**Problema:** Biblioteca não instalada.

```bash
# ✅ SOLUÇÃO
npm install seed-data-generator @faker-js/faker

# Ou
yarn add seed-data-generator @faker-js/faker

# Ou
pnpm add seed-data-generator @faker-js/faker
```

### TypeScript: Type Errors

**Problema:** Tipos não reconhecidos.

```typescript
// ❌ ERRO - Tipo não reconhecido
import { SeedGenerator } from 'seed-data-generator';

// ✅ SOLUÇÃO - Instale types se necessário
npm install -D @types/node typescript

// ✅ Use tipos exportados
import type { SeedConfig, FieldConfig, FieldType } from 'seed-data-generator';
```

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Veja como você pode ajudar:

### Reportar Bugs

1. Abra uma issue no GitHub
2. Descreva o problema detalhadamente
3. Inclua versão do Node, ORM e biblioteca
4. Adicione código para reproduzir

### Sugerir Recursos

1. Verifique se já não foi sugerido
2. Abra uma issue com tag `enhancement`
3. Descreva o caso de uso
4. Explique o benefício

### Enviar Pull Request

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📞 Suporte

Precisa de ajuda?

1. 📖 Consulte esta documentação
2. 🐛 Veja [Troubleshooting](#-troubleshooting)
3. 💬 Abra uma issue no [GitHub](https://github.com/seu-usuario/seed-data-generator/issues)
4. 📧 Entre em contato: edilasio@live.com

## ⭐ Mostre seu Suporte

Se este projeto te ajudou, considere:

- ⭐ Dar uma estrela no GitHub
- 🐦 Compartilhar no Twitter
- 📝 Escrever um artigo sobre
- 💬 Recomendar para amigos

---

<div align="center">

[⬆ Voltar ao topo](#-seed-data-generator)

</div>
