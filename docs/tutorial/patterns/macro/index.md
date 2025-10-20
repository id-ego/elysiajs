---
title: Macro - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Macro - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Macro is a reusable route options. Learn how to create and use macros in Elysia to enhance your application.

    - - meta
      - property: 'og:description'
        content: Macro is a reusable route options. Learn how to create and use macros in Elysia to enhance your application.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Macro

재사용 가능한 라우트 옵션입니다.

다음과 같은 인증 검사가 있다고 상상해 봅시다:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/user', ({ body }) => body, {
		cookie: t.Object({
			session: t.String()
		}),
		beforeHandle({ cookie: { session } }) {
			if(!session.value) throw 'Unauthorized'
		}
	})
	.listen(3000)
```

인증이 필요한 여러 라우트가 있는 경우 동일한 옵션을 반복해서 작성해야 합니다.

대신 매크로를 사용하여 라우트 옵션을 재사용할 수 있습니다:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('auth', {
		cookie: t.Object({
			session: t.String()
		}),
		// psuedo auth check
		beforeHandle({ cookie: { session }, status }) {
			if(!session.value) return status(401)
		}
	})
	.post('/user', ({ body }) => body, {
		auth: true // [!code ++]
	})
	.listen(3000)
```

**auth**는 **cookie**와 **beforeHandle**을 모두 라우트에 인라인합니다.

간단히 말해서, <DocLink href="/patterns/macro">Macro</DocLink>는 **재사용 가능한 라우트 옵션**입니다. 함수와 유사하지만 **타입 안전성**을 가진 라우트 옵션입니다.

## Assignment

body가 피보나치 수인지 확인하는 매크로를 정의해 봅시다:

```typescript
function isFibonacci(n: number) {
	let a = 0, b = 1
	while(b < n) [a, b] = [b, a + b]
	return b === n || n === 0
}
```

<template #answer>

1. 타입을 강제하려면 매크로에 `body` 속성을 정의할 수 있습니다.
2. 요청을 단락시키려면 `status` 함수를 사용하여 조기에 반환할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

function isPerfectSquare(x: number) {
    const s = Math.floor(Math.sqrt(x))
    return s * s === x
}

function isFibonacci(n: number) {
    if (n < 0) return false

    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

new Elysia()
    .macro('isFibonacci', {
		body: t.Number(),
        beforeHandle({ body, status }) {
            if(!isFibonacci(body)) return status(418)
        }
    })
	.post('/fibo', ({ body }) => body, {
		isFibonacci: true
	})
    .listen(3000)
```

</template>

</Editor>
