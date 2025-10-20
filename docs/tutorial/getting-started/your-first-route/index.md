---
title: Your First Route - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Your First Route - Elysia Tutorial

    - - meta
      - name: 'description'
        content: There are 3 types of paths in Elysia. static paths, dynamic paths, and wildcards. Learn how to use them to create your first route.

    - - meta
      - property: 'og:description'
        content: There are 3 types of paths in Elysia. static paths, dynamic paths, and wildcards. Learn how to use them to create your first route.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)
</script>

<Editor :code="code" :testcases="testcases">

# 첫 번째 라우트

웹사이트에 접속할 때는 다음이 필요합니다:
1. **path**: `/`, `/about`, 또는 `/contact`와 같은
2. **method**: `GET`, `POST`, 또는 `DELETE`와 같은

표시할 리소스를 결정하는 것을 간단히 **"route"**라고 합니다.

Elysia에서는 다음과 같이 라우트를 정의할 수 있습니다:
1. HTTP 메서드의 이름을 따서 명명된 메서드를 호출합니다
2. 첫 번째 인자는 경로입니다
3. 두 번째 인자는 핸들러입니다

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)
```

## 라우팅
Elysia의 경로는 3가지 유형으로 그룹화할 수 있습니다:

1. static paths - 리소스를 찾기 위한 정적 문자열
2. dynamic paths - 세그먼트는 어떤 값이든 될 수 있습니다
3. wildcards - 특정 지점까지의 경로는 무엇이든 될 수 있습니다

<DocLink href="/essential/route">Route</DocLink>를 참조하세요.

## Static Path

Static path는 서버의 리소스를 찾기 위한 하드코딩된 문자열입니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', 'hello')
	.get('/hi', 'hi')
	.listen(3000)
```

<DocLink href="/essential/route#static-path">Static Path</DocLink>를 참조하세요.

## Dynamic path

Dynamic path는 일부를 매칭하고 추가 정보를 추출하기 위해 값을 캡처합니다.

동적 경로를 정의하려면 콜론 `:`과 이름을 사용할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .listen(3000)
```

여기서 `/id/:id`로 동적 경로가 생성됩니다. 이는 Elysia에게 **/id/1**, **/id/123**, **/id/anything**과 같은 값으로 `:id` 세그먼트의 값을 캡처하도록 지시합니다.

<Playground
  :elysia="demo6"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }"
/>

<DocLink href="/essential/route#dynamic-path">Dynamic Path</DocLink>를 참조하세요.

### Optional path parameters
매개변수 이름 뒤에 물음표 `?`를 추가하여 경로 매개변수를 선택 사항으로 만들 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
    .listen(3000)
```

<Playground
  :elysia="demo3"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: 'id 1'
    },
  }"
/>

<DocLink href="/essential/route#optional-path-parameters">Optional Path Parameters</DocLink>를 참조하세요.

## Wildcards

Dynamic path는 단일 세그먼트를 캡처하는 반면 wildcard는 경로의 나머지 부분을 캡처할 수 있습니다.

wildcard를 정의하려면 별표 `*`를 사용할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
    .listen(3000)
```

<Playground
  :elysia="demo9"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything/rest'
    }
  }"
/>

<DocLink href="/essential/route#wildcards">Wildcards</DocLink>를 참조하세요.

## 과제

복습해 봅시다. 다양한 유형의 경로를 3개 만들어 보세요:

<template #answer>

1. `"Hello Elysia!"`로 응답하는 static path `/elysia`
2. `"Hello {name}!"`로 응답하는 dynamic path `/friends/:name?`
3. 경로의 나머지 부분으로 응답하는 wildcard path `/flame-chasers/*`

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/elysia', 'Hello Elysia!')
	.get('/friends/:name?', ({ params: { name } }) => `Hello ${name}!`)
	.get('/flame-chasers/*', ({ params }) => params['*'])
	.listen(3000)
```

</template>

</Editor>
