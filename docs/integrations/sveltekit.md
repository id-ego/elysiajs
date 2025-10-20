---
title: SvelteKit과의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: SvelteKit과의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: SvelteKit을 사용하면 서버 라우트에서 Elysia를 실행할 수 있습니다.

    - - meta
      - property: 'og:description'
        content: SvelteKit을 사용하면 서버 라우트에서 Elysia를 실행할 수 있습니다.
---

# SvelteKit과의 통합

SvelteKit을 사용하면 서버 라우트에서 Elysia를 실행할 수 있습니다.

1. **src/routes/[...slugs]/+server.ts**를 생성합니다.
2. Elysia 서버를 정의합니다.
3. `app.handle`을 호출하는 **fallback** 함수를 내보냅니다.

```typescript
// src/routes/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia()
    .get('/', 'hello SvelteKit')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

interface WithRequest {
	request: Request
}

export const fallback = ({ request }: WithRequest) => app.handle(request) // [!code ++]
```

Elysia 서버를 일반 SvelteKit 서버 라우트처럼 취급할 수 있습니다.

## Prefix
Elysia 서버를 앱 라우터의 루트 디렉토리가 아닌 다른 곳에 배치하는 경우, Elysia 서버에 prefix를 지정해야 합니다.

예를 들어, Elysia 서버를 **src/routes/api/[...slugs]/+server.ts**에 배치하는 경우, Elysia 서버에 prefix를 **/api**로 지정해야 합니다.

```typescript twoslash
// src/routes/api/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>

export const fallback: RequestHandler = ({ request }) => app.handle(request)
```

이렇게 하면 Elysia를 어디에 배치하든 라우팅이 제대로 작동합니다.

자세한 내용은 [SvelteKit Routing](https://kit.svelte.dev/docs/routing#server)을 참조하세요.
