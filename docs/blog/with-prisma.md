---
title: Accelerate your next Prisma server with Elysia
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Accelerate your next Prisma server with Elysia

    - - meta
      - name: 'description'
        content: With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accelerate our interaction with database, Elysia accelerate our creation of backend web server in term of both developer experience and performance.


    - - meta
      - property: 'og:description'
        content: With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accelerate our interaction with database, Elysia accelerate our creation of backend web server in term of both developer experience and performance.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/with-prisma/prism.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/with-prisma/prism.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
title="Accelerate your next Prisma server with Elysia"
src="/blog/with-prisma/prism.webp"
alt="Triangular Prism placing in the center"
author="saltyaom"
date="4 Jun 2023"
>
Prisma는 개발자 경험으로 유명한 TypeScript ORM입니다.

타입 안전하고 직관적인 API를 통해 유창하고 자연스러운 구문을 사용하여 데이터베이스와 상호 작용할 수 있습니다.

데이터베이스 쿼리 작성은 TypeScript 자동 완성으로 데이터의 형태를 작성하는 것만큼 간단하며, Prisma가 효율적인 SQL 쿼리를 생성하고 백그라운드에서 데이터베이스 연결을 처리합니다.

Prisma의 뛰어난 기능 중 하나는 다음과 같은 인기 있는 데이터베이스와의 원활한 통합입니다:
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB
- CockroachDB

따라서 Prisma가 제공하는 강력함과 성능을 타협하지 않으면서 프로젝트의 요구 사항에 가장 적합한 데이터베이스를 선택할 수 있는 유연성을 갖게 됩니다.

이는 정말 중요한 것, 즉 애플리케이션 로직 구축에 집중할 수 있다는 것을 의미합니다.

Prisma는 Elysia의 영감 중 하나입니다. 선언적 API와 유창한 개발자 경험은 함께 작업하기에 정말 즐겁습니다.

