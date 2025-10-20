---
title: Migrate from tRPC - ElysiaJS
prev:
  text: 'Quick Start'
  link: '/quick-start'
next:
  text: 'Tutorial'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Migrate from tRPC - ElysiaJS

    - - meta
      - name: 'description'
        content: This guide is for tRPC users who want to see a differences from Elysia including syntax, and how to migrate your application from tRPC to Elysia by example.

    - - meta
      - property: 'og:description'
        content: This guide is for tRPC users who want to see a differences from Elysia including syntax, and how to migrate your application from tRPC to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-hono.vue'
</script>

# tRPC에서 Elysia로

이 가이드는 Elysia와의 차이점(구문 포함)을 확인하고, 예제를 통해 애플리케이션을 tRPC에서 Elysia로 마이그레이션하는 방법을 알고 싶은 tRPC 사용자를 위한 것입니다.

**tRPC**는 TypeScript를 사용하여 API를 구축하기 위한 타입 안전 RPC 프레임워크입니다. 프론트엔드와 백엔드 간의 타입 안전 계약으로 엔드투엔드 타입 안전 API를 만드는 방법을 제공합니다.

**Elysia**는 인체공학적인 웹 프레임워크입니다. **견고한 타입 안전성**과 성능에 중점을 두고 인체공학적이고 개발자 친화적으로 설계되었습니다.

## 개요
tRPC는 주로 RESTful API 위에 독점적인 추상화를 사용하는 RPC 통신으로 설계된 반면, Elysia는 RESTful API에 중점을 둡니다.

tRPC의 주요 기능은 프론트엔드와 백엔드 간의 엔드투엔드 타입 안전 계약이며, Elysia도 [Eden](/eden/overview)을 통해 이를 제공합니다.

Elysia는 tRPC가 제공하는 엔드투엔드 타입 안전성을 가지면서, 개발자가 이미 알고 있는 RESTful 표준으로 새로운 독점 추상화를 배우는 대신 범용 API를 구축하는 데 더 적합합니다.

## 라우팅

Elysia는 Express 및 Hono와 유사한 구문을 사용하며, `app.get()` 및 `app.post()` 메서드를 사용하여 라우트를 정의하고 유사한 경로 매개변수 구문을 사용합니다.

tRPC는 중첩된 라우터 접근 방식을 사용하여 라우트를 정의합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'

const t = initTRPC.create()

const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello World'),
	user: t.router({
		getById: t.procedure
			.input((id: string) => id)
			.query(({ input }) => {
				return { id: input }
			})
	})
})

const server = createHTTPServer({
  	router: appRouter
})

server.listen(3000)
```

:::
</template>

<template v-slot:left-content>

> tRPC는 중첩된 라우터와 프로시저를 사용하여 라우트를 정의합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'Hello World')
    .post(
    	'/id/:id',
     	({ status, params: { id } }) => {
      		return status(201, id)
      	}
    )
    .listen(3000)
```

:::
</template>

<template v-slot:right-content>

> Elysia는 HTTP 메서드와 경로 매개변수를 사용하여 라우트를 정의합니다

</template>

</Compare>

tRPC는 프로시저와 라우터를 사용하여 RESTful API 위에 독점적인 추상화를 사용하는 반면, Elysia는 Express 및 Hono와 유사한 구문을 사용하며 `app.get()` 및 `app.post()` 메서드와 유사한 경로 매개변수 구문을 사용하여 라우트를 정의합니다.

## 핸들러

tRPC 핸들러는 `query` 또는 `mutation`일 수 있는 `procedure`라고 하며, Elysia는 `get`, `post`, `put`, `delete` 등과 같은 HTTP 메서드를 사용합니다.

