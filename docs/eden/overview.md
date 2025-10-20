---
title: 종단 간 타입 안전성 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 종단 간 타입 안전성 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia는 처음부터 Elysia Eden으로 종단 간 타입 안전성을 지원합니다. 종단 간 타입 안전성은 시스템의 모든 구성 요소가 타입 일관성을 확인하여, 데이터의 타입이 호환되는 경우에만 구성 요소 간에 데이터가 전달되는 시스템을 의미합니다.

  - - meta
    - property: 'og:description'
      content: Elysia는 처음부터 Elysia Eden으로 종단 간 타입 안전성을 지원합니다. 종단 간 타입 안전성은 시스템의 모든 구성 요소가 타입 일관성을 확인하여, 데이터의 타입이 호환되는 경우에만 구성 요소 간에 데이터가 전달되는 시스템을 의미합니다.
---

# 종단 간 타입 안전성
장난감 기차 세트가 있다고 상상해 보세요.

기차 선로의 각 조각은 퍼즐 조각처럼 다음 조각과 완벽하게 맞아야 합니다.

종단 간 타입 안전성은 기차가 떨어지거나 막히지 않도록 모든 선로 조각이 올바르게 맞는지 확인하는 것과 같습니다.

프레임워크가 종단 간 타입 안전성을 가진다는 것은 타입 안전한 방식으로 클라이언트와 서버를 연결할 수 있다는 것을 의미합니다.

Elysia는 RPC 스타일의 커넥터인 **Eden**을 통해 **코드 생성 없이** 기본적으로 종단 간 타입 안전성을 제공합니다

<video mute controls style="aspect-ratio: 16/9;">
  <source src="/eden/eden-treaty.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

종단 간 타입 안전성을 지원하는 다른 프레임워크:
- tRPC
- Remix
- SvelteKit
- Nuxt
- TS-Rest

<!-- <iframe
    id="embedded-editor"
    src="https://codesandbox.io/p/sandbox/bun-elysia-rdxljp?embed=1&codemirror=1&hidenavigation=1&hidedevtools=1&file=eden.ts"
    allow="accelerometer"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    loading="lazy"
/>

::: tip
변수와 함수 위에 마우스를 올려 타입 정의를 확인하세요.
::: -->

Elysia를 사용하면 서버에서 타입을 변경할 수 있고 클라이언트에 즉시 반영되어 자동 완성과 타입 강제를 지원합니다.

## Eden
Eden은 코드 생성 대신 TypeScript의 타입 추론만을 사용하여 **종단 간 타입 안전성**으로 Elysia를 연결하는 RPC 스타일의 클라이언트입니다.

클라이언트와 서버 타입을 손쉽게 동기화할 수 있으며, 2KB 미만의 가벼운 크기를 자랑합니다.

Eden은 2개의 모듈로 구성됩니다:
1. Eden Treaty **(권장)**: Eden Treaty의 개선된 RPC 버전
2. Eden Fetch: 타입 안전성을 갖춘 Fetch 스타일 클라이언트

다음은 각 모듈의 개요, 사용 사례 및 비교입니다.

## Eden Treaty (권장)
Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다.

Eden Treaty를 사용하면 전체 타입 지원 및 자동 완성, 타입 축소를 통한 에러 처리, 타입 안전한 단위 테스트 생성이 가능한 Elysia 서버와 상호 작용할 수 있습니다.

Eden Treaty 사용 예제:
```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hi')
    .get('/users', () => 'Skadi')
    .put('/nendoroid/:id', ({ body }) => body, {
        body: t.Object({
            name: t.String(),
            from: t.String()
        })
    })
    .get('/nendoroid/:id/name', () => 'Skadi')
    .listen(3000)

export type App = typeof app

// @filename: index.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// @noErrors
app.
//  ^|




// [GET] '/'에서 호출
const { data } = await app.get()

// [PUT] '/nendoroid/:id'에서 호출
const { data: nendoroid, error } = await app.nendoroid({ id: 1895 }).put({
    name: 'Skadi',
    from: 'Arknights'
})
```

## Eden Fetch
fetch 문법을 선호하는 개발자를 위한 Eden Treaty의 fetch 스타일 대안입니다.
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

const { data } = await fetch('/name/:name', {
    method: 'POST',
    params: {
        name: 'Saori'
    },
    body: {
        branch: 'Arius',
        type: 'Striker'
    }
})
```

::: tip 참고
Eden Treaty와 달리 Eden Fetch는 Elysia 서버에 대한 Web Socket 구현을 제공하지 않습니다.
:::
