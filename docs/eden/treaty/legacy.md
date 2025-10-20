---
title: Eden Treaty Legacy - ElysiaJS
search: false
head:
  - - meta
    - property: 'og:title'
      content: Eden Treaty Legacy - ElysiaJS

  - - meta
    - name: 'og:description'
      content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

  - - meta
    - name: 'og:description'
      content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Eden Treaty Legacy

::: tip 참고
이것은 Eden Treaty 1 또는 (edenTreaty)에 대한 문서입니다

새 프로젝트의 경우 Eden Treaty 2 (treaty)로 시작하는 것을 권장합니다.
:::

Eden Treaty는 Elysia 서버의 객체 스타일 표현입니다.

서버에서 직접 타입을 사용하여 일반 객체처럼 접근자를 제공하여 더 빠르게 이동하고 아무것도 깨지지 않도록 합니다

---

Eden Treaty를 사용하려면 먼저 기존 Elysia 서버 타입을 내보냅니다:
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
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
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = edenTreaty<App>('http://localhost:')

// 응답 타입: 'Hi Elysia'
const { data: pong, error } = app.get()

// 응답 타입: 1895
const { data: id, error } = app.id['1895'].get()

// 응답 타입: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})
```

::: tip
Eden Treaty는 자동 완성 지원과 함께 완전히 타입 안전합니다.
:::

## 구조
Eden Treaty는 모든 기존 경로를 객체 스타일 표현으로 변환하며, 다음과 같이 설명할 수 있습니다:
```typescript
EdenTreaty.<1>.<2>.<n>.<method>({
    ...body,
    $query?: {},
    $fetch?: RequestInit
})
```

### 경로
Eden은 `/`를 `.`로 변환하여 등록된 `method`로 호출할 수 있습니다. 예를 들어:
- **/path** -> .path
- **/nested/path** -> .nested.path

### 경로 매개변수
경로 매개변수는 URL의 이름으로 자동 매핑됩니다.

- **/id/:id** -> .id.`<anyThing>`
- 예: .id.hi
- 예: .id['123']

::: tip
경로가 경로 매개변수를 지원하지 않으면 TypeScript에서 에러를 표시합니다.
:::

### 쿼리
`$query`를 사용하여 경로에 쿼리를 추가할 수 있습니다:
```typescript
app.get({
    $query: {
        name: 'Eden',
        code: 'Gold'
    }
})
```

### Fetch
Eden Treaty는 fetch 래퍼이며, `$fetch`에 전달하여 Eden에 유효한 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 매개변수를 추가할 수 있습니다:
```typescript
app.post({
    $fetch: {
        headers: {
            'x-organization': 'MANTIS'
        }
    }
})
```

## 에러 처리
Eden Treaty는 결과로 `data`와 `error`의 값을 반환하며, 둘 다 완전히 타입이 지정됩니다.
```typescript
// 응답 타입: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            warnUser(error.value)
            break

        case 500:
        case 502:
            emergencyCallDev(error.value)
            break

        default:
            reportError(error.value)
            break
    }

    throw error
}

const { id, name } = nendoroid
```

**data**와 **error** 둘 다 타입 가드로 상태를 확인할 때까지 nullable로 타입이 지정됩니다.

간단히 말해서, fetch가 성공하면 data는 값을 가지고 error는 null이 되며, 그 반대도 마찬가지입니다.

::: tip
에러는 `Error`로 래핑되며, 서버에서 반환된 값은 `Error.value`에서 검색할 수 있습니다
:::

### 상태 코드 기반 에러 타입
Eden Treaty와 Eden Fetch 둘 다 Elysia 서버에서 에러 타입을 명시적으로 제공하면 상태 코드에 따라 에러 타입을 축소할 수 있습니다.

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        nendoroid: t.Object({
            id: t.Number(),
            name: t.String()
        }),
        error: t.Object({
            message: t.String()
        })
    })
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: 'nendoroid',
        response: {
            200: 'nendoroid', // [!code ++]
            400: 'error', // [!code ++]
            401: 'error' // [!code ++]
        }
    })
    .listen(3000)

export type App = typeof app
```

클라이언트 측에서:
```typescript
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            // 서버에 설명된 'error' 타입으로 축소
            warnUser(error.value)
            break

        default:
            // unknown으로 타입 지정
            reportError(error.value)
            break
    }

    throw error
}
```

## WebSocket
Eden은 일반 라우트와 동일한 API를 사용하여 WebSocket을 지원합니다.
```typescript
// Server
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/chat', {
        message(ws, message) {
            ws.send(message)
        },
        body: t.String(),
        response: t.String()
    })
    .listen(3000)

type App = typeof app
```

실시간 데이터 수신을 시작하려면 `.subscribe` 메서드를 호출합니다:
```typescript
// Client
import { edenTreaty } from '@elysiajs/eden'
const app = edenTreaty<App>('http://localhost:')

const chat = app.chat.subscribe()

chat.subscribe((message) => {
    console.log('got', message)
})

chat.send('hello from client')
```

[schema](/integrations/cheat-sheet#schema)를 사용하여 일반 라우트처럼 WebSocket에 타입 안전성을 강제할 수 있습니다.

---

**Eden.subscribe**는 타입 안전성을 갖춘 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) 클래스를 확장하는 **EdenWebSocket**을 반환합니다. 문법은 WebSocket과 동일합니다

더 많은 제어가 필요한 경우, **EdenWebSocket.raw**에 액세스하여 네이티브 WebSocket API와 상호 작용할 수 있습니다.

## 파일 업로드
다음 중 하나를 필드에 전달하여 파일을 첨부할 수 있습니다:
- **File**
- **FileList**
- **Blob**

파일을 첨부하면 **content-type**이 **multipart/form-data**가 됩니다

다음과 같은 서버가 있다고 가정합니다:
```typescript
// server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files(),
        })
    })
    .listen(3000)

export type App = typeof app
```

다음과 같이 클라이언트를 사용할 수 있습니다:
```typescript
// client.ts
import { edenTreaty } from '@elysia/eden'
import type { Server } from './server'

export const client = edenTreaty<Server>('http://localhost:3000')

const id = <T extends HTMLElement = HTMLElement>(id: string) =>
    document.getElementById(id)! as T

const { data } = await client.image.post({
    title: "Misono Mika",
    image: id<HTMLInputElement>('picture').files!,
})
```
