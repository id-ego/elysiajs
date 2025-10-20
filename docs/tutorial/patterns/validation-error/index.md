---
title: Validation Error - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Validation Error - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to customize validation error messages in Elysia, including providing detailed feedback for invalid inputs.

    - - meta
      - property: 'og:description'
        content: Learn how to customize validation error messages in Elysia, including providing detailed feedback for invalid inputs.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Validation Error

검증을 위해 `Elysia.t`를 사용하는 경우, 검증에 실패한 필드에 대한 커스텀 에러 메시지를 제공할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
					error: 'Age must be a number' // [!code ++]
				})
			}, {
				error: 'Body must be an object' // [!code ++]
			})
		}
	)
	.listen(3000)
```

Elysia는 기본 에러 메시지를 제공한 커스텀 메시지로 재정의합니다. <DocLink href="/patterns/error-handling.html#custom-validation-message">Custom Validation Message</DocLink>를 참조하세요.

## Validation Detail

기본적으로 Elysia는 다음과 같이 검증에 문제가 있는 내용을 설명하는 <DocLink href="/patterns/error-handling.html#validation-detail">Validation Detail</DocLink>도 제공합니다:

```json
{
	"type": "validation",
	"on": "params",
	"value": { "id": "string" },
	"property": "/id",
	"message": "id must be a number", // [!code ++]
	"summary": "Property 'id' should be one of: 'numeric', 'number'",
	"found": { "id": "string" },
	"expected": { "id": 0 },
	"errors": [
		{
			"type": 62,
			"schema": {
				"anyOf": [
					{ "format": "numeric", "default": 0, "type": "string" },
					{ "type": "number" }
				]
			},
			"path": "/id",
			"value": "string",
			"message": "Expected union value",
			"errors": [{ "iterator": {} }, { "iterator": {} }],
			"summary": "Property 'id' should be one of: 'numeric', 'number'"
		}
	]
}
```

하지만 커스텀 에러 메시지를 제공하면 <DocLink href="/patterns/error-handling.html#validation-detail">Validation Detail</DocLink>이 완전히 재정의됩니다.

검증 세부 정보를 다시 가져오려면 커스텀 에러 메시지를 <DocLink href="/patterns/error-handling.html#validation-detail">Validation Detail</DocLink> 함수로 감쌀 수 있습니다.

```typescript
import { Elysia, t, validationDetail } from 'elysia' // [!code ++]

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
					error: validationDetail('Age must be a number') // [!code ++]
				})
			}, {
				error: validationDetail('Body must be an object') // [!code ++]
			})
		}
	)
	.listen(3000)
```

## Assignment

Elysia의 context를 확장해 봅시다.

<template #answer>

스키마에 `error` 속성을 제공하여 커스텀 에러 메시지를 제공할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
                    error: 'thing' // [!code ++]
                })
			})
		}
	)
	.listen(3000)
```

</template>

</Editor>
