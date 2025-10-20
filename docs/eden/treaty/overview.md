---
title: Overview - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Overview - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Eden Treaty

Eden Treaty는 서버와 상호 작용하기 위한 객체 표현으로 타입 안전성, 자동 완성 및 에러 처리 기능을 제공합니다.

Eden Treaty를 사용하려면 먼저 기존 Elysia 서버 타입을 내보냅니다:

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

그런 다음 서버 타입을 가져와서 클라이언트에서 Elysia API를 사용합니다:

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = treaty<App>('localhost:3000')

// 응답 타입: 'Hi Elysia'
const { data, error } = await app.hi.get()
      // ^?
```

## 트리 구조 문법

HTTP 경로는 파일 시스템 트리의 리소스 표시자입니다.

파일 시스템은 여러 수준의 폴더로 구성됩니다. 예를 들어:

-   /documents/elysia
-   /documents/kalpas
-   /documents/kelvin

각 수준은 **/** (슬래시)와 이름으로 구분됩니다.

그러나 JavaScript에서는 **"/"** (슬래시) 대신 **"."** (점)을 사용하여 더 깊은 리소스에 액세스합니다.

Eden Treaty는 Elysia 서버를 JavaScript 프론트엔드에서 액세스할 수 있는 트리 구조의 파일 시스템으로 변환합니다.

| 경로         | Treaty       |
| ------------ | ------------ |
| /            |              |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

HTTP 메서드와 결합하여 Elysia 서버와 상호 작용할 수 있습니다.

| 경로         | 메서드 | Treaty              |
| ------------ | ------ | ------------------- |
| /            | GET    | .get()              |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## 동적 경로

그러나 동적 경로 매개변수는 표기법을 사용하여 표현할 수 없습니다. 완전히 대체되면 매개변수 이름이 무엇인지 알 수 없습니다.

```typescript
// ❌ 값이 무엇을 나타내는지 불명확합니다
treaty.item['skadi'].get()
```

이를 처리하기 위해 함수를 사용하여 동적 경로를 지정하고 키 값을 제공할 수 있습니다.

```typescript
// ✅ 값이 동적 경로 'name'임이 명확합니다
treaty.item({ name: 'Skadi' }).get()
```

| 경로            | Treaty                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
