---
title: Standalone Schema - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Standalone Schema - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to use standalone schemas in Elysia to define reusable validation schemas that coexist with route-specific schemas.

    - - meta
      - property: 'og:description'
        content: Learn how to use standalone schemas in Elysia to define reusable validation schemas that coexist with route-specific schemas.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Standalone Schema

<DocLink href="/essential/validation.html#guard">Guard</DocLink>를 사용하여 스키마를 정의하면 스키마가 라우트에 추가됩니다. 하지만 라우트가 스키마를 제공하면 **덮어쓰여집니다**:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			// This will override the guard schema
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

스키마가 라우트 스키마와 **공존**하도록 하려면 **standalone schema**로 정의할 수 있습니다:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		// body will have both age and name property
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

## Schema Library Interoperability

standalone schema 간의 스키마는 서로 다른 검증 라이브러리를 사용할 수 있습니다.

예를 들어 **zod**를 사용하여 standalone schema를 정의하고 **Elysia.t**를 사용하여 로컬 스키마를 정의하면 둘 다 상호 교환 가능하게 작동합니다.

## Assignment

standalone schema를 사용하여 요청 본문에서 `age`와 `name` 속성을 모두 필수로 만들어 봅시다.

<template #answer>

가드 옵션에 `schema: 'standalone'`을 추가하여 standalone schema를 정의할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

</template>

</Editor>
