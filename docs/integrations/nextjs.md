---
title: Next.js와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Next.js와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Next.js App Router를 사용하면 Next.js 라우트에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.

    - - meta
      - property: 'og:description'
        content: Next.js App Router를 사용하면 Next.js 라우트에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.
---

# Next.js와의 통합

Next.js App Router를 사용하면 Next.js 라우트에서 Elysia를 실행할 수 있습니다.

1. **app/api/[[...slugs]]/route.ts** 생성
2. Elysia 서버 정의
3. 사용하려는 HTTP 메서드 이름으로 **Elysia.fetch** 내보내기

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::

WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.

Elysia 서버를 일반 Next.js API 라우트처럼 취급할 수 있습니다.

이 방식을 사용하면 프론트엔드와 백엔드를 단일 저장소에 배치하고 클라이언트 측과 서버 액션 모두에서 [Eden을 통한 End-to-end 타입 안전성](/eden/overview)을 확보할 수 있습니다.

## Prefix

Elysia 서버가 앱 라우터의 루트 디렉터리에 있지 않으므로 Elysia 서버에 접두사를 주석으로 달아야 합니다.

예를 들어, Elysia 서버를 **app/user/[[...slugs]]/route.ts**에 배치하는 경우, Elysia 서버에 접두사로 **/user**를 주석으로 달아야 합니다.

::: code-group

```typescript [app/user/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

export default new Elysia({ prefix: '/user' }) // [!code ++]
	.get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch
export const POST = app.fetch
```

:::

이렇게 하면 어디에 배치하든 Elysia 라우팅이 제대로 작동합니다.

## Eden

tRPC와 유사한 **end-to-end 타입 안전성**을 위해 [Eden](/eden/overview)을 추가할 수 있습니다.

1. Elysia 서버에서 `type` 내보내기

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia } from 'elysia'

const app = new Elysia({ prefix: '/api' })
	.get('/', 'Hello Nextjs')
	.post(
		'/user',
		({ body }) => body,
		{
			body: treaty.schema('User', {
				name: 'string'
			})
		}
	)

export type app = typeof app // [!code ++]

export const GET = app.fetch
export const POST = app.fetch
```

:::

2. Treaty 클라이언트 생성

::: code-group

```typescript [lib/eden.ts]
import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'

export const api = treaty<app>('localhost:3000/api')
```

:::

3. 서버 및 클라이언트 컴포넌트 모두에서 클라이언트 사용

::: code-group

```tsx [app/page.tsx]
import { api } from '../lib/eden'

export default async function Page() {
	const message = await api.get()

	return <h1>Hello, {message}</h1>
}
```

:::

자세한 정보는 [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers)를 참조하세요.
