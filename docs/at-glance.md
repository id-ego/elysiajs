---
title: 한눈에 보기 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 한눈에 보기 - ElysiaJS

    - - meta
      - name: 'description'
        content: 인체공학적 디자인, TypeScript에 대한 광범위한 지원, 최신 JavaScript API, Bun에 최적화되도록 설계되었습니다. 통합 타입과 엔드투엔드 타입 안정성을 제공하면서도 뛰어난 성능을 유지하는 독특한 경험을 제공합니다.

    - - meta
      - property: 'og:description'
        content: 인체공학적 디자인, TypeScript에 대한 광범위한 지원, 최신 JavaScript API, Bun에 최적화되도록 설계되었습니다. 통합 타입과 엔드투엔드 타입 안정성을 제공하면서도 뛰어난 성능을 유지하는 독특한 경험을 제공합니다.
---

<script setup>
import Card from './components/nearl/card.vue'
import Deck from './components/nearl/card-deck.vue'
import Playground from './components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>


# 한눈에 보기

Elysia는 Bun으로 백엔드 서버를 구축하기 위한 인체공학적 웹 프레임워크입니다.

단순성과 타입 안정성을 염두에 두고 설계된 Elysia는 TypeScript에 대한 광범위한 지원과 함께 친숙한 API를 제공하며 Bun에 최적화되어 있습니다.

다음은 Elysia의 간단한 Hello World 예제입니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

[localhost:3000](http://localhost:3000/)으로 이동하면 'Hello Elysia'가 결과로 표시됩니다.

<Playground
    :elysia="demo1"
    :alias="{
        '/user/:id': '/user/1'
    }"
    :mock="{
        '/user/:id': {
            GET: '1'
        },
        '/form': {
            POST: JSON.stringify({
                hello: 'Elysia'
            })
        }
    }"
/>

::: tip
코드 스니펫 위에 마우스를 올려 타입 정의를 확인하세요.

모의 브라우저에서 파란색으로 강조된 경로를 클릭하여 경로를 변경하고 응답을 미리 볼 수 있습니다.

Elysia는 브라우저에서 실행될 수 있으며, 여러분이 보는 결과는 실제로 Elysia를 사용하여 실행됩니다.
:::

## 성능

Bun을 기반으로 하고 정적 코드 분석과 같은 광범위한 최적화를 통해 Elysia는 즉석에서 최적화된 코드를 생성할 수 있습니다.

Elysia는 오늘날 사용 가능한 대부분의 웹 프레임워크를 능가<a href="#ref-1"><sup>[1]</sup></a>할 수 있으며 심지어 Golang과 Rust 프레임워크의 성능과도 맞먹습니다<a href="#ref-2"><sup>[2]</sup></a>.

| Framework     | Runtime | Average     | Plain Text | Dynamic Parameters | JSON Body  |
| ------------- | ------- | ----------- | ---------- | ------------------ | ---------- |
| bun           | bun     | 262,660.433 | 326,375.76 | 237,083.18         | 224,522.36 |
| elysia        | bun     | 255,574.717 | 313,073.64 | 241,891.57         | 211,758.94 |
| hyper-express | node    | 234,395.837 | 311,775.43 | 249,675            | 141,737.08 |
| hono          | bun     | 203,937.883 | 239,229.82 | 201,663.43         | 170,920.4  |
| h3            | node    | 96,515.027  | 114,971.87 | 87,935.94          | 86,637.27  |
| oak           | deno    | 46,569.853  | 55,174.24  | 48,260.36          | 36,274.96  |
| fastify       | bun     | 65,897.043  | 92,856.71  | 81,604.66          | 23,229.76  |
| fastify       | node    | 60,322.413  | 71,150.57  | 62,060.26          | 47,756.41  |
| koa           | node    | 39,594.14   | 46,219.64  | 40,961.72          | 31,601.06  |
| express       | bun     | 29,715.537  | 39,455.46  | 34,700.85          | 14,990.3   |
| express       | node    | 15,913.153  | 17,736.92  | 17,128.7           | 12,873.84  |

## TypeScript

Elysia는 TypeScript를 덜 작성하도록 돕기 위해 설계되었습니다.

Elysia의 타입 시스템은 코드에서 타입을 자동으로 추론하도록 미세 조정되어 있어, 명시적인 TypeScript를 작성할 필요 없이 런타임과 컴파일 타임 모두에서 타입 안정성을 제공하여 가장 인체공학적인 개발자 경험을 제공합니다.

다음 예제를 살펴보세요:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id)
                        // ^?
    .listen(3000)
