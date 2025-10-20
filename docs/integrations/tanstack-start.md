---
title: TanStack Start와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: TanStack Start와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia는 TanStack Start API 서버 라우트 내에서 실행할 수 있으며, Data Loader 또는 Eden을 사용하는 TanStack React Query와 함께 타입 안전성을 제공합니다.

    - - meta
      - property: 'og:description'
        content: Elysia는 TanStack Start API 서버 라우트 내에서 실행할 수 있으며, Data Loader 또는 Eden을 사용하는 TanStack React Query와 함께 타입 안전성을 제공합니다.
---

# TanStack Start와의 통합

Elysia는 TanStack Start 서버 라우트 내에서 실행할 수 있습니다.

1. **src/routes/api.$.ts**를 생성합니다
2. Elysia 서버를 정의합니다
3. **server.handlers**에 Elysia 핸들러를 내보냅니다

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api' // [!code ++]
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request) // [!code ++]

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle, // [!code ++]
			POST: handle // [!code ++]
		}
	}
})
```

:::

이제 Elysia가 **/api**에서 실행되어야 합니다.

필요에 따라 다른 HTTP 메서드를 지원하기 위해 **server.handlers**에 추가 메서드를 추가할 수 있습니다.

## Eden

tRPC와 유사한 **엔드투엔드 타입 안전성**을 위해 [Eden](/eden/overview.html)을 추가할 수 있습니다.

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden' // [!code ++]

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api'
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle,
			POST: handle
		}
	}
})

export const api = createIsomorphicFn() // [!code ++]
	.server(() => treaty(app).api) // [!code ++]
	.client(() => treaty<typeof app>('localhost:3000').api) // [!code ++]
```

:::

**createIsomorphicFn**을 사용하여 서버와 클라이언트 모두에 대해 별도의 Eden Treaty 인스턴스를 생성합니다.
1. 서버에서는 HTTP 오버헤드 없이 Elysia가 직접 호출됩니다.
2. 클라이언트에서는 HTTP를 통해 Elysia 서버를 호출합니다.

React 컴포넌트에서는 `getTreaty`를 사용하여 타입 안전성을 갖춘 Elysia 서버를 호출할 수 있습니다.

## Loader Data
TanStack Start는 컴포넌트를 렌더링하기 전에 데이터를 가져오는 **Loader**를 지원합니다.

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App,
	loader: () => getTreaty().get().then((res) => res.data) // [!code ++]
})

function App() {
	const data = Route.useLoaderData() // [!code ++]

	return data
}
```

:::

loader에서 Elysia를 호출하면 SSR 중에 서버 측에서 실행되며 HTTP 오버헤드가 없습니다.

Eden Treaty는 서버와 클라이언트 모두에서 타입 안전성을 보장합니다.

## React Query
클라이언트에서 Elysia 서버와 상호 작용하기 위해 React Query를 사용할 수도 있습니다.

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App
})

function App() {
	const { data: response } = useQuery({ // [!code ++]
		queryKey: ['get'], // [!code ++]
		queryFn: () => getTreaty().get() // [!code ++]
	}) // [!code ++]

	return response?.data
}
```

::: code-group

이것은 캐싱, 페이지네이션, 무한 쿼리 등과 같은 모든 React Query 기능과 함께 작동합니다.

---

TanStack Start에 대한 자세한 정보는 [TanStack Start Documentation](https://tanstack.com/start)을 참조하세요.
