---
title: Validation - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Validation - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia offers built-in data validation using schemas to ensure request and response data integrity.

    - - meta
      - property: 'og:description'
        content: Elysia offers built-in data validation using schemas to ensure request and response data integrity.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Validation

Elysia는 기본적으로 데이터 유효성 검사를 제공합니다.

`Elysia.t`를 사용하여 스키마를 정의할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `Hello ${name}!`,
		{
			body: t.Object({
				name: t.String(),
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

스키마를 정의하면 Elysia는 데이터가 올바른 형태인지 확인합니다.

데이터가 스키마와 일치하지 않으면 Elysia는 **422 Unprocessable Entity** 오류를 반환합니다.

자세한 내용은 <DocLink href="/essential/validation">Validation</DocLink>을 참조하세요.

### Bring your own
또는 Elysia는 **Standard Schema**를 지원하므로 **zod**, **yup** 또는 **valibot**과 같이 선택한 라이브러리를 사용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `Hello ${name}!`,
		{
			body: z.object({
				name: z.string(),
				age: z.number()
			})
		}
	)
	.listen(3000)
```

모든 호환 가능한 스키마는 <DocLink href="/essential/validation#standard-schema">Standard Schema</DocLink>를 참조하세요.

## Validation Type
다음 속성의 유효성을 검사할 수 있습니다:

- `body`
- `query`
- `params`
- `headers`
- `cookie`
- `response`

스키마가 정의되면 Elysia는 타입을 추론하므로 TypeScript에서 별도의 스키마를 정의할 필요가 없습니다.

각 타입에 대해서는 <DocLink href="/essential/validation#schema-type">Schema Type</DocLink>을 참조하세요.

## Response Validation
`response`에 대한 유효성 검사 스키마를 정의하면 Elysia는 클라이언트에 전송하기 전에 응답의 유효성을 검사하고 응답에 대한 타입 검사를 수행합니다.

어떤 상태 코드를 검증할지 지정할 수도 있습니다:
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get(
		'/user',
		() => `Hello Elysia!`,
		{
			response: {
				200: t.Literal('Hello Elysia!'),
				418: t.Object({
					message: t.Literal("I'm a teapot")
				})
			}
		}
	)
	.listen(3000)
```

자세한 내용은 <DocLink href="/essential/validation#response">Response Validation</DocLink>을 참조하세요.

## 과제

배운 내용을 실습해 봅시다.

<template #answer>

`t.Object`를 사용하여 스키마를 정의하고 `body` 속성에 제공할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status, set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return status(418, 'Hello Elysia!')
	})
	.get('/docs', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

</template>

</Editor>
