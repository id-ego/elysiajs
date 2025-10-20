---
title: Prisma와의 통합 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Prisma와의 통합 - ElysiaJS

  - - meta
    - name: 'description'
      content: prismabox를 사용하여 데이터베이스에서 유효성 검사, 프론트엔드까지 엔드투엔드 타입 안전성을 생성할 수 있습니다.

  - - meta
    - name: 'og:description'
      content: prismabox를 사용하여 데이터베이스에서 유효성 검사, 프론트엔드까지 엔드투엔드 타입 안전성을 생성할 수 있습니다.
---

# Prisma
[Prisma](https://prisma.io)는 타입 안전한 방식으로 데이터베이스와 상호 작용할 수 있게 해주는 ORM입니다.

Prisma 스키마 파일을 사용하여 데이터베이스 스키마를 정의한 다음 해당 스키마를 기반으로 TypeScript 타입을 생성하는 방법을 제공합니다.

### Prismabox
[Prismabox](https://github.com/m1212e/prismabox)는 Prisma 스키마에서 TypeBox 또는 Elysia 유효성 검사 모델을 생성하는 라이브러리입니다.

Prismabox를 사용하여 Prisma 스키마를 Elysia 유효성 검사 모델로 변환할 수 있으며, 이를 통해 Elysia에서 타입 유효성 검사를 보장할 수 있습니다.

### 작동 방식:
1. Prisma Schema에서 데이터베이스 스키마를 정의합니다.
2. Elysia 스키마를 생성하기 위해 `prismabox` generator를 추가합니다.
3. 변환된 Elysia 유효성 검사 모델을 사용하여 타입 유효성 검사를 보장합니다.
4. Elysia 유효성 검사 모델에서 OpenAPI 스키마가 생성됩니다.
5. [Eden Treaty](/eden/overview)를 추가하여 프론트엔드에 타입 안전성을 추가합니다.

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  Documentation  |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |  prismabox  |          | ——————— |    * ——————————————— *
|  Prisma   | —————————-> |  Elysia  |
|           |             |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  Frontend Code  |
												    |                 |
												    * ——————————————— *

```

## 설치
Prisma를 설치하려면 다음 명령을 실행하세요:

```bash
bun add @prisma/client prismabox && \
bun add -d prisma
```

## Prisma 스키마
이미 `prisma/schema.prisma`가 있다고 가정합니다.

다음과 같이 Prisma 스키마 파일에 `prismabox` generator를 추가할 수 있습니다:

::: code-group

```ts [prisma/schema.prisma]
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator prismabox { // [!code ++]
  provider = "prismabox" // [!code ++]
  typeboxImportDependencyName = "elysia" // [!code ++]
  typeboxImportVariableName = "t" // [!code ++]
  inputModel = true // [!code ++]
  output   = "../generated/prismabox" // [!code ++]
} // [!code ++]

model User {
  id    String  @id @default(cuid())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id    	String  @id @default(cuid())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String
}
```

:::

이렇게 하면 `generated/prismabox` 디렉토리에 Elysia 유효성 검사 모델이 생성됩니다.

각 모델은 자체 파일을 가지며, 모델은 Prisma 모델 이름을 기반으로 명명됩니다.

예를 들어:
- `User` 모델은 `generated/prismabox/User.ts`로 생성됩니다
- `Post` 모델은 `generated/prismabox/Post.ts`로 생성됩니다

## 생성된 모델 사용
그런 다음 Elysia 애플리케이션에서 생성된 모델을 가져올 수 있습니다:

::: code-group

```ts [src/index.ts]
import { Elysia, t } from 'elysia'

import { PrismaClient } from '../generated/prisma' // [!code ++]
import { UserPlain, UserPlainInputCreate } from '../generated/prismabox/User' // [!code ++]

const prisma = new PrismaClient()

const app = new Elysia()
    .put(
        '/',
        async ({ body }) =>
            prisma.user.create({
                data: body
            }),
        {
            body: UserPlainInputCreate, // [!code ++]
            response: UserPlain // [!code ++]
        }
    )
    .get(
        '/id/:id',
        async ({ params: { id }, status }) => {
            const user = await prisma.user.findUnique({
                where: { id }
            })

            if (!user) return status(404, 'User not found')

            return user
        },
        {
            response: {
                200: UserPlain, // [!code ++]
                404: t.String() // [!code ++]
            }
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

:::

이를 통해 Elysia 유효성 검사 모델에서 데이터베이스 스키마를 재사용할 수 있습니다.

---

자세한 정보는 [Prisma](https://prisma.io) 및 [Prismabox](https://github.com/m1212e/prismabox) 문서를 참조하세요.