tRPC는 쿼리, 헤더, 상태 코드 등과 같은 HTTP 속성 개념이 없으며 `input`과 `output`만 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const appRouter = t.router({
	user: t.procedure
		.input((val: { limit?: number; name: string; authorization?: string }) => val)
		.mutation(({ input }) => {
			const limit = input.limit
			const name = input.name
			const auth = input.authorization

			return { limit, name, auth }
		})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 모든 속성에 대해 단일 `input`을 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.post('/user', (ctx) => {
	    const limit = ctx.query.limit
	    const name = ctx.body.name
	    const auth = ctx.headers.authorization

	    return { limit, name, auth }
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 각 HTTP 속성에 대해 특정 속성을 사용합니다

</template>

</Compare>

Elysia는 **정적 코드 분석**을 사용하여 무엇을 파싱할지 결정하고 필요한 속성만 파싱합니다.

이는 성능과 타입 안전성에 유용합니다.

## 서브라우터

tRPC는 중첩된 라우터를 사용하여 서브라우터를 정의하는 반면, Elysia는 `.use()` 메서드를 사용하여 서브라우터를 정의합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const subRouter = t.router({
	user: t.procedure.query(() => 'Hello User')
})

const appRouter = t.router({
	api: subRouter
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 중첩된 라우터를 사용하여 서브라우터를 정의합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.get('/user', 'Hello User')

const app = new Elysia()
	.use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia는 `.use()` 메서드를 사용하여 서브라우터를 정의합니다

</template>

</Compare>

tRPC에서 서브라우터를 인라인할 수 있지만, Elysia는 `.use()` 메서드를 사용하여 서브라우터를 정의합니다.

## 유효성 검사
둘 다 유효성 검사를 위해 Standard Schema를 지원합니다. Zod, Yup, Valibot 등과 같은 다양한 유효성 검사 라이브러리를 사용할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const appRouter = t.router({
	user: t.procedure
		.input(
			z.object({
				id: z.number(),
				name: z.string()
			})
		)
		.mutation(({ input }) => input)
//                    ^?
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 `input`을 사용하여 유효성 검사 스키마를 정의합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia TypeBox]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: t.Object({
			id: t.Number()
		}),
		body: t.Object({
			name: t.String()
		})
	})
```

```ts twoslash [Elysia Zod]
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: z.object({
			id: z.number()
		}),
		body: z.object({
			name: z.string()
		})
	})
```

```ts twoslash [Elysia Valibot]
import { Elysia } from 'elysia'
import * as v from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: v.object({
			id: v.number()
		}),
		body: v.object({
			name: v.string()
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 특정 속성을 사용하여 유효성 검사 스키마를 정의합니다

</template>

</Compare>

둘 다 스키마에서 컨텍스트로 자동으로 타입 추론을 제공합니다.

## 파일 업로드
tRPC는 기본적으로 파일 업로드를 지원하지 않으며, 비효율적이고 mimetype 유효성 검사를 지원하지 않는 `base64` 문자열을 input으로 사용해야 합니다.

Elysia는 Web Standard API를 사용하여 파일 업로드를 기본적으로 지원합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { fileTypeFromBuffer } from 'file-type'

const t = initTRPC.create()

export const uploadRouter = t.router({
	uploadImage: t.procedure
		.input(z.base64())
		.mutation(({ input }) => {
			const buffer = Buffer.from(input, 'base64')

			const type = await fileTypeFromBuffer(buffer)
			if (!type || !type.mime.startsWith('image/'))
				throw new TRPCError({
      				code: 'UNPROCESSABLE_CONTENT',
       				message: 'Invalid file type',
    			})

			return input
		})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/upload', ({ body }) => body.file, {
		body: t.Object({
			file: t.File({
				type: 'image'
			})
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 파일 및 mimetype 유효성 검사를 선언적으로 처리합니다

</template>

</Compare>

tRPC는 기본적으로 mimetype을 검증하지 않으므로 실제 타입을 검증하려면 `file-type`과 같은 타사 라이브러리를 사용해야 합니다.

## 미들웨어

tRPC 미들웨어는 Express와 유사한 `next`를 사용하여 단일 큐 기반 순서를 사용하는 반면, Elysia는 **이벤트 기반** 라이프사이클을 사용하여 더 세밀한 제어를 제공합니다.

Elysia의 라이프사이클 이벤트는 다음과 같이 설명할 수 있습니다.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> 이미지를 클릭하여 확대

tRPC는 요청 파이프라인에 대한 단일 흐름을 순서대로 갖는 반면, Elysia는 요청 파이프라인의 각 이벤트를 가로챌 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const log = t.middleware(async ({ ctx, next }) => {
	console.log('Request started')

	const result = await next()

	console.log('Request ended')

	return result
})

const appRouter = t.router({
	hello: log
		.procedure
		.query(() => 'Hello World')
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 프로시저로 정의된 단일 미들웨어 큐를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	// Global middleware
	.onRequest(({ method, path }) => {
		console.log(`${method} ${path}`)
	})
	// Route-specific middleware
	.get('/protected', () => 'protected', {
		beforeHandle({ status, headers }) {
  			if (!headers.authorizaton)
     			return status(401)
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청 파이프라인의 각 지점에 대해 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

tRPC는 큐에서 다음 미들웨어를 호출하는 `next` 함수를 갖는 반면, Elysia는 요청 파이프라인의 각 지점에 대해 특정 이벤트 인터셉터를 사용합니다.

## 견고한 타입 안전성
Elysia는 견고한 타입 안전성을 갖도록 설계되었습니다.

예를 들어, [derive](/essential/life-cycle.html#derive) 및 [resolve](/essential/life-cycle.html#resolve)를 사용하여 **타입 안전** 방식으로 컨텍스트를 사용자 정의할 수 있지만, tRPC는 타입 케이스에 의한 `context`를 사용하여 제공하며 이는 100% 타입 안전성을 보장하지 않아 불건전합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.context<{
	version: number
	token: string
}>().create()

const appRouter = t.router({
	version: t.procedure.query(({ ctx: { version } }) => version),
	//                                                     ^?


	token: t.procedure.query(({ ctx: { token, version } }) => {
		version
		//  ^?

		return token
		//       ^?
	})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 `context`를 사용하여 컨텍스트를 확장하지만 견고한 타입 안전성을 갖지 않습니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.decorate('version', 2)
	.get('/version', ({ version }) => version)
	.resolve(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)

		return {
			token: authorization.split(' ')[1]
		}
	})
	.get('/token', ({ token, version }) => {
		version
		//  ^?


		return token
		//       ^?
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청 파이프라인의 각 지점에 대해 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

## 미들웨어 매개변수
둘 다 사용자 정의 미들웨어를 지원하지만, Elysia는 매크로를 사용하여 사용자 정의 인수를 사용자 정의 미들웨어에 전달하는 반면, tRPC는 타입 안전하지 않은 고차 함수를 사용합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC.create()

const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}

const role = (role: 'user' | 'admin') =>
	t.middleware(({ next, input }) => {
		const user = findUser(input as string)
		//                      ^?


		if(user.role !== role)
			throw new TRPCError({
      			code: 'UNAUTHORIZED',
      			message: 'Unauthorized',
    		})

		return next({
			ctx: {
				user
			}
		})
	})

const appRouter = t.router({
	token: t.procedure
		.use(role('admin'))
		.query(({ ctx: { user } }) => user)
		//                 ^?
})



// ---cut-after---
// Unused
```

:::
</template>

<template v-slot:left-content>

> tRPC는 고차 함수를 사용하여 사용자 정의 인수를 사용자 정의 미들웨어에 전달합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
import { Elysia } from 'elysia'

const app = new Elysia()
	.macro({
		role: (role: 'user' | 'admin') => ({
			resolve({ status, headers: { authorization } }) {
				const user = findUser(authorization)

				if(user.role !== role)
					return status(401)

				return {
					user
				}
			}
		})
	})
	.get('/token', ({ user }) => user, {
	//                 ^?
		role: 'admin'
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 매크로를 사용하여 사용자 정의 인수를 사용자 정의 미들웨어에 전달합니다

</template>

</Compare>

## 오류 처리

tRPC는 오류를 처리하기 위해 미들웨어와 유사한 것을 사용하는 반면, Elysia는 타입 안전성을 갖춘 사용자 정의 오류와 전역 및 라우트별 오류 핸들러 모두에 대한 오류 인터셉터를 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [trpc]
import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC.create()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

const appRouter = t.router()
	.middleware(async ({ next }) => {
		try {
			return await next()
		} catch (error) {
			console.log(error)

			throw new TRPCError({
	  			code: 'INTERNAL_SERVER_ERROR',
	  			message: error.message
			})
		}
	})
	.query('error', () => {
		throw new CustomError('oh uh')
	})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 오류를 처리하기 위해 미들웨어와 유사한 것을 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

class CustomError extends Error {
	// Optional: custom HTTP status code
	status = 500

	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}

	// Optional: what should be sent to the client
	toResponse() {
		return {
			message: "If you're seeing this, our dev forgot to handle this error",
			error: this
		}
	}
}

const app = new Elysia()
	// Optional: register custom error class
	.error({
		CUSTOM: CustomError,
	})
	// Global error handler
	.onError(({ error, code }) => {
		if(code === 'CUSTOM')
		// ^?




			return {
				message: 'Something went wrong!',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('oh uh')
	}, {
		// Optional: route specific error handler
		error({ error }) {
			return {
				message: 'Only for this route!',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 오류 처리 및 스코핑 메커니즘에 대한 더 세밀한 제어를 제공합니다

</template>

</Compare>

tRPC는 미들웨어와 유사한 것을 사용하여 오류 처리를 제공하는 반면, Elysia는 다음을 제공합니다:

1. 전역 및 라우트별 오류 핸들러
2. HTTP 상태 매핑을 위한 단축키와 오류를 응답에 매핑하기 위한 `toResponse`
3. 각 오류에 대한 사용자 정의 오류 코드 제공

오류 코드는 로깅 및 디버깅에 유용하며, 동일한 클래스를 확장하는 다른 오류 유형을 구분할 때 중요합니다.

Elysia는 tRPC가 그렇지 않은 반면, 타입 안전성을 갖춘 모든 것을 제공합니다.

## 캡슐화

tRPC는 프로시저 또는 라우터에 의해 부작용을 캡슐화하여 항상 격리되도록 하는 반면, Elysia는 명시적 스코핑 메커니즘과 코드 순서를 통해 플러그인의 부작용을 제어할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const subRouter = t.router()
	.middleware(({ ctx, next }) => {
		if(!ctx.headers.authorization?.startsWith('Bearer '))
			throw new TRPCError({
	  			code: 'UNAUTHORIZED',
	  			message: 'Unauthorized',
			})

		return next()
	})

const appRouter = t.router({
	// doesn't have side-effect from subRouter
	hello: t.procedure.query(() => 'Hello World'),
	api: subRouter
		.mutation('side-effect', () => 'hi')
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 플러그인의 부작용을 프로시저 또는 라우터로 캡슐화합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // doesn't have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:right-content>

> Elysia는 명시적으로 명시하지 않는 한 플러그인의 부작용을 캡슐화합니다

</template>

</Compare>

둘 다 부작용을 방지하기 위한 플러그인 캡슐화 메커니즘을 갖습니다.

그러나 Elysia는 범위를 선언하여 어떤 플러그인이 부작용을 가져야 하는지 명시적으로 명시할 수 있지만, Fastify는 항상 캡슐화합니다.

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	// Scoped to parent instance but not beyond
	.as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // now have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

Elysia는 3가지 유형의 스코핑 메커니즘을 제공합니다:
1. **local** - 현재 인스턴스에만 적용, 부작용 없음 (기본값)
2. **scoped** - 부작용을 부모 인스턴스로 범위 지정하지만 그 이상은 아님
3. **global** - 모든 인스턴스에 영향

## OpenAPI
tRPC는 기본적으로 OpenAPI를 제공하지 않으며 `trpc-to-openapi`와 같은 타사 라이브러리에 의존하는데, 이는 간소화된 솔루션이 아닙니다.

Elysia는 한 줄의 코드로 [@elysiajs/openapi](/plugins/openapi)를 사용하여 OpenAPI에 대한 기본 지원을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'

import { OpenApiMeta } from 'trpc-to-openapi';

const t = initTRPC.meta<OpenApiMeta>().create()

const appRouter = t.router({
	user: t.procedure
		.meta({
			openapi: {
				method: 'post',
				path: '/users',
				tags: ['User'],
				summary: 'Create user',
			}
		})
		.input(
			t.array(
				t.object({
					name: t.string(),
					age: t.number()
				})
			)
		)
		.output(
			t.array(
				t.object({
					name: t.string(),
					age: t.number()
				})
			)
		)
		.mutation(({ input }) => input)
})

export const openApiDocument = generateOpenApiDocument(appRouter, {
  	title: 'tRPC OpenAPI',
  	version: '1.0.0',
  	baseUrl: 'http://localhost:3000'
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 OpenAPI 스펙을 생성하기 위해 타사 라이브러리에 의존합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

const app = new Elysia()
	.use(openapi()) // [!code ++]
	.model({
		user: t.Array(
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		)
	})
	.post('/users', ({ body }) => body, {
	//                  ^?
		body: 'user',
		response: {
			201: 'user'
		},
		detail: {
			summary: 'Create user'
		}
	})

```

:::
</template>

<template v-slot:right-content>

> Elysia는 스키마에 사양을 원활하게 통합합니다

</template>

</Compare>

tRPC는 OpenAPI 스펙을 생성하기 위해 타사 라이브러리에 의존하며, 메타데이터에 올바른 경로 이름과 HTTP 메서드를 정의해야 **합니다**. 이는 라우터와 프로시저를 배치하는 방법을 **지속적으로 인식**하도록 강제합니다.

Elysia는 제공하는 스키마를 사용하여 OpenAPI 사양을 생성하고, 요청/응답을 검증하며, **단일 진실의 소스**에서 자동으로 타입을 추론합니다.

Elysia는 또한 `model`에 등록된 스키마를 OpenAPI 스펙에 추가하여, Swagger 또는 Scalar UI의 전용 섹션에서 모델을 참조할 수 있도록 하는 반면, tRPC에서는 라우트에 스키마를 인라인합니다.

## 테스트

Elysia는 Web Standard API를 사용하여 요청과 응답을 처리하는 반면, tRPC는 `createCallerFactory`를 사용하여 요청을 실행하기 위해 많은 의식이 필요합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { describe, it, expect } from 'vitest'

import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const publicProcedure = t.procedure
const { createCallerFactory, router } = t

const appRouter = router({
	post: router({
		add: publicProcedure
			.input(
				z.object({
					title: z.string().min(2)
				})
			)
			.mutation(({ input }) => input)
	})
})

const createCaller = createCallerFactory(appRouter)

const caller = createCaller({})

describe('GET /', () => {
	it('should return Hello World', async () => {
		const newPost = await caller.post.add({
			title: '74 Itoki Hana'
		})

		expect(newPost).toEqual({
			title: '74 Itoki Hana'
		})
	})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC는 요청을 실행하기 위해 `createCallerFactory`와 많은 의식이 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.post('/add', ({ body }) => body, {
		body: t.Object({
			title: t.String({ minLength: 2 })
		})
	})

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.handle(
			new Request('http://localhost/add', {
				method: 'POST',
				body: JSON.stringify({ title: '74 Itoki Hana' }),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		)

		expect(res.status).toBe(200)
		expect(await res.res()).toEqual({
			title: '74 Itoki Hana'
		})
	})
})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 Web Standard API를 사용하여 요청과 응답을 처리합니다

</template>

</Compare>

또는 Elysia는 엔드투엔드 타입 안전성을 위한 [Eden](/eden/overview)이라는 헬퍼 라이브러리를 제공하여 `tRPC.createCallerFactory`와 유사하게, 의식 없이 tRPC와 같은 자동 완성 및 완전한 타입 안전성으로 테스트할 수 있습니다.

```ts twoslash [Elysia]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

const app = new Elysia().get('/hello', 'Hello World')
const api = treaty(app)

describe('GET /', () => {
	it('should return Hello World', async () => {
		const { data, error, status } = await api.hello.get()

		expect(status).toBe(200)
		expect(data).toBe('Hello World')
		//      ^?
	})
})
```

## 엔드투엔드 타입 안전성
둘 다 클라이언트-서버 통신을 위한 엔드투엔드 타입 안전성을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z }  from 'zod'

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

const t = initTRPC.create()

const appRouter = t.router({
	mirror: t.procedure
		.input(
			z.object({
				message: z.string()
			})
		)
		.output(
			z.object({
				message: z.string()
			})
		)
		.mutation(({ input }) => input)
})

const server = createHTTPServer({
  	router: appRouter
})

server.listen(3000)

const client = createTRPCProxyClient<typeof appRouter>({
	links: [
		httpBatchLink({
			url: 'http://localhost:3000'
		})
	]
})

const { message } = await client.mirror.mutate({
	message: 'Hello World'
})

message
// ^?




// ---cut-after---
console.log('ok')
```

:::
</template>

<template v-slot:left-content>

> tRPC는 `createTRPCProxyClient`를 사용하여 엔드투엔드 타입 안전성을 갖춘 클라이언트를 생성합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/mirror', ({ body }) => body, {
		body: t.Object({
			message: t.String()
		})
	})

const api = treaty(app)

const { data, error } = await api.mirror.post({
	message: 'Hello World'
})

if(error)
	throw error
	//     ^?















console.log(data)
//          ^?



// ---cut-after---
console.log('ok')
```

:::
</template>

<template v-slot:right-content>

> Elysia는 `treaty`를 사용하여 요청을 실행하고 엔드투엔드 타입 안전성을 제공합니다

</template>

</Compare>

둘 다 엔드투엔드 타입 안전성을 제공하지만, tRPC는 요청이 성공한 **행복한 경로**만 처리하며, 오류 처리의 타입 건전성이 없어 불건전합니다.

타입 건전성이 중요하다면 Elysia가 올바른 선택입니다.

---

tRPC는 타입 안전 API를 구축하기 위한 훌륭한 프레임워크이지만, RESTful 준수 및 타입 건전성 측면에서 한계가 있습니다.

Elysia는 개발자 경험과 **타입 건전성**에 중점을 두고 인체공학적이고 개발자 친화적으로 설계되어, RESTful, OpenAPI 및 WinterTC Standard를 준수하여 범용 API를 구축하는 데 더 적합합니다.

또는 다른 프레임워크에서 오는 경우 다음을 확인할 수 있습니다:

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		tRPC와 Elysia 비교
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Fastify와 Elysia 비교
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		tRPC와 Elysia 비교
	</Card>
</Deck>