```

<br>

위 코드는 경로 매개변수 **"id"**를 생성합니다. `:id`를 대체하는 값은 수동 타입 선언 없이 런타임과 타입 모두에서 `params.id`로 전달됩니다.

<Playground
    :elysia="demo2"
    :alias="{
        '/user/:id': '/user/123'
    }"
    :mock="{
        '/user/:id': {
            GET: '123'
        },
    }"
/>

Elysia의 목표는 TypeScript를 덜 작성하고 비즈니스 로직에 더 집중하도록 돕는 것입니다. 복잡한 타입은 프레임워크가 처리하게 하세요.

Elysia를 사용하는 데 TypeScript가 필수는 아니지만, 권장됩니다.

## 타입 무결성

한 단계 더 나아가, Elysia는 **Elysia.t**를 제공합니다. 이는 런타임과 컴파일 타임 모두에서 타입과 값을 검증하는 스키마 빌더로, 데이터 타입에 대한 단일 진실 공급원을 생성합니다.

이전 코드를 수정하여 문자열 대신 숫자 값만 허용하도록 해봅시다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
                                // ^?
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

이 코드는 경로 매개변수 **id**가 런타임과 컴파일 타임(타입 레벨) 모두에서 항상 숫자임을 보장합니다.

::: tip
위 코드 스니펫에서 "id" 위에 마우스를 올려 타입 정의를 확인하세요.
:::

Elysia의 스키마 빌더를 사용하면 단일 진실 공급원으로 강력한 타입 언어처럼 타입 안정성을 보장할 수 있습니다.

## Standard Schema

Elysia는 [Standard Schema](https://github.com/standard-schema/standard-schema)를 지원하여 여러분이 선호하는 검증 라이브러리를 사용할 수 있습니다:

- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi
- [그 외 더 많은 라이브러리](https://github.com/standard-schema/standard-schema)

```typescript twoslash
import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

new Elysia()
	.get('/id/:id', ({ params: { id }, query: { name } }) => id, {
	//                           ^?
		params: z.object({
			id: z.coerce.number()
		}),
		query: v.object({
			name: v.literal('Lilith')
		})
	})
	.listen(3000)
```

Elysia는 스키마에서 타입을 자동으로 추론하므로, 여러분이 선호하는 검증 라이브러리를 사용하면서도 타입 안정성을 유지할 수 있습니다.

## OpenAPI

Elysia는 OpenAPI, WinterTC 준수, Standard Schema와 같은 많은 표준을 기본적으로 채택하고 있습니다. 이를 통해 대부분의 업계 표준 도구와 통합하거나 적어도 익숙한 도구와 쉽게 통합할 수 있습니다.

예를 들어, Elysia는 기본적으로 OpenAPI를 채택하고 있기 때문에 API 문서를 생성하는 것은 한 줄을 추가하는 것만큼 간단합니다:

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi()) // [!code ++]
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

OpenAPI 플러그인을 사용하면 추가 코드나 특정 구성 없이도 API 문서 페이지를 원활하게 생성하고 팀과 손쉽게 공유할 수 있습니다.

## 타입에서 OpenAPI 생성

Elysia는 OpenAPI를 우수하게 지원하며, 스키마는 단일 진실 공급원에서 데이터 검증, 타입 추론, OpenAPI 주석에 사용될 수 있습니다.

Elysia는 또한 **타입에서 직접 1줄로** OpenAPI 스키마를 생성하는 것을 지원하여, 수동 주석 없이도 완전하고 정확한 API 문서를 가질 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(openapi({
    	references: fromTypes() // [!code ++]
    }))
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

## 엔드투엔드 타입 안정성

Elysia에서 타입 안정성은 서버 측에만 국한되지 않습니다.

Elysia를 사용하면 tRPC와 유사하게 Elysia의 클라이언트 라이브러리인 "Eden"을 사용하여 프론트엔드 팀과 자동으로 타입을 동기화할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(openapi({
    	references: fromTypes()
    }))
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)

export type App = typeof app
```

그리고 클라이언트 측에서는:

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// Get data from /user/617
const { data } = await app.user({ id: 617 }).get()
      // ^?

console.log(data)
```

Eden을 사용하면 기존 Elysia 타입을 사용하여 **코드 생성 없이** Elysia 서버를 쿼리하고 프론트엔드와 백엔드 모두의 타입을 자동으로 동기화할 수 있습니다.

Elysia는 단지 자신감 있는 백엔드를 만드는 데 그치지 않고, 이 세상의 모든 아름다운 것들을 위한 것입니다.

## 플랫폼 불가지론

Elysia는 Bun을 위해 설계되었지만 **Bun에만 국한되지 않습니다**. [WinterTC 준수](https://wintertc.org/)로 인해 Cloudflare Workers, Vercel Edge Functions 및 Web Standard Request를 지원하는 대부분의 다른 런타임에 Elysia 서버를 배포할 수 있습니다.

## 우리 커뮤니티

Elysia에 대한 질문이 있거나 막히면, GitHub Discussions, Discord 또는 Twitter에서 커뮤니티에 자유롭게 질문하세요.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        공식 ElysiaJS Discord 커뮤니티 서버
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Elysia의 업데이트와 상태 추적
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        소스 코드 및 개발
    </Card>
</Deck>

---

<small id="ref-1">1. 초당 요청 수로 측정됨. 2023년 8월 6일 Bun 0.7.2에서 Debian 11, Intel i7-13700K에서 쿼리 파싱, 경로 매개변수 및 응답 헤더 설정에 대한 벤치마크. [여기](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results)에서 벤치마크 조건 참조.</small>

<small id="ref-2">2. [TechEmpower Benchmark round 22](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite)를 기반으로 함.</small>
