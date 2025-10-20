---
title: Drizzle와의 통합 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Drizzle와의 통합 - ElysiaJS

  - - meta
    - name: 'description'
      content: drizzle-typebox를 사용하여 데이터베이스에서 검증, 프론트엔드까지 end-to-end 타입 안전성을 만들 수 있습니다

  - - meta
    - name: 'og:description'
      content: drizzle-typebox를 사용하여 데이터베이스에서 검증, 프론트엔드까지 end-to-end 타입 안전성을 만들 수 있습니다
---

# Drizzle
Drizzle ORM은 타입 안전성과 개발자 경험에 중점을 둔 헤드리스 TypeScript ORM입니다.

`drizzle-typebox`를 사용하여 Drizzle 스키마를 Elysia 검증 모델로 변환할 수 있습니다.

### Drizzle Typebox
[Elysia.t](/essential/validation.html#elysia-type)는 TypeBox의 포크이므로 Elysia에서 직접 모든 TypeBox 타입을 사용할 수 있습니다.

["drizzle-typebox"](https://npmjs.org/package/drizzle-typebox)를 사용하여 Drizzle 스키마를 TypeBox 스키마로 변환하고 Elysia의 스키마 검증에서 직접 사용할 수 있습니다.

### 작동 방식:
1. Drizzle에서 데이터베이스 스키마를 정의합니다.
2. `drizzle-typebox`를 사용하여 Drizzle 스키마를 Elysia 검증 모델로 변환합니다.
3. 변환된 Elysia 검증 모델을 사용하여 타입 검증을 보장합니다.
4. OpenAPI 스키마가 Elysia 검증 모델에서 생성됩니다.
5. [Eden Treaty](/eden/overview)를 추가하여 프론트엔드에 타입 안전성을 추가합니다.

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  Documentation  |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |   drizzle-  |          | ——————— |    * ——————————————— *
|  Drizzle  | —————————-> |  Elysia  |
|           |  -typebox   |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  Frontend Code  |
												    |                 |
												    * ——————————————— *

```

## 설치
Drizzle을 설치하려면 다음 명령을 실행하세요:

```bash
bun add drizzle-orm drizzle-typebox
```

그런 다음 `drizzle-typebox`와 `Elysia` 간에 버전 불일치가 있을 수 있으므로 `@sinclair/typebox`를 고정해야 합니다. 이는 두 버전 간의 Symbol 충돌을 일으킬 수 있습니다.

다음 명령을 사용하여 `elysia`에서 사용하는 **최소 버전**으로 `@sinclair/typebox` 버전을 고정하는 것을 권장합니다:
```bash
grep "@sinclair/typebox" node_modules/elysia/package.json
```

`package.json`의 `overrides` 필드를 사용하여 `@sinclair/typebox` 버전을 고정할 수 있습니다:
```json
{
  "overrides": {
  	"@sinclair/typebox": "0.32.4"
  }
}
```

## Drizzle 스키마
코드베이스에 다음과 같은 `user` 테이블이 있다고 가정합니다:

::: code-group

```ts [src/database/schema.ts]
import {
    pgTable,
    varchar,
    timestamp
} from 'drizzle-orm/pg-core'

import { createId } from '@paralleldrive/cuid2'

export const user = pgTable(
    'user',
    {
        id: varchar('id')
            .$defaultFn(() => createId())
            .primaryKey(),
        username: varchar('username').notNull().unique(),
        password: varchar('password').notNull(),
        email: varchar('email').notNull().unique(),
        salt: varchar('salt', { length: 64 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    }
)

export const table = {
	user
} as const

export type Table = typeof table
```

:::

## drizzle-typebox
`drizzle-typebox`를 사용하여 `user` 테이블을 TypeBox 모델로 변환할 수 있습니다:

::: code-group

```ts [src/index.ts]
import { t } from 'elysia'
import { createInsertSchema } from 'drizzle-typebox'
import { table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	// 이메일을 Elysia의 이메일 타입으로 교체
	email: t.String({ format: 'email' })
})

new Elysia()
	.post('/sign-up', ({ body }) => {
		// 새 사용자 생성
	}, {
		body: t.Omit(
			_createUser,
			['id', 'salt', 'createdAt']
		)
	})
```

:::

이를 통해 Elysia 검증 모델에서 데이터베이스 스키마를 재사용할 수 있습니다.

## Type instantiation is possibly infinite
**Type instantiation is possibly infinite**와 같은 오류가 발생하면 `drizzle-typebox`와 `Elysia` 간의 순환 참조 때문입니다.

drizzle-typebox의 타입을 Elysia 스키마에 중첩하면 타입 인스턴스화의 무한 루프가 발생합니다.

이를 방지하려면 `drizzle-typebox`와 `Elysia` 스키마 사이에 **타입을 명시적으로 정의**해야 합니다:
```ts
import { t } from 'elysia'
import { createInsertSchema } from 'drizzle-typebox'

import { table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	email: t.String({ format: 'email' })
})

// ✅ 이것은 작동합니다. `drizzle-typebox`의 타입을 참조합니다
const createUser = t.Omit(
	_createUser,
	['id', 'salt', 'createdAt']
)

// ❌ 이것은 타입 인스턴스화의 무한 루프를 일으킵니다
const createUser = t.Omit(
	createInsertSchema(table.user, {
		email: t.String({ format: 'email' })
	}),
	['id', 'salt', 'createdAt']
)
```

Elysia 타입을 사용하려면 항상 `drizzle-typebox`에 대한 변수를 선언하고 참조하세요.

## Utility
특정 필드를 제외하거나 포함하기 위해 `t.Pick`과 `t.Omit`을 사용할 가능성이 높으므로 프로세스를 반복하는 것이 번거로울 수 있습니다:

프로세스를 단순화하기 위해 이러한 유틸리티 함수 **(그대로 복사)**를 사용하는 것을 권장합니다:

::: code-group

```ts [src/database/utils.ts]
/**
 * @lastModified 2025-02-04
 * @see https://elysiajs.com/recipe/drizzle.html#utility
 */

import { Kind, type TObject } from '@sinclair/typebox'
import {
    createInsertSchema,
    createSelectSchema,
    BuildSchema,
} from 'drizzle-typebox'

import { table } from './schema'
import type { Table } from 'drizzle-orm'

type Spread<
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined,
> =
    T extends TObject<infer Fields>
        ? {
              [K in keyof Fields]: Fields[K]
          }
        : T extends Table
          ? Mode extends 'select'
              ? BuildSchema<
                    'select',
                    T['_']['columns'],
                    undefined
                >['properties']
              : Mode extends 'insert'
                ? BuildSchema<
                      'insert',
                      T['_']['columns'],
                      undefined
                  >['properties']
                : {}
          : {}

/**
 * Drizzle 스키마를 일반 객체로 펼치기
 */
export const spread = <
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined,
>(
    schema: T,
    mode?: Mode,
): Spread<T, Mode> => {
    const newSchema: Record<string, unknown> = {}
    let table

    switch (mode) {
        case 'insert':
        case 'select':
            if (Kind in schema) {
                table = schema
                break
            }

            table =
                mode === 'insert'
                    ? createInsertSchema(schema)
                    : createSelectSchema(schema)

            break

        default:
            if (!(Kind in schema)) throw new Error('Expect a schema')
            table = schema
    }

    for (const key of Object.keys(table.properties))
        newSchema[key] = table.properties[key]

    return newSchema as any
}

/**
 * Drizzle 테이블을 일반 객체로 펼치기
 *
 * `mode`가 'insert'인 경우 스키마는 삽입을 위해 정제됩니다
 * `mode`가 'select'인 경우 스키마는 선택을 위해 정제됩니다
 * `mode`가 undefined인 경우 스키마는 그대로 펼쳐지며 모델은 수동으로 정제해야 합니다
 */
export const spreads = <
    T extends Record<string, TObject | Table>,
    Mode extends 'select' | 'insert' | undefined,
>(
    models: T,
    mode?: Mode,
): {
    [K in keyof T]: Spread<T[K], Mode>
} => {
    const newSchema: Record<string, unknown> = {}
    const keys = Object.keys(models)

    for (const key of keys) newSchema[key] = spread(models[key], mode)

    return newSchema as any
}
```

:::

이 유틸리티 함수는 Drizzle 스키마를 일반 객체로 변환하여 속성 이름으로 선택할 수 있습니다:
```ts
// ✅ spread 유틸리티 함수 사용
const user = spread(table.user, 'insert')

const createUser = t.Object({
	id: user.id, // { type: 'string' }
	username: user.username, // { type: 'string' }
	password: user.password // { type: 'string' }
})

// ⚠️ t.Pick 사용
const _createUser = createInsertSchema(table.user)

const createUser = t.Pick(
	_createUser,
	['id', 'username', 'password']
)
```

### Table Singleton
싱글톤 패턴을 사용하여 테이블 스키마를 저장하는 것을 권장합니다. 이를 통해 코드베이스 어디에서나 테이블 스키마에 액세스할 수 있습니다:

::: code-group

```ts [src/database/model.ts]
import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: table.user,
	}, 'insert'),
	select: spreads({
		user: table.user,
	}, 'select')
} as const
```

:::

이를 통해 코드베이스 어디에서나 테이블 스키마에 액세스할 수 있습니다:

::: code-group

```ts [src/index.ts]
import { Elysia, t } from 'elysia'
import { db } from './database/model'

const { user } = db.insert

new Elysia()
	.post('/sign-up', ({ body }) => {
		// 새 사용자 생성
	}, {
		body: t.Object({
			id: user.username,
			username: user.username,
			password: user.password
		})
	})
```

:::

### Refinement

타입 정제가 필요한 경우 `createInsertSchema`와 `createSelectSchema`를 사용하여 스키마를 직접 정제할 수 있습니다.

::: code-group

```ts [src/database/model.ts]
import { t } from 'elysia'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'

import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: createInsertSchema(table.user, {
			email: t.String({ format: 'email' })
		}),
	}, 'insert'),
	select: spreads({
		user: createSelectSchema(table.user, {
			email: t.String({ format: 'email' })
		})
	}, 'select')
} as const
```

:::

위 코드에서 `user.email` 스키마를 정제하여 `format` 속성을 포함합니다.

`spread` 유틸리티 함수는 정제된 스키마를 건너뛰므로 그대로 사용할 수 있습니다.

---

자세한 정보는 [Drizzle ORM](https://orm.drizzle.team) 및 [Drizzle TypeBox](https://orm.drizzle.team/docs/typebox) 문서를 참조하세요.