이제 [Bun 0.6.7 릴리스](https://bun.sh/blog/bun-v0.6.7)와 함께 오랫동안 기다려온 상상을 현실로 만들 수 있습니다. Bun은 이제 Prisma를 기본적으로 지원합니다.

## Elysia

Elysia는 Bun과 함께 어떤 프레임워크를 사용해야 하는지 물었을 때 떠오르는 답변 중 하나입니다.

물론 Bun과 함께 Express를 사용할 수 있지만, Elysia는 Bun을 위해 특별히 제작되었습니다.

Elysia는 Express보다 약 19배 빠른 성능을 내며, 통합 타입 시스템과 엔드 투 엔드 타입 안전성을 위한 선언적 API로 강화되었습니다.

Elysia는 특히 초기부터 Prisma와 함께 사용하도록 설계되었기 때문에 유창한 개발자 경험으로도 알려져 있습니다.

Elysia의 엄격한 타입 검증을 통해 선언적 API를 사용하여 Elysia와 Prisma를 쉽게 통합할 수 있습니다.

다시 말해, Elysia는 런타임 타입과 TypeScript의 타입이 항상 동기화되도록 보장하여, 타입 시스템을 완전히 신뢰할 수 있고 타입 오류를 미리 확인하며 타입과 관련된 오류를 더 쉽게 디버깅할 수 있도록 타입 엄격 언어처럼 동작하게 만듭니다.

## 설정하기

시작하기 위해 필요한 것은 `bun create`를 실행하여 Elysia 서버를 설정하는 것입니다.

```bash
bun create elysia elysia-prisma
```

여기서 `elysia-prisma`는 프로젝트 이름(폴더 대상)이며, 원하는 이름으로 자유롭게 변경할 수 있습니다.

이제 폴더에서 Prisma CLI를 dev dependency로 설치해 봅시다.
```ts
bun add -d prisma
```

그런 다음 `prisma init`으로 prisma 프로젝트를 설정할 수 있습니다.
```ts
bunx prisma init
```

`bunx`는 `npx`에 해당하는 bun 명령어로, 패키지 bin을 실행할 수 있게 해줍니다.

설정이 완료되면 Prisma가 `.env` 파일을 업데이트하고 내부에 **schema.prisma** 파일이 있는 **prisma**라는 폴더를 생성한 것을 볼 수 있습니다.

**schema.prisma**는 Prisma의 스키마 언어로 정의된 데이터베이스 모델입니다.

데모를 위해 **schema.prisma** 파일을 다음과 같이 업데이트해 봅시다:
```ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  username  String  @unique
  password  String
}
```

이것은 Prisma에게 다음 컬럼으로 **User**라는 테이블을 생성하라고 알려줍니다:
| Column | Type | Constraint |
| --- | --- | --- |
| id  | Number | Primary Key with auto increment |
| username | String | Unique |
| password | String | - |

Prisma는 스키마를 읽고 `.env` 파일에서 DATABASE_URL을 읽으므로, 데이터베이스를 동기화하기 전에 먼저 `DATABASE_URL`을 정의해야 합니다.

실행 중인 데이터베이스가 없으므로 docker를 사용하여 하나를 설정할 수 있습니다:
```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
```

이제 프로젝트 루트의 `.env` 파일로 이동하여 편집합니다:
```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/db?schema=public"
```

그런 다음 `prisma migrate`를 실행하여 데이터베이스를 Prisma 스키마와 동기화할 수 있습니다:
```bash
bunx prisma migrate dev --name init
```

Prisma는 스키마를 기반으로 강력한 타입의 Prisma Client 코드를 생성합니다.

이는 코드 편집기에서 자동 완성과 타입 검사를 받을 수 있다는 것을 의미하며, 런타임이 아닌 컴파일 타임에 잠재적인 오류를 포착할 수 있습니다.

## 코드 작성하기

**src/index.ts**에서 Elysia 서버를 업데이트하여 간단한 사용자 가입 엔드포인트를 만들어 봅시다.

```ts
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client' // [!code ++]

const db = new PrismaClient() // [!code ++]

const app = new Elysia()
    .post( // [!code ++]
        '/sign-up', // [!code ++]
        async ({ body }) => db.user.create({ // [!code ++]
            data: body // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

Elysia와 Prisma를 사용하여 데이터베이스에 새 사용자를 삽입하는 간단한 엔드포인트를 만들었습니다.

::: tip
**중요한 점**은 Prisma 함수를 반환할 때 항상 콜백 함수를 async로 표시해야 한다는 것입니다.

Prisma 함수는 네이티브 Promise를 반환하지 않기 때문에 Elysia는 커스텀 promise 타입을 동적으로 처리할 수 없지만, 정적 코드 분석을 통해 콜백 함수를 async로 표시하면 Elysia가 함수의 반환 타입을 await하려고 시도하여 Prisma 결과를 매핑할 수 있습니다.
:::

이제 문제는 body가 무엇이든 될 수 있으며, 예상한 정의된 타입으로 제한되지 않는다는 것입니다.

Elysia의 타입 시스템을 사용하여 이를 개선할 수 있습니다.
```ts
import { Elysia, t } from 'elysia' // [!code ++]
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/sign-up',
        async ({ body }) => db.user.create({
            data: body
        }),
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String({ // [!code ++]
                    minLength: 8 // [!code ++]
                }) // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

이것은 Elysia에게 들어오는 요청의 body가 형태와 일치하는지 검증하고, 콜백 내부의 `body`의 TypeScript 타입을 정확히 동일한 타입으로 업데이트하도록 알려줍니다:
```ts
// 'body'는 이제 다음과 같이 타입이 지정됩니다:
{
    username: string
    password: string
}
```

이는 형태가 데이터베이스 테이블과 맞지 않으면 즉시 경고를 받는다는 것을 의미합니다.

테이블을 편집하거나 마이그레이션을 수행해야 할 때 효과적입니다. Elysia는 프로덕션에 도달하기 전에 타입 충돌로 인해 줄별로 오류를 즉시 로그할 수 있습니다.

## 오류 처리
`username` 필드는 고유하므로, 다음과 같이 가입을 시도할 때 `username`의 우연한 중복이 있을 수 있어 Prisma가 오류를 던질 수 있습니다:
```ts
Invalid `prisma.user.create()` invocation:

Unique constraint failed on the fields: (`username`)
```

기본 Elysia의 오류 핸들러가 이 경우를 자동으로 처리할 수 있지만, Elysia의 로컬 `onError` 훅을 사용하여 커스텀 오류를 지정함으로써 이를 개선할 수 있습니다:
```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {  // [!code ++]
                switch (code) {  // [!code ++]
                    // Prisma P2002: "Unique constraint failed on the {constraint}"  // [!code ++]
                    case 'P2002':  // [!code ++]
                        return {  // [!code ++]
                            error: 'Username must be unique'  // [!code ++]
                        }  // [!code ++]
                }  // [!code ++]
            },  // [!code ++]
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            })
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

`error` 훅을 사용하면, 콜백 내에서 던져진 모든 오류가 `error` 훅으로 전달되어 커스텀 오류 핸들러를 정의할 수 있습니다.

[Prisma 문서](https://www.prisma.io/docs/reference/api-reference/error-reference#p2002)에 따르면, 오류 코드 'P2002'는 쿼리를 수행하면 고유 제약 조건에 실패한다는 것을 의미합니다.

이 테이블에는 고유한 `username` 필드만 있으므로, 오류는 username이 고유하지 않아서 발생한다고 추론할 수 있으며, 다음과 같은 커스텀 오류 메시지를 반환합니다:
```ts
{
    error: 'Username must be unique'
}
```

이것은 고유 제약 조건이 실패했을 때 커스텀 오류 메시지와 동등한 JSON을 반환합니다.

이를 통해 Prisma 오류에서 커스텀 오류를 원활하게 정의할 수 있습니다.

## 보너스: Reference Schema
서버가 복잡해지고 타입이 더 중복되고 보일러플레이트가 되면, Elysia 타입을 인라인으로 작성하는 것은 **Reference Schema**를 사용하여 개선할 수 있습니다.

간단히 말해서, 스키마에 이름을 지정하고 이름을 사용하여 타입을 참조할 수 있습니다.

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .model({ // [!code ++]
        'user.sign': t.Object({ // [!code ++]
            username: t.String(), // [!code ++]
            password: t.String({ // [!code ++]
                minLength: 8 // [!code ++]
            }) // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {
                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: 'user.sign', // [!code ++]
            body: t.Object({ // [!code --]
                username: t.String(), // [!code --]
                password: t.String({ // [!code --]
                    minLength: 8 // [!code --]
                }) // [!code --]
            }) // [!code --]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

이것은 인라인을 사용하는 것과 동일하게 작동하지만, 대신 한 번 정의하고 이름으로 스키마를 참조하여 중복된 검증 코드를 제거합니다.

TypeScript와 검증 코드는 예상대로 작동합니다.

## 보너스: 문서화
보너스로, Elysia 타입 시스템은 OpenAPI Schema 3.0을 준수하며, 이는 Swagger와 같은 OpenAPI Schema를 지원하는 도구로 문서를 생성할 수 있다는 것을 의미합니다.

Elysia Swagger 플러그인을 사용하여 한 줄로 API 문서를 생성할 수 있습니다.

```bash
bun add @elysiajs/swagger
```

그리고 플러그인을 추가하기만 하면 됩니다:

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { swagger } from '@elysiajs/swagger' // [!code ++]

const db = new PrismaClient()

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .post(
        '/',
        async ({ body }) =>
            db.user.create({
                data: body,
                select: { // [!code ++]
                    id: true, // [!code ++]
                    username: true // [!code ++]
                } // [!code ++]
            }),
        {
            error({ code }) {
                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            }),
            response: t.Object({ // [!code ++]
                id: t.Number(), // [!code ++]
                username: t.String() // [!code ++]
            }) // [!code ++]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

그것이 API를 위한 잘 정의된 문서를 만드는 데 필요한 전부입니다.

<img class="-png" src="/blog/with-prisma/swagger.webp" alt="Swagger documentation generated by Elysia" />

문서를 위한 엄격한 타입을 정의한 덕분에, API에서 `password` 필드를 반환하는 실수를 했다는 것을 발견했습니다. 이는 개인 정보를 반환하는 것이 좋지 않은 생각입니다.

Elysia의 타입 시스템 덕분에, 응답에 `password`가 포함되어서는 안 된다고 정의했으며, 이는 자동으로 Prisma 쿼리가 password를 반환하고 있다고 경고하여 미리 수정할 수 있게 해줍니다.

그리고 더 나아가, OpenAPI Schema 3.0의 사양을 잊어버릴 걱정을 할 필요가 없습니다. 자동 완성과 타입 안전성도 있기 때문입니다.

경로 세부 정보를 OpenAPI Schema 3.0을 따르는 `detail`로 정의할 수 있어 손쉽게 문서를 적절히 만들 수 있습니다.

## 다음 단계
Bun과 Elysia와 함께 Prisma를 지원하면서, 우리는 새로운 수준의 개발자 경험이라는 새로운 시대에 진입하고 있습니다.

Prisma는 데이터베이스와의 상호 작용을 가속화할 수 있고, Elysia는 개발자 경험과 성능 측면에서 백엔드 웹 서버 생성을 가속화합니다.

> 함께 작업하는 것이 정말 즐겁습니다.

Elysia는 Go와 Rust의 성능에 맞먹는 고성능 TypeScript 서버를 위한 더 나은 개발자 경험의 새로운 표준을 만드는 여정에 있습니다.

Bun에 대해 배우기 시작할 곳을 찾고 있다면, 특히 코드 생성 없이 REST 표준에 구축된 tRPC와 같은 [엔드 투 엔드 타입 안전성](/eden/overview)으로 Elysia가 제공할 수 있는 것을 살펴보는 것을 고려해보세요.

Elysia에 관심이 있다면 [Discord 서버](https://discord.gg/eaFJ2KDJck)를 방문하거나 [GitHub의 Elysia](https://github.com/elysiajs/elysia)를 확인해보세요.
</Blog>
