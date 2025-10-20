---
title: Guard - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Guard - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides a guard method to bulk add hooks and schema to multiple routes at once.

    - - meta
      - property: 'og:description'
        content: Elysia provides a guard method to bulk add hooks and schema to multiple routes at once.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Guard

애플리케이션에 여러 hook을 적용해야 할 때, hook을 여러 번 반복하는 대신 `guard`를 사용하여 애플리케이션에 hook을 일괄적으로 추가할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.onBeforeHandle(({ query: { name }, status }) => { // [!code --]
		if(!name) return status(401) // [!code --]
	}) // [!code --]
	.onBeforeHandle(({ query: { name } }) => { // [!code --]
		console.log(name) // [!code --]
	}) // [!code --]
	.onAfterResponse(({ responseValue }) => { // [!code --]
		console.log(responseValue) // [!code --]
	}) // [!code --]
	.guard({ // [!code ++]
		beforeHandle: [ // [!code ++]
			({ query: { name }, status }) => { // [!code ++]
				if(!name) return status(401) // [!code ++]
			}, // [!code ++]
			({ query: { name } }) => { // [!code ++]
				console.log(name) // [!code ++]
			} // [!code ++]
		], // [!code ++]
		afterResponse({ responseValue }) { // [!code ++]
			console.log(responseValue) // [!code ++]
		} // [!code ++]
	}) // [!code ++]
	.get(
		'/auth',
		({ query: { name = 'anon' } }) => `Hello ${name}!`,
		{
			query: t.Object({
				name: t.String()
			})
		}
	)
	.get(
		'/profile',
		({ query: { name = 'anon' } }) => `Hello ${name}!`,
		{
			query: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

뿐만 아니라 `guard`를 사용하여 여러 route에 **schema**를 적용할 수도 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		beforeHandle: [
			({ query: { name }, status }) => {
				if(!name) return status(401)
			},
			({ query: { name } }) => {
				console.log(name)
			}
		],
		afterResponse({ responseValue }) {
			console.log(responseValue)
		},
		query: t.Object({ // [!code ++]
			name: t.String() // [!code ++]
		}) // [!code ++]
	})
	.get(
		'/auth',
		({ query: { name = 'anon' } }) => `Hello ${name}!`,
		{ // [!code --]
			query: t.Object({ // [!code --]
				name: t.String() // [!code --]
			}) // [!code --]
		} // [!code --]
	)
	.get(
		'/profile',
		({ query: { name = 'anon' } }) => `Hello ${name}!`,
		{ // [!code --]
			query: t.Object({ // [!code --]
				name: t.String() // [!code --]
			}) // [!code --]
		} // [!code --]
	)
	.listen(3000)
```

이것은 같은 인스턴스에서 **.guard가 호출된 이후**의 모든 route에 hook과 schema를 적용합니다.

자세한 내용은 <DocLink href="/essential/plugin#guard">Guard</DocLink>를 참조하세요.

## 과제

2가지 유형의 hook을 실습해 봅시다.

<template #answer>

`beforeHandle`을 사용하여 handler에 도달하기 전에 요청을 가로채고, `status` 메서드로 응답을 반환할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onBeforeHandle(({ query: { name }, status }) => {
		if(!name) return status(401)
	})
	.get('/auth', ({ query: { name = 'anon' } }) => {
		return `Hello ${name}!`
	})
	.get('/profile', ({ query: { name = 'anon' } }) => {
		return `Hello ${name}!`
	})
	.listen(3000)
```

</template>

</Editor>
