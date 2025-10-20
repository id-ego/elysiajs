---
title: Error Handling - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Error Handling - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to handle errors in Elysia, including custom error handling, error codes, and best practices for managing exceptions in your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to handle errors in Elysia, including custom error handling, error codes, and best practices for managing exceptions in your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Error Handling

<DocLink href="/essential/life-cycle#on-error-error-handling">onError</DocLink>는 **에러가 발생했을 때** 호출됩니다.

핸들러와 유사한 **context**를 받지만 다음과 같은 추가 항목이 있습니다:
- error - 발생한 에러
- <DocLink href="/essential/life-cycle#error-code">code</DocLink> - 에러 코드

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onError(({ error, code }) => {
		if(code === "NOT_FOUND")
			return 'uhe~ are you lost?'

		return status(418, "My bad! But I\'m cute so you'll forgive me, right?")
	})
	.get('/', () => 'ok')
	.listen(3000)
```

<DocLink href="/essential/handler#status">status</DocLink>를 반환하여 기본 에러 상태를 재정의할 수 있습니다.

## Custom Error

다음과 같이 <DocLink href="/essential/life-cycle#error-code">error code</DocLink>를 사용하여 커스텀 에러를 제공할 수 있습니다:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({ // [!code ++]
		'NICHE': NicheError // [!code ++]
	}) // [!code ++]
	.onError(({ error, code, status }) => {
		if(code === 'NICHE') {
			// Typed as NicheError
			console.log(error)

			return status(418, "We have no idea how you got here")
		}
	})
	.get('/', () => {
		throw new CustomError('Custom error message')
	})
	.listen(3000)
```

Elysia는 <DocLink href="/essential/life-cycle#error-code">error code</DocLink>를 사용하여 에러 타입을 좁힙니다.

Elysia가 타입을 좁힐 수 있도록 커스텀 에러를 등록하는 것이 권장됩니다.

### Error Status Code
클래스에 **status** 속성을 추가하여 커스텀 상태 코드를 제공할 수도 있습니다:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418 // [!code ++]

	constructor(message: string) {
		super(message)
	}
}
```

에러가 발생하면 Elysia는 이 상태 코드를 사용합니다. <DocLink href="/error-handling.html#custom-status-code">Custom Status Code</DocLink>를 참조하세요.

### Error Response
`toResponse` 메서드를 제공하여 에러에 직접 커스텀 에러 응답을 정의할 수도 있습니다:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}

	toResponse() { // [!code ++]
		return { message: this.message } // [!code ++]
	} // [!code ++]
}
```

에러가 발생하면 Elysia는 이 응답을 사용합니다. <DocLink href="/error-handling.html#custom-error-response">Custom Error Response</DocLink>를 참조하세요.

## Assignment

Elysia의 context를 확장해 봅시다.

<template #answer>
1. "NOT_FOUND"로 에러를 좁혀서 404 응답을 재정의할 수 있습니다.
2. status 속성이 418인 에러를 `.error()` 메서드에 제공합니다.

```typescript
import { Elysia } from 'elysia'

class YourError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		"YOUR_ERROR": YourError
	})
	.onError(({ code, status }) => {
		if(code === "NOT_FOUND")
			return "Hi there"
	})
	.get('/', () => {
		throw new YourError("A")
	})
	.listen(3000)
```
</template>

</Editor>
