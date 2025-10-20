---
title: Astro와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Astro와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Astro에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.

    - - meta
      - property: 'og:description'
        content: Astro에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.
---

# Astro와의 통합

[Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)를 사용하여 Astro에서 직접 Elysia를 실행할 수 있습니다.

1. **astro.config.mjs**에서 **output**을 **server**로 설정

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    output: 'server' // [!code ++]
})
```

2. **pages/[...slugs].ts** 생성
3. **[...slugs].ts**에서 Elysia 서버 생성 또는 가져오기
4. 사용하려는 메서드 이름으로 핸들러 내보내기

```typescript
// pages/[...slugs].ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/api', () => 'hi')
    .post('/api', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.

Elysia는 Bun에서 실행되도록 설계되었으므로 [Astro를 Bun에서 실행](https://docs.astro.build/en/recipes/bun)하는 것을 권장합니다.

::: tip
WinterCG 지원 덕분에 Astro를 Bun에서 실행하지 않아도 Elysia 서버를 실행할 수 있습니다.
:::

이 방식을 사용하면 프론트엔드와 백엔드를 단일 저장소에 배치하고 Eden을 통해 End-to-end 타입 안전성을 확보할 수 있습니다.

자세한 정보는 [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)를 참조하세요.

## Prefix

Elysia 서버를 앱 라우터의 루트 디렉터리가 아닌 다른 곳에 배치하는 경우, Elysia 서버에 접두사를 주석으로 달아야 합니다.

예를 들어, Elysia 서버를 **pages/api/[...slugs].ts**에 배치하는 경우, Elysia 서버에 접두사로 **/api**를 주석으로 달아야 합니다.

```typescript
// pages/api/[...slugs].ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

이렇게 하면 어디에 배치하든 Elysia 라우팅이 제대로 작동합니다.
