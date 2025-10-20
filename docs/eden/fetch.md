---
title: Eden Fetch - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Fetch - ElysiaJS

  - - meta
    - name: 'description'
      content: Eden Treaty의 fetch 스타일 대안으로 더 빠른 타입 추론을 제공합니다. Eden Fetch를 사용하면 코드 생성 없이 종단 간 타입 안전성을 갖춘 Elysia 서버에 요청을 보낼 수 있습니다.

  - - meta
    - name: 'og:description'
      content: Eden Treaty의 fetch 스타일 대안으로 더 빠른 타입 추론을 제공합니다. Eden Fetch를 사용하면 코드 생성 없이 종단 간 타입 안전성을 갖춘 Elysia 서버에 요청을 보낼 수 있습니다.
---

# Eden Fetch
Eden Treaty의 fetch 스타일 대안입니다.

Eden Fetch를 사용하면 Fetch API를 사용하여 타입 안전한 방식으로 Elysia 서버와 상호 작용할 수 있습니다.

---

먼저 기존 Elysia 서버 타입을 내보냅니다:
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

export type App = typeof app
```

그런 다음 서버 타입을 가져와서 클라이언트에서 Elysia API를 사용합니다:
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// 응답 타입: 'Hi Elysia'
const pong = await fetch('/hi', {})

// 응답 타입: 1895
const id = await fetch('/id/:id', {
    params: {
        id: '1895'
    }
})

// 응답 타입: { id: 1895, name: 'Skadi' }
const nendoroid = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})
```

## 에러 처리
Eden Treaty와 동일한 방식으로 에러를 처리할 수 있습니다:
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// 응답 타입: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            throw error.value
            break

        case 500:
        case 502:
            throw error.value
            break

        default:
            throw error.value
            break
    }
}

const { id, name } = nendoroid
```

## Eden Treaty 대신 Eden Fetch를 언제 사용해야 하나요
Elysia < 1.0과 달리, Eden Fetch는 더 이상 Eden Treaty보다 빠르지 않습니다.

선호도는 여러분과 팀의 합의에 따라 결정되지만, [Eden Treaty](/eden/treaty/overview)를 사용하는 것을 권장합니다.

Elysia < 1.0의 경우:

Eden Treaty를 사용하려면 모든 가능한 타입을 한 번에 매핑하기 위해 많은 하위 수준 반복이 필요한 반면, Eden Fetch는 라우트를 선택할 때까지 느리게 실행될 수 있습니다.

복잡한 타입과 많은 서버 라우트가 있는 경우, 낮은 사양의 개발 장치에서 Eden Treaty를 사용하면 타입 추론과 자동 완성이 느려질 수 있습니다.

그러나 Elysia가 많은 타입과 추론을 최적화했기 때문에, Eden Treaty는 상당한 수의 라우트에서 매우 잘 작동할 수 있습니다.

단일 프로세스에 **500개 이상의 라우트**가 포함되어 있고 **단일 프론트엔드 코드베이스**에서 모든 라우트를 사용해야 하는 경우, Eden Treaty보다 TypeScript 성능이 훨씬 더 우수한 Eden Fetch를 사용하는 것이 좋습니다.
