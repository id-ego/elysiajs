---
title: Handler and Context - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Handler and Context - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Handler is a resource or a route function to send data back to client. Context contains information about each request.

    - - meta
      - property: 'og:description'
        content: Handler is a resource or a route function to send data back to client. Context contains information about each request.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Cog } from 'lucide-vue-next'
import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Handler and Context

**Handler** - 클라이언트에 데이터를 다시 전송하는 리소스 또는 route 함수입니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `() => 'hello world'` is a handler
    .get('/', () => 'hello world')
    .listen(3000)
```

handler는 리터럴 값일 수도 있습니다. <DocLink href="/essential/handler">Handler</DocLink>를 참조하세요.

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `() => 'hello world'` is a handler
    .get('/', 'hello world')
    .listen(3000)
```

인라인 값을 사용하는 것은 **파일**과 같은 정적 리소스에 유용할 수 있습니다.

## Context

각 요청에 대한 정보를 포함합니다. handler의 유일한 인수로 전달됩니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ This is a context
```

**Context**는 다음과 같은 요청에 대한 정보를 저장합니다:
- <DocLink href="/essential/validation#body">body</DocLink> - 폼 데이터, JSON 페이로드와 같이 클라이언트가 서버로 보낸 데이터
- <DocLink href="/essential/validation#query">query</DocLink> - query string을 객체로 표현 <small>(Query는 '?' 물음표 기호부터 시작하는 pathname 뒤의 값에서 추출됩니다)</small>
- <DocLink href="/essential/validation#params">params</DocLink> - Path parameters를 객체로 파싱
- <DocLink href="/essential/validation#headers">headers</DocLink> - HTTP Header, "Content-Type"과 같은 요청에 대한 추가 정보

자세한 내용은 <DocLink href="/essential/handler#context">Context</DocLink>를 참조하세요.

## Preview

**에디터** 섹션 아래에서 결과를 미리 볼 수 있습니다.

미리보기 창의 **왼쪽 상단**에 작은 네비게이터가 있어야 합니다.

이를 사용하여 경로와 메서드를 전환하여 응답을 확인할 수 있습니다.

또한 <Cog class="inline -translate-y-0.5" :size="18" stroke-width="2" />를 클릭하여 body와 headers를 편집할 수 있습니다.

## 과제

context 매개변수를 추출해 봅시다:

<template #answer>

1. 콜백 함수의 첫 번째 값에서 `body`, `query`, `headers`를 추출할 수 있습니다.
2. 그런 다음 `{ body, query, headers }`처럼 반환할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.post('/', ({ body, query, headers }) => {
		return {
			query,
			body,
			headers
		}
	})
	.listen(3000)
```

</template>

</Editor>
