---
title: Life Cycle - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Life Cycle - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Lifecycle hook is function that executed on a specific event during the request-response cycle.

    - - meta
      - property: 'og:description'
        content: Lifecycle hook is function that executed on a specific event during the request-response cycle.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Lifecycle

Lifecycle **hook**은 요청-응답 주기 동안 특정 이벤트에서 실행되는 함수입니다.

다음과 같은 특정 시점에 사용자 정의 로직을 실행할 수 있습니다:
- <DocLink href="/essential/life-cycle#request">request</DocLink> - 요청을 받았을 때
- <DocLink href="/essential/life-cycle#before-handle">beforeHandle</DocLink> - handler를 실행하기 전
- <DocLink href="/essential/life-cycle#after-response">afterResponse</DocLink> - 응답이 전송된 후 등
- <DocLink href="/essential/life-cycle#on-error-error-handling">error</DocLink> - 오류가 발생했을 때

이는 로깅, 인증 등과 같은 작업에 유용할 수 있습니다.

lifecycle hook을 등록하려면 route 메서드의 3번째 인수로 전달할 수 있습니다:

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => 'Hello Elysia!')
	.get('/auth', () => {
		console.log('This is executed after "beforeHandle"')

		return 'Oh you are lucky!'
	}, {
		beforeHandle({ request, status }) {
			console.log('This is executed before handler')

			if(Math.random() <= 0.5)
				return status(418)
		}
	})
	.get('/2', () => 'Hello Elysia!')
```

`beforeHandle`이 값을 반환하면 handler를 건너뛰고 대신 해당 값을 반환합니다.

이는 사용자가 인증되지 않은 경우 `401 Unauthorized` 응답을 반환하려는 인증과 같은 작업에 유용합니다.

자세한 설명은 <DocLink href="/essential/life-cycle">Life Cycle</DocLink>, <DocLink href="/essential/life-cycle#before-handle">Before Handle</DocLink>을 참조하세요.

## Hook

**lifecycle 이벤트**를 가로채는 함수입니다. <small>함수가 lifecycle 이벤트에 **"hook"**을 걸기 때문입니다</small>

Hook은 2가지 유형으로 분류할 수 있습니다:

1. <DocLink href="/essential/life-cycle#local-hook">Local Hook</DocLink> - 특정 route에서 실행
2. <DocLink href="/essential/life-cycle#interceptor-hook">Interceptor Hook</DocLink> - **hook이 등록된 후** 모든 route에서 실행

## Local Hook

local hook은 특정 route에서 실행됩니다.

local hook을 사용하려면 route handler에 hook을 인라인으로 추가할 수 있습니다:

```typescript
// Similar to previous code snippet
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => 'Hello Elysia!')
	.get('/auth', () => {
		console.log('Run after "beforeHandle"')

		return 'Oh you are lucky!'
	}, {
		// This is a Local Hook
		beforeHandle({ request, status }) {
			console.log('Run before handler')

			if(Math.random() <= 0.5)
				return status(418)
		}
	})
	.get('/2', () => 'Hello Elysia!')
```

## Interceptor Hook

현재 인스턴스에 대해서만 **hook이 호출된 후에 나오는** 모든 **handler에 hook을 등록**합니다.

interceptor hook을 추가하려면 `.on` 다음에 lifecycle 이벤트를 사용할 수 있습니다:

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => 'Hello Elysia!')
	.onBeforeHandle(({ request, status }) => {
		console.log('This is executed before handler')

		if(Math.random() <= 0.5)
			return status(418)
	})
	// "beforeHandle" is applied
	.get('/auth', () => {
		console.log('This is executed after "beforeHandle"')

		return 'Oh you are lucky!'
	})
	// "beforeHandle" is also applied
	.get('/2', () => 'Hello Elysia!')
```

Local Hook과 달리, Interceptor Hook은 hook이 등록된 후에 나오는 모든 route에 hook을 추가합니다.

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
