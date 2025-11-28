# 🌱 Seed Data Generator

Uma biblioteca TypeScript poderosa e flexível para gerar dados fake e popular sua base de dados em ambiente de desenvolvimento.

## 📋 Índice

- [Características](#-características)
- [Instalação](#-instalação)
- [Configuração Inicial](#-configuração-inicial)
- [Uso Básico](#-uso-básico)
- [Tipos de Dados](#-tipos-de-dados)
- [Configurações Avançadas](#-configurações-avançadas)
- [ORMs Suportados](#-orms-suportados)
- [Exemplos Práticos](#-exemplos-práticos)
- [API Reference](#-api-reference)
- [Boas Práticas](#-boas-práticas)
- [Troubleshooting](#-troubleshooting)

## ✨ Características

- 🎲 **25+ tipos de dados** prontos para uso
- 🔐 **Valores únicos** garantidos automaticamente
- 🎯 **Múltiplos ORMs** suportados (Prisma, TypeORM, Sequelize, Mongoose)
- 🎨 **Campos customizados** com funções próprias
- 🔗 **Relacionamentos** entre tabelas
- 🎛️ **Configurações flexíveis** por campo
- 🪝 **Hooks** antes e depois da criação
- 📊 **Dados estáticos** compartilhados
- 🛡️ **Segurança** - só executa em modo desenvolvimento

## 📦 Instalação

```bash
# npm
npm i -D seed-data-generator

# yarn
yarn add -D seed-data-generator

# pnpm
pnpm add -D seed-data-generator
```

## 🚀 Configuração Inicial

## 💡 Uso Básico

### Exemplo Simples

```typescript
const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    email: { type: "email" },
    name: { type: "fullName" },
    age: { type: "int", min: 18, max: 65 },
  },
});
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
    },
  },
]);
```

## 🎲 Tipos de Dados

### Identificadores

| Tipo     | Descrição         | Exemplo                                  |
| -------- | ----------------- | ---------------------------------------- |
| `uuid`   | UUID v4           | `"550e8400-e29b-41d4-a716-446655440000"` |
| `string` | String aleatória  | `"dolor"`                                |
| `slug`   | URL-friendly slug | `"lorem-ipsum-dolor"`                    |

### Dados Pessoais

| Tipo        | Descrição          | Exemplo                               |
| ----------- | ------------------ | ------------------------------------- |
| `email`     | Email válido       | `"john.doe@example.com"`              |
| `password`  | Senha aleatória    | `"Xy3$mK9pL"`                         |
| `firstName` | Primeiro nome      | `"John"`                              |
| `lastName`  | Sobrenome          | `"Doe"`                               |
| `fullName`  | Nome completo      | `"John Doe"`                          |
| `phone`     | Número de telefone | `"+1-555-123-4567"`                   |
| `avatar`    | URL de avatar      | `"https://avatars.example.com/u/123"` |
| `jobTitle`  | Cargo profissional | `"Software Engineer"`                 |

### Números

| Tipo     | Descrição                 | Configurações             |
| -------- | ------------------------- | ------------------------- |
| `int`    | Número inteiro            | `min`, `max`              |
| `float`  | Número decimal            | `min`, `max`, `precision` |
| `number` | Número (alias para float) | `min`, `max`, `precision` |

```typescript
// Exemplo
{
  age: { type: 'int', min: 18, max: 65 },
  price: { type: 'float', min: 0, max: 1000, precision: 0.01 },
}
```

### Datas

| Tipo         | Descrição           | Exemplo  |
| ------------ | ------------------- | -------- |
| `date`       | Data recente        | `Date()` |
| `datetime`   | Data e hora recente | `Date()` |
| `pastDate`   | Data no passado     | `Date()` |
| `futureDate` | Data no futuro      | `Date()` |

### Textos

| Tipo        | Descrição            | Exemplo                           |
| ----------- | -------------------- | --------------------------------- |
| `text`      | Múltiplos parágrafos | `"Lorem ipsum..."`                |
| `paragraph` | Parágrafo completo   | `"Lorem ipsum dolor sit amet..."` |
| `sentence`  | Sentença             | `"Lorem ipsum dolor."`            |

### Endereços

| Tipo      | Descrição         | Exemplo             |
| --------- | ----------------- | ------------------- |
| `address` | Endereço completo | `"123 Main Street"` |
| `city`    | Cidade            | `"New York"`        |
| `country` | País              | `"United States"`   |
| `zipCode` | CEP/Código Postal | `"12345-678"`       |

### Outros

| Tipo      | Descrição       | Exemplo                       |
| --------- | --------------- | ----------------------------- |
| `url`     | URL             | `"https://example.com"`       |
| `boolean` | Booleano        | `true` ou `false`             |
| `company` | Nome de empresa | `"Acme Corp"`                 |
| `image`   | URL de imagem   | `"https://picsum.photos/200"` |
| `json`    | Objeto JSON     | `"{\"key\":\"value\"}"`       |

### Tipos Especiais

#### Enum

```typescript
{
  status: {
    type: 'enum',
    enumValues: ['ACTIVE', 'INACTIVE', 'PENDING']
  }
}
```

#### Custom

```typescript
{
  customField: {
    type: 'custom',
    customFn: (index) => `custom-${index}`
  }
}
```

## 🎛️ Configurações Avançadas

### Valores Únicos

Garante que não haverá valores duplicados:

```typescript
{
  email: {
    type: 'email',
    unique: true
  }
}
```

### Campos Opcionais

Permite valores `null` com probabilidade configurável:

```typescript
{
  bio: {
    type: 'paragraph',
    optional: true,
    nullProbability: 0.3  // 30% de chance de ser null
  }
}
```

### Dados Estáticos

Valores fixos aplicados a todos os registros:

```typescript
{
  model: 'user',
  count: 50,
  fields: {
    name: { type: 'fullName' }
  },
  staticData: {
    role: 'USER',
    isVerified: false
  }
}
```

### Hooks

#### beforeCreate

Modifica dados antes de inserir:

```typescript
{
  model: 'user',
  count: 10,
  fields: {
    password: { type: 'password' }
  },
  beforeCreate: async (data, index) => {
    // Hash da senha
    data.password = await bcrypt.hash(data.password, 10);
    return data;
  }
}
```

#### afterCreate

Executa ações após inserir:

```typescript
{
  model: 'user',
  count: 10,
  fields: {
    email: { type: 'email' }
  },
  afterCreate: async (data, index) => {
    console.log(`Usuário ${data.email} criado!`);
    // Enviar email de boas-vindas
  }
}
```

### Relacionamentos

```typescript
// Primeiro cria os usuários
await seeder.seed({
  model: "user",
  count: 10,
  fields: {
    id: { type: "uuid" },
    email: { type: "email" },
  },
});

// Busca IDs dos usuários criados
const users = await prisma.user.findMany({ select: { id: true } });
const userIds = users.map((u) => u.id);

// Cria posts relacionados
await seeder.seed({
  model: "post",
  count: 50,
  fields: {
    title: { type: "sentence" },
    content: { type: "paragraph" },
    userId: {
      type: "custom",
      customFn: () => faker.helpers.arrayElement(userIds),
    },
  },
});
```

## 🔧 ORMs Suportados

### Prisma (Recomendado)

```typescript
import { PrismaClient } from "@prisma/client";

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
    /* ... */
  },
});
```

### TypeORM

```typescript
import { DataSource } from "typeorm";
import { User } from "./entities/User";

const dataSource = new DataSource({
  /* config */
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
    /* ... */
  },
});
```

### Sequelize

```typescript
import { User } from "./models/User";

const seeder = new SeedGenerator({
  orm: "sequelize",
  client: User,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    /* ... */
  },
});
```

### Mongoose

```typescript
import { User } from "./models/User";

const seeder = new SeedGenerator({
  orm: "mongoose",
  client: User,
  verbose: true,
});

await seeder.seed({
  model: "user",
  count: 50,
  fields: {
    /* ... */
  },
});
```

## 📚 Exemplos Práticos

### E-commerce Completo

```typescript
import { faker } from "@faker-js/faker";

await seeder.seed([
  // Usuários
  {
    model: "user",
    count: 100,
    fields: {
      email: { type: "email", unique: true },
      name: { type: "fullName" },
      password: { type: "password" },
      phone: { type: "phone", optional: true },
      avatar: { type: "avatar", optional: true },
      createdAt: { type: "pastDate" },
    },
    beforeCreate: async (data) => {
      data.password = await hashPassword(data.password);
      return data;
    },
  },

  // Categorias
  {
    model: "category",
    count: 10,
    fields: {
      name: { type: "string" },
      slug: { type: "slug", unique: true },
      description: { type: "paragraph" },
    },
  },

  // Produtos
  {
    model: "product",
    count: 500,
    fields: {
      name: { type: "sentence" },
      slug: { type: "slug", unique: true },
      description: { type: "paragraph" },
      price: { type: "float", min: 10, max: 5000, precision: 0.01 },
      stock: { type: "int", min: 0, max: 1000 },
      image: { type: "image" },
      rating: { type: "float", min: 0, max: 5, precision: 0.1 },
      isActive: { type: "boolean" },
      tags: {
        type: "custom",
        customFn: () =>
          faker.helpers.arrayElements(
            ["eletrônicos", "casa", "moda", "esportes"],
            { min: 1, max: 3 }
          ),
      },
    },
  },

  // Pedidos
  {
    model: "order",
    count: 300,
    fields: {
      orderNumber: {
        type: "custom",
        customFn: (i) => `ORD-${Date.now()}-${i}`,
      },
      status: {
        type: "enum",
        enumValues: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
      },
      total: { type: "float", min: 50, max: 2000, precision: 0.01 },
      createdAt: { type: "pastDate" },
    },
  },
]);
```

### Blog com Relacionamentos

```typescript
// 1. Criar usuários
await seeder.seed({
  model: "user",
  count: 20,
  fields: {
    email: { type: "email", unique: true },
    username: { type: "string", unique: true },
    name: { type: "fullName" },
    bio: { type: "paragraph", optional: true },
    avatar: { type: "avatar" },
  },
});

// 2. Buscar IDs dos usuários
const users = await prisma.user.findMany({ select: { id: true } });
const userIds = users.map((u) => u.id);

// 3. Criar posts
await seeder.seed({
  model: "post",
  count: 100,
  fields: {
    title: { type: "sentence" },
    slug: { type: "slug", unique: true },
    content: { type: "paragraph" },
    excerpt: { type: "sentence" },
    coverImage: { type: "image" },
    published: { type: "boolean" },
    views: { type: "int", min: 0, max: 10000 },
    authorId: {
      type: "custom",
      customFn: () => faker.helpers.arrayElement(userIds),
    },
  },
});

// 4. Buscar IDs dos posts
const posts = await prisma.post.findMany({ select: { id: true } });
const postIds = posts.map((p) => p.id);

// 5. Criar comentários
await seeder.seed({
  model: "comment",
  count: 500,
  fields: {
    content: { type: "paragraph" },
    postId: {
      type: "custom",
      customFn: () => faker.helpers.arrayElement(postIds),
    },
    authorId: {
      type: "custom",
      customFn: () => faker.helpers.arrayElement(userIds),
    },
  },
});
```

### Sistema de Eventos

```typescript
await seeder.seed({
  model: "event",
  count: 50,
  fields: {
    title: { type: "sentence" },
    description: { type: "paragraph" },
    location: { type: "address" },
    city: { type: "city" },
    country: { type: "country" },
    startDate: { type: "futureDate" },
    endDate: { type: "futureDate" },
    capacity: { type: "int", min: 10, max: 1000 },
    price: { type: "float", min: 0, max: 500, precision: 0.01 },
    category: {
      type: "enum",
      enumValues: ["TECH", "MUSIC", "SPORTS", "EDUCATION", "BUSINESS"],
    },
    isOnline: { type: "boolean" },
    meetingUrl: {
      type: "url",
      optional: true,
    },
  },
  beforeCreate: (data) => {
    // Se for online, sempre tem URL
    if (data.isOnline) {
      data.meetingUrl = faker.internet.url();
    }
    // EndDate deve ser depois de startDate
    data.endDate = new Date(data.startDate.getTime() + 86400000); // +1 dia
    return data;
  },
});
```

## 📖 API Reference

### SeedGenerator

#### Constructor

```typescript
new SeedGenerator(options: SeedGeneratorOptions)
```

**Parâmetros:**

- `orm`: Tipo do ORM (`'prisma'` | `'typeorm'` | `'sequelize'` | `'mongoose'`)
- `client`: Cliente/Repository do ORM
- `verbose?`: Exibir logs (padrão: `true`)

#### Métodos

##### seed()

```typescript
async seed(configs: SeedConfig | SeedConfig[]): Promise<void>
```

Executa a geração e inserção de dados.

### SeedConfig

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

### FieldConfig

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

## 🎯 Boas Práticas

### 1. Sempre use em desenvolvimento

```typescript
if (process.env.NODE_ENV !== "development") {
  console.log("⚠️ Seeds só em desenvolvimento!");
  return;
}
```

### 2. Limpe o banco antes

```typescript
// Prisma
await prisma.user.deleteMany();
await prisma.post.deleteMany();

// Em seguida execute o seed
await seeder.seed(/* ... */);
```

### 3. Ordem de criação

Crie registros pai antes dos filhos:

```typescript
// ✅ Correto
await seeder.seed([
  { model: "user" /* ... */ }, // Pai
  { model: "post" /* ... */ }, // Filho (tem userId)
]);

// ❌ Errado
await seeder.seed([
  { model: "post" /* ... */ }, // Filho
  { model: "user" /* ... */ }, // Pai
]);
```

### 4. Use valores únicos quando necessário

```typescript
{
  email: { type: 'email', unique: true },
  username: { type: 'string', unique: true }
}
```

### 5. Hash de senhas

```typescript
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
```

### 6. Quantidade realista

```typescript
// ✅ Bom para desenvolvimento
{ model: 'user', count: 50 }
{ model: 'post', count: 200 }

// ❌ Pode deixar o banco lento
{ model: 'user', count: 100000 }
```

### 7. Organize em arquivos separados

```
prisma/
├── seed.ts              # Arquivo principal
├── seeds/
│   ├── user.seed.ts     # Seeds de usuários
│   ├── post.seed.ts     # Seeds de posts
│   └── product.seed.ts  # Seeds de produtos
```

## 🐛 Troubleshooting

### Erro: "customFn é obrigatório para tipo 'custom'"

**Solução:** Forneça a função customFn:

```typescript
{
  field: {
    type: 'custom',
    customFn: (index) => `valor-${index}`
  }
}
```

### Erro: "enumValues é obrigatório para tipo 'enum'"

**Solução:** Forneça os valores do enum:

```typescript
{
  status: {
    type: 'enum',
    enumValues: ['ACTIVE', 'INACTIVE']
  }
}
```

### Erro: "Não foi possível gerar valor único"

**Problema:** Muitos registros com campo único limitado.

**Solução:** Aumente a variedade ou reduza a quantidade:

```typescript
// ❌ Problema
{
  count: 1000,
  fields: {
    name: { type: 'firstName', unique: true } // Poucos nomes disponíveis
  }
}

// ✅ Solução
{
  count: 1000,
  fields: {
    email: { type: 'email', unique: true } // Infinitas combinações
  }
}
```

### Erro: "Cliente Prisma não fornecido"

**Solução:** Passe o cliente corretamente:

```typescript
const prisma = new PrismaClient();

const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma, // ← Não esqueça!
  verbose: true,
});
```

### Seeds não aparecem no banco

**Verificar:**

1. Conexão com banco está correta?
2. Modelo/tabela existe?
3. Permissões de escrita?
4. Verificar logs com `verbose: true`

```typescript
const seeder = new SeedGenerator({
  orm: "prisma",
  client: prisma,
  verbose: true, // ← Ative os logs
});
```

### Performance lenta

**Soluções:**

1. Reduza a quantidade de registros
2. Desative hooks se não necessários
3. Use transações (se o ORM suportar)
4. Crie índices apropriados

```typescript
// Criar em lotes menores
for (let i = 0; i < 10; i++) {
  await seeder.seed({
    model: "user",
    count: 100, // 100 por vez
    fields: {
      /* ... */
    },
  });
}
```

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Consulte os [Exemplos Práticos](#-exemplos-práticos)
3. Abra uma issue no GitHub

---

Feito com ❤️ para facilitar o desenvolvimento
