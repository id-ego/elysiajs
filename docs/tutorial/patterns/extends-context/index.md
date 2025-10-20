---
title: Extends Context - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Extends Context - ElysiaJS

    - - meta
      - name: 'description'
        content: Learn how to extend the context in Elysia using Decorate, State, Resolve, and Derive to enhance your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to extend the context in Elysia using Decorate, State, Resolve, and Derive to enhance your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Extends Context

Elysia는 시작하는 데 도움이 되는 작은 유틸리티들이 포함된 context를 제공합니다.

다음을 사용하여 Elysia의 context를 확장할 수 있습니다:
1. <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>
2. <DocLink href="/essential/handler.html#state">State</DocLink>
3. <DocLink href="/essential/handler.html#resolve">Resolve</DocLink>
4. <DocLink href="/essential/handler.html#derive">Derive</DocLink>

## Decorate
**싱글톤**이며 **불변**인 값으로 모든 요청에서 공유됩니다.

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

데코레이트된 값은 context에서 읽기 전용 속성으로 사용할 수 있습니다. <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>를 참조하세요.

## State
모든 요청에서 공유되는 **가변** 참조입니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.state('count', 0)
	.get('/', ({ count }) => {
		count++

		return count
	})
```

State는 모든 요청에서 공유되는 **context.store**에서 사용할 수 있습니다. <DocLink href="/essential/handler.html#state">State</DocLink>를 참조하세요.

## Resolve / Derive

<DocLink href="/essential/handler.html#decorate">Decorate</DocLink> 값은 싱글톤으로 등록됩니다.

반면 <DocLink href="/essential/handler.html#resolve">Resolve</DocLink>와 <DocLink href="/essential/handler.html#derive">Derive</DocLink>는 **요청별로** context 값을 추상화할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)
```

**반환된 값은 context에서 사용할 수 있습니다**. 단, status는 예외로 클라이언트에 직접 전송되고 후속 핸들러를 중단합니다.

<DocLink href="/essential/handler.html#resolve">resolve</DocLink>와 <DocLink href="/essential/handler.html#derive">derive</DocLink>의 구문은 유사하지만 서로 다른 사용 사례가 있습니다.

내부적으로 둘 다 라이프사이클의 syntactic sugar <small>(타입 안전성 포함)</small>입니다:
- <DocLink href="/essential/handler.html#derive">derive</DocLink>는 <DocLink href="/essential/life-cycle.html#transform">transform</DocLink>을 기반으로 합니다
- <DocLink href="/essential/handler.html#resolve">resolve</DocLink>는 <DocLink href="/essential/life-cycle.html#before-handle">before handle</DocLink>을 기반으로 합니다

<DocLink href="/essential/handler.html#resolve">derive</DocLink>는 <DocLink href="/essential/life-cycle.html#transform">transform</DocLink>을 기반으로 하므로 데이터가 아직 검증되지 않고 강제 변환/변환되지 않았습니다. 검증된 데이터가 필요한 경우 <DocLink href="/essential/handler.html#resolve">resolve</DocLink>를 사용하는 것이 좋습니다.

## Scope
<DocLink href="/essential/handler.html#state">State</DocLink>와 <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>는 모든 요청과 인스턴스에서 공유됩니다.

<br />

<DocLink href="/essential/handler.html#resolve">Resolve</DocLink>와 <DocLink href="/essential/handler.html#derive">Derive</DocLink>는 요청별로 캡슐화 범위를 가집니다 <small>(라이프사이클 이벤트를 기반으로 하기 때문입니다)</small>.

플러그인에서 resolved/derived 값을 사용하려면 <DocLink href="/essential/plugin.html#scope">Scope</DocLink>를 선언해야 합니다.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.derive(
		{ as: 'scoped' }, // [!code ++]
		({ headers: { authorization } }) => ({
			authorization
		})
	)

new Elysia()
	.use(plugin)
	.get('/', ({ authorization }) => authorization)
	.listen(3000)
```

## Assignment

Elysia의 context를 확장해 봅시다.

<template #answer>

<DocLink href="/essential/handler.html#resolve">resolve</DocLink>를 사용하여 query에서 age를 추출할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

class Logger {
	log(info: string) {
		console.log(info)
	}
}

new Elysia()
	.decorate('logger', new Logger())
	.onRequest(({ request, logger }) => {
		logger.log(`Request to ${request.url}`)
	})
	.guard({
		query: t.Optional(
			t.Object({
				age: t.Number({ min: 15 })
			})
		)
	})
	.resolve(({ query: { age }, status }) => {
		if(!age) return status(401)

		return { age }
	})
	.get('/profile', ({ age }) => age)
	.listen(3000)
```

</template>

</Editor>
