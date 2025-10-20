---
title: Status and Headers - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Status and Headers - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to manage status codes and headers in Elysia to control HTTP responses effectively.

    - - meta
      - property: 'og:description'
        content: Learn how to manage status codes and headers in Elysia to control HTTP responses effectively.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Status

상태 코드는 서버가 요청을 처리하는 방법을 나타내는 지표입니다.

존재하지 않는 페이지를 방문할 때 유명한 **404 Not Found**에 대해 들어봤을 것입니다.

그것이 **상태 코드**입니다.

기본적으로 Elysia는 성공적인 요청에 대해 **200 OK**를 반환합니다.

Elysia는 다음과 같은 상황에 따라 다양한 상태 코드도 반환합니다:
- 400 Bad Request
- 422 Unprocessable Entity
- 500 Internal Server Error

`status` 함수로 응답을 반환하여 상태 코드를 반환할 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status }) => status(418, "I'm a teapot'"))
	.listen(3000)
```

자세한 내용은 <DocLink href="/essential/handler#status">Status</DocLink>를 참조하세요.

## Redirect
마찬가지로 `redirect` 함수를 반환하여 요청을 다른 URL로 리디렉션할 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

자세한 내용은 <DocLink href="/essential/handler#redirect">Redirect</DocLink>를 참조하세요.

## Headers
직접 반환할 수 있는 상태 코드 및 리디렉션과 달리.

애플리케이션에서 헤더를 여러 번 설정해야 할 가능성이 높습니다.

그렇기 때문에 Elysia는 `headers` 함수를 반환하는 대신 헤더를 설정하기 위한 `set.headers` 객체를 제공합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return 'Hello World'
	})
	.listen(3000)
```

`headers`는 **요청 헤더**이므로 Elysia는 응답 헤더에 대해 **set.headers**를 접두사로 사용하여 요청 헤더와 응답 헤더를 구분합니다.

자세한 내용은 <DocLink href="/essential/handler#set-headers">Headers</DocLink>를 참조하세요.

## 과제

배운 내용을 실습해 봅시다.

<template #answer>

1. 상태 코드를 `418 I'm a teapot`으로 설정하려면 `status` 함수를 사용할 수 있습니다.
2. `/docs`를 `https://elysiajs.com`으로 리디렉션하려면 `redirect` 함수를 사용할 수 있습니다.
3. 사용자 정의 헤더 `x-powered-by`를 `Elysia`로 설정하려면 `set.headers` 객체를 사용할 수 있습니다.

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
