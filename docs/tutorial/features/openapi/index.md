---
title: OpenAPI - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia is built around OpenAPI, and support OpenAPI documentation out of the box.

    - - meta
      - property: 'og:description'
        content: Elysia is built around OpenAPI, and support OpenAPI documentation out of the box.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# OpenAPI

Elysia는 OpenAPI를 기반으로 구축되었으며, 기본적으로 OpenAPI 문서를 지원합니다.

<DocLink href="/patterns/openapi">OpenAPI 플러그인</DocLink>을 사용하여 API 문서를 표시할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

추가 후, <a href="/playground/preview" target="_blank">**/openapi**</a>에서 API 문서에 접근할 수 있습니다.

## Detail
OpenAPI 3.0 사양을 따르는 `detail` 필드를 통해 API를 문서화할 수 있습니다 (자동 완성 포함):

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			}),
			detail: { // [!code ++]
				summary: 'Create a user', // [!code ++]
				description: 'Create a user with age', // [!code ++]
				tags: ['User'], // [!code ++]
			} // [!code ++]
		}
	)
	.listen(3000)
```

## Reference Model
<DocLink href="https://elysiajs.com/essential/validation.html#reference-model">Reference Model</DocLink>을 사용하여 재사용 가능한 스키마를 정의할 수도 있습니다:

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.model({
		age: t.Object({ // [!code ++]
			age: t.Number() // [!code ++]
		}) // [!code ++]
	})
	.post(
		'/',
		({ body }) => body,
		{
			age: t.Object({ // [!code --]
				age: t.Number() // [!code --]
			}), // [!code --]
			body: 'age',  // [!code ++]
			detail: {
				summary: 'Create a user',
				description: 'Create a user with age',
				tags: ['User'],
			}
		}
	)
	.listen(3000)
```

reference model을 정의하면 OpenAPI 문서의 **Components** 섹션에 표시됩니다.

## Type Gen
<DocLink href="/blog/openapi-type-gen.html">OpenAPI Type Gen</DocLink>은 TypeScript 타입에서 직접 추론하여 **수동 주석 없이** API를 문서화할 수 있습니다. <small>Zod, TypeBox, 수동 인터페이스 선언 등이 필요 없습니다.</small>

**이 기능은 Elysia에만 있는 고유한 기능**이며, 다른 JavaScript 프레임워크에서는 사용할 수 없습니다.

예를 들어, Drizzle ORM이나 Prisma를 사용하는 경우, Elysia는 쿼리에서 직접 스키마를 추론할 수 있습니다.

![Drizzle](/blog/openapi-type-gen/drizzle-typegen.webp)

> Elysia route handler에서 Drizzle 쿼리를 반환하면 자동으로 OpenAPI 스키마로 추론됩니다.

<DocLink href="/blog/openapi-type-gen.html">OpenAPI Type Gen</DocLink>을 사용하려면 `openapi` 플러그인 전에 `fromTypes` 플러그인을 적용하기만 하면 됩니다.

```typescript
import { Elysia } from 'elysia'

import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi({
		references: fromTypes() // [!code ++]
	}))
	.get('/', { hello: 'world' })
	.listen(3000)
```

### Browser Environment

안타깝게도 이 기능은 소스 코드를 읽기 위해 **fs** 모듈이 필요하므로, Elysia가 브라우저에서 직접 실행되기 때문에 (별도의 서버가 아님) 이 웹 플레이그라운드에서는 사용할 수 없습니다.

<a href="https://github.com/SaltyAom/elysia-typegen-example" target="_blank">Type Gen Example repository</a>를 통해 로컬에서 이 기능을 시도해볼 수 있습니다:

```bash
git clone https://github.com/SaltyAom/elysia-typegen-example && \
cd elysia-typegen-example && \
bun install && \
bun run dev
```

## 과제

미리보기를 사용하여 **GET '/hono'**를 호출하고 Hono route가 작동하는지 확인해 보세요.

코드를 수정하고 어떻게 변경되는지 확인해 보세요!

</Editor>
