---
title: Expo와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Expo와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Expo App Router를 사용하면 Expo 라우트에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.

    - - meta
      - property: 'og:description'
        content: Expo App Router를 사용하면 Expo 라우트에서 Elysia를 실행할 수 있습니다. WinterCG 호환성 덕분에 Elysia는 정상적으로 작동합니다.
---

# Expo와의 통합

Expo SDK 50 및 App Router v3부터 Expo 앱에서 직접 API 라우트를 생성할 수 있습니다.

1. **app/[...slugs]+api.ts** 생성
2. Elysia 서버 정의
3. 사용하려는 HTTP 메서드 이름으로 **Elysia.fetch** 내보내기

::: code-group

```typescript [app/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hello Expo')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::

Elysia 서버를 일반 Expo API 라우트처럼 취급할 수 있습니다.

## Prefix
Elysia 서버를 앱 라우터의 루트 디렉터리가 아닌 다른 곳에 배치하는 경우, Elysia 서버에 접두사를 주석으로 달아야 합니다.

예를 들어, Elysia 서버를 **app/api/[...slugs]+api.ts**에 배치하는 경우, Elysia 서버에 접두사로 **/api**를 주석으로 달아야 합니다.

::: code-group

```typescript [app/api/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', 'Hello Expo')
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

```typescript [app/[...slugs]+api.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
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
import type { app } from '../app/[...slugs]+api'

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

## 배포
필요한 경우 Elysia를 사용하여 API 라우트를 직접 사용하고 일반 Elysia 앱으로 배포하거나 [실험적 Expo 서버 런타임](https://docs.expo.dev/router/reference/api-routes/#deployment)을 사용할 수 있습니다.

Expo 서버 런타임을 사용하는 경우 `expo export` 명령을 사용하여 Expo 앱용 최적화된 빌드를 생성할 수 있으며, **dist/server/_expo/functions/[...slugs\]+api.js**에 Elysia를 사용하는 Expo 함수가 포함됩니다.

::: tip
Expo Functions는 일반 서버가 아닌 Edge 함수로 취급되므로 Edge 함수를 직접 실행해도 포트가 할당되지 않습니다.
:::

Expo가 제공하는 Expo 함수 어댑터를 사용하여 Edge Function을 배포할 수 있습니다.

현재 Expo는 다음 어댑터를 지원합니다:
- [Express](https://docs.expo.dev/router/reference/api-routes/#express)
- [Netlify](https://docs.expo.dev/router/reference/api-routes/#netlify)
- [Vercel](https://docs.expo.dev/router/reference/api-routes/#vercel)
