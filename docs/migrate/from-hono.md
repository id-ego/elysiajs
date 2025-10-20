---
title: Hono에서 마이그레이션 - ElysiaJS
prev:
  text: '빠른 시작'
  link: '/quick-start'
next:
  text: '튜토리얼'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Hono에서 마이그레이션 - ElysiaJS

    - - meta
      - name: 'description'
        content: 이 가이드는 Hono 사용자가 구문을 포함한 Elysia와의 차이점을 보고 예제를 통해 Hono에서 Elysia로 애플리케이션을 마이그레이션하는 방법을 알고 싶어하는 분들을 위한 것입니다.

    - - meta
      - property: 'og:description'
        content: 이 가이드는 Hono 사용자가 구문을 포함한 Elysia와의 차이점을 보고 예제를 통해 Hono에서 Elysia로 애플리케이션을 마이그레이션하는 방법을 알고 싶어하는 분들을 위한 것입니다.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-hono.vue'
</script>

# Hono에서 Elysia로

이 가이드는 Hono 사용자가 구문을 포함한 Elysia와의 차이점을 보고 예제를 통해 Hono에서 Elysia로 애플리케이션을 마이그레이션하는 방법을 알고 싶어하는 분들을 위한 것입니다.

**Hono**는 Web Standard 위에 구축된 빠르고 가벼운 웹 프레임워크입니다. Deno, Bun, Cloudflare Workers, Node.js와 같은 여러 런타임과 광범위한 호환성을 가지고 있습니다.

**Elysia**는 인체공학적 웹 프레임워크입니다. **건전한 타입 안전성**과 성능에 중점을 두고 인체공학적이며 개발자 친화적으로 설계되었습니다.

두 프레임워크 모두 Web Standard API 위에 구축되어 약간 다른 구문을 가지고 있습니다. Hono는 여러 런타임과의 호환성을 더 많이 제공하는 반면, Elysia는 특정 런타임 세트에 중점을 둡니다.

## 성능
Elysia는 정적 코드 분석 덕분에 Hono보다 훨씬 향상된 성능을 제공합니다.

<Benchmark />

## 라우팅

Hono와 Elysia는 유사한 라우팅 구문을 가지고 있으며, `app.get()` 및 `app.post()` 메서드를 사용하여 라우트를 정의하고 유사한 경로 매개변수 구문을 사용합니다.

둘 다 단일 `Context` 매개변수를 사용하여 요청과 응답을 처리하고 응답을 직접 반환합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello World')
})

app.post('/id/:id', (c) => {
	c.status(201)
    return c.text(req.params.id)
})

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono는 응답을 반환하기 위해 헬퍼 `c.text`, `c.json`을 사용합니다

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

> Elysia는 단일 `context`를 사용하고 응답을 직접 반환합니다

</template>

</Compare>

Hono가 `c.text` 및 `c.json`을 사용하여 응답을 래핑하는 반면, Elysia는 값을 자동으로 응답에 매핑합니다.

스타일 가이드에 약간의 차이가 있으며, Elysia는 메서드 체이닝과 객체 구조 분해 사용을 권장합니다.

Hono 포트 할당은 런타임 및 어댑터에 따라 달라지는 반면, Elysia는 단일 `listen` 메서드를 사용하여 서버를 시작합니다.

## 핸들러

Hono는 쿼리, 헤더 및 본문을 수동으로 파싱하는 함수를 사용하는 반면, Elysia는 속성을 자동으로 파싱합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.post('/user', async (c) => {
	const limit = c.req.query('limit')
    const { name } = await c.body()
    const auth = c.req.header('authorization')

    return c.json({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 본문을 자동으로 파싱하지만 쿼리 및 헤더에는 적용되지 않습니다

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

> Elysia는 정적 코드 분석을 사용하여 무엇을 파싱할지 분석합니다

</template>

</Compare>

Elysia는 **정적 코드 분석**을 사용하여 무엇을 파싱할지 결정하고 필요한 속성만 파싱합니다.

이는 성능과 타입 안전성에 유용합니다.

## 서브라우터

둘 다 다른 인스턴스를 라우터로 상속할 수 있지만, Elysia는 모든 인스턴스를 서브라우터로 사용할 수 있는 컴포넌트로 취급합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
	return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono는 서브라우터를 분리하기 위해 접두사가 **필요합니다**

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ prefix: '/api' })
	.get('/user', 'Hello User')

const app = new Elysia()
	.use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia는 선택적 접두사 생성자를 사용하여 정의합니다

</template>

</Compare>

Hono가 서브라우터를 분리하기 위해 접두사가 필요한 반면, Elysia는 서브라우터를 분리하기 위한 접두사가 필요하지 않습니다.

## 유효성 검사
Hono는 외부 패키지를 통해 다양한 유효성 검사기를 지원하지만, Elysia는 **TypeBox**를 사용하는 내장 유효성 검사를 가지고 있으며, 추가 라이브러리 없이 Zod, Valibot, ArkType, Effect Schema 등과 같은 좋아하는 라이브러리를 사용할 수 있도록 Standard Schema를 기본적으로 지원합니다. Elysia는 또한 OpenAPI와의 원활한 통합 및 백그라운드에서 타입 추론을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.patch(
	'/user/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number()
		})
	),
	zValidator(
		'json',
		z.object({
			name: z.string()
		})
	),
	(c) => {
		return c.json({
			params: c.req.param(),
			body: c.req.json()
		})
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono는 파이프 기반을 사용합니다

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
import * as v from 'valibot'

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

> Elysia는 유효성 검사에 TypeBox를 사용하고 타입을 자동으로 강제 변환합니다. Zod, Valibot과 같은 다양한 유효성 검사 라이브러리도 동일한 구문으로 지원합니다.

</template>

</Compare>

둘 다 스키마에서 컨텍스트로 타입 추론을 자동으로 제공합니다.

## 파일 업로드
Hono와 Elysia 모두 Web Standard API를 사용하여 파일 업로드를 처리하지만, Elysia는 **file-type**을 사용하여 mimetype을 유효성 검사하기 위한 내장 선언적 지원을 가지고 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { fileTypeFromBlob } from 'file-type'

const app = new Hono()

app.post(
	'/upload',
	zValidator(
		'form',
		z.object({
			file: z.instanceof(File)
		})
	),
	async (c) => {
		const body = await c.req.parseBody()

		const type = await fileTypeFromBlob(body.image as File)
		if (!type || !type.mime.startsWith('image/')) {
			c.status(422)
			return c.text('File is not a valid image')
		}

		return new Response(body.image)
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono는 mimetype을 유효성 검사하기 위해 별도의 `file-type` 라이브러리가 필요합니다

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

Web Standard API가 mimetype을 유효성 검사하지 않으므로 클라이언트가 제공한 `content-type`을 신뢰하는 것은 보안 위험이므로 Hono에는 외부 라이브러리가 필요한 반면, Elysia는 `file-type`을 사용하여 mimetype을 자동으로 유효성 검사합니다.

## 미들웨어

Hono 미들웨어는 Express와 유사한 단일 큐 기반 순서를 사용하는 반면, Elysia는 **이벤트 기반** 라이프사이클을 사용하여 더 세밀한 제어를 제공합니다.

Elysia의 라이프 사이클 이벤트는 다음과 같이 표현할 수 있습니다.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> 이미지를 클릭하여 확대

Hono가 요청 파이프라인에 대한 단일 플로우를 순서대로 가지는 반면, Elysia는 요청 파이프라인의 각 이벤트를 가로챌 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

// Global middleware
app.use(async (c, next) => {
	console.log(`${c.method} ${c.url}`)

	await next()
})

app.get(
	'/protected',
	// Route-specific middleware
	async (c, next) => {
	  	const token = c.headers.authorization

	  	if (!token) {
			c.status(401)
	   		return c.text('Unauthorized')
		}

	  	await next()
	},
	(req, res) => {
  		res.send('Protected route')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono는 순서대로 실행되는 미들웨어에 단일 큐 기반 순서를 사용합니다

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

> Elysia는 요청 파이프라인의 각 지점에 대한 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

Hono가 다음 미들웨어를 호출하기 위한 `next` 함수를 가지는 반면, Elysia는 가지지 않습니다.

## 건전한 타입 안전성
Elysia는 건전한 타입 안전성을 위해 설계되었습니다.

예를 들어, [derive](/essential/life-cycle.html#derive) 및 [resolve](/essential/life-cycle.html#resolve)를 사용하여 **타입 안전** 방식으로 컨텍스트를 커스터마이즈할 수 있지만 Hono는 그렇지 않습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
// @errors: 2339, 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const getVersion = createMiddleware(async (c, next) => {
	c.set('version', 2)

	await next()
})

app.use(getVersion)

app.get('/version', getVersion, (c) => {
	return c.text(c.get('version') + '')
})

const authenticate = createMiddleware(async (c, next) => {
	const token = c.req.header('authorization')

	if (!token) {
		c.status(401)
		return c.text('Unauthorized')
	}

	c.set('token', token.split(' ')[1])

	await next()
})

app.post('/user', authenticate, async (c) => {
	c.get('version')

	return c.text(c.get('token'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 미들웨어를 사용하여 컨텍스트를 확장하지만 타입 안전하지 않습니다

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

> Elysia는 요청 파이프라인의 각 지점에 대한 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

Hono는 `declare module`을 사용하여 `ContextVariableMap` 인터페이스를 확장할 수 있지만, 전역적으로 사용 가능하며 건전한 타입 안전성을 가지지 않고 모든 요청 핸들러에서 속성이 사용 가능한지 보장하지 않습니다.

```ts
declare module 'hono' {
  	interface ContextVariableMap {
    	version: number
  		token: string
  	}
}
```
> 위의 Hono 예제가 작동하려면 이것이 필요하지만, 건전한 타입 안전성을 제공하지 않습니다

## 미들웨어 매개변수
Hono는 재사용 가능한 라우트별 미들웨어를 정의하기 위해 콜백 함수를 사용하는 반면, Elysia는 사용자 정의 후크를 정의하기 위해 [macro](/patterns/macro)를 사용합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339 2589 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const role = (role: 'user' | 'admin') => createMiddleware(async (c, next) => {
	const user = findUser(c.req.header('Authorization'))

	if(user.role !== role) {
		c.status(401)
		return c.text('Unauthorized')
	}

	c.set('user', user)

	await next()
})

app.get('/user/:id', role('admin'), (c) => {
	return c.json(c.get('user'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 콜백을 사용하여 `createMiddleware`를 반환하여 재사용 가능한 미들웨어를 만들지만 타입 안전하지 않습니다

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

> Elysia는 사용자 정의 미들웨어에 사용자 정의 인수를 전달하기 위해 매크로를 사용합니다

</template>

</Compare>

## 오류 처리

Hono는 모든 라우트에 적용되는 `onError` 함수를 제공하는 반면, Elysia는 오류 처리에 대한 더 세밀한 제어를 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts
import { Hono } from 'hono'

const app = new Hono()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// global error handler
app.onError((error, c) => {
	if(error instanceof CustomError) {
		c.status(500)

		return c.json({
			message: 'Something went wrong!',
			error
		})
	}
})

// route-specific error handler
app.get('/error', (req, res) => {
	throw new CustomError('oh uh')
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 오류를 처리하기 위해 `onError` 함수를 사용하며, 모든 라우트에 대한 단일 오류 핸들러입니다

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

> Elysia는 오류 처리 및 범위 지정 메커니즘에 대한 더 세밀한 제어를 제공합니다

</template>

</Compare>

Hono가 미들웨어와 같은 오류 처리를 제공하는 반면, Elysia는 다음을 제공합니다:

1. 전역 및 라우트별 오류 핸들러 모두
2. HTTP 상태 매핑을 위한 약칭 및 오류를 응답에 매핑하기 위한 `toResponse`
3. 각 오류에 대한 사용자 정의 오류 코드 제공

오류 코드는 로깅 및 디버깅에 유용하며, 동일한 클래스를 확장하는 다른 오류 유형을 구별할 때 중요합니다.

Elysia는 타입 안전성과 함께 이 모든 것을 제공하지만 Hono는 그렇지 않습니다.

## 캡슐화

Hono는 플러그인 부작용을 캡슐화하는 반면, Elysia는 명시적 범위 지정 메커니즘 및 코드 순서를 통해 플러그인의 부작용을 제어할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
	return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono는 플러그인의 부작용을 캡슐화합니다

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

> Elysia는 명시적으로 지정하지 않는 한 플러그인의 부작용을 캡슐화합니다

</template>

</Compare>

둘 다 부작용을 방지하기 위한 플러그인의 캡슐화 메커니즘을 가지고 있습니다.

그러나 Elysia는 범위를 선언하여 어떤 플러그인이 부작용을 가져야 하는지 명시적으로 지정할 수 있지만 Fastify는 항상 캡슐화합니다.

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

Elysia는 3가지 유형의 범위 지정 메커니즘을 제공합니다:
1. **local** - 현재 인스턴스에만 적용, 부작용 없음(기본값)
2. **scoped** - 부모 인스턴스에 범위 부작용이 있지만 그 이상은 아님
3. **global** - 모든 인스턴스에 영향

---

Hono는 범위 지정 메커니즘을 제공하지 않으므로 다음 중 하나를 수행해야 합니다:

1. 각 후크에 대한 함수를 만들고 수동으로 추가
2. 고차 함수를 사용하고 효과가 필요한 인스턴스에 적용

그러나 주의하지 않으면 중복된 부작용이 발생할 수 있습니다.

```ts [Hono]
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const middleware = createMiddleware(async (c, next) => {
	console.log('called')

	await next()
})

const app = new Hono()
const subRouter = new Hono()

app.use(middleware)
app.get('/main', (c) => c.text('Hello from main!'))

subRouter.use(middleware)

// This would log twice
subRouter.get('/sub', (c) => c.text('Hello from sub router!'))

app.route('/sub', subRouter)

export default app
```

이 시나리오에서 Elysia는 중복된 부작용을 방지하기 위한 플러그인 중복 제거 메커니즘을 제공합니다.

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ name: 'subRouter' }) // [!code ++]
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	.as('scoped')

const app = new Elysia()
	.get('/', 'Hello World')
	.use(subRouter)
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	// side-effect only called once
	.get('/side-effect', () => 'hi')
```

고유한 `name`을 사용하면 Elysia는 플러그인을 한 번만 적용하고 중복된 부작용을 일으키지 않습니다.

## Cookie
Hono는 `hono/cookie` 아래에 내장 쿠키 유틸리티 함수를 가지고 있는 반면, Elysia는 쿠키를 처리하기 위해 시그널 기반 접근 방식을 사용합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'

const app = new Hono()

app.get('/', async (c) => {
	const name = await getSignedCookie(c, 'secret', 'name')

	await setSignedCookie(
		c,
		'name',
		'value',
		'secret',
		{
			maxAge: 1000,
		}
	)
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 쿠키를 처리하기 위해 유틸리티 함수를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia({
	cookie: {
		secret: 'secret'
	}
})
	.get('/', ({ cookie: { name } }) => {
		// signature verification is handle automatically
		name.value

		// cookie signature is signed automatically
		name.value = 'value'
		name.maxAge = 1000 * 60 * 60 * 24
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 쿠키를 처리하기 위해 시그널 기반 접근 방식을 사용합니다

</template>

</Compare>

## OpenAPI
Hono는 스펙을 설명하기 위해 추가 노력이 필요한 반면, Elysia는 스펙을 스키마에 원활하게 통합합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator as zodValidator } from 'hono-openapi/zod'
import { swaggerUI } from '@hono/swagger-ui'

import { z } from '@hono/zod-openapi'

const app = new Hono()

const model = z.array(
	z.object({
		name: z.string().openapi({
			description: 'first name only'
		}),
		age: z.number()
	})
)

const detail = await resolver(model).builder()

console.log(detail)

app.post(
	'/',
	zodValidator('json', model),
	describeRoute({
		validateResponse: true,
		summary: 'Create user',
		requestBody: {
			content: {
				'application/json': { schema: detail.schema }
			}
		},
		responses: {
			201: {
				description: 'User created',
				content: {
					'application/json': { schema: resolver(model) }
				}
			}
		}
	}),
	(c) => {
		c.status(201)
		return c.json(c.req.valid('json'))
	}
)

app.get('/ui', swaggerUI({ url: '/doc' }))

app.get(
	'/doc',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'Hono API',
				version: '1.0.0',
				description: 'Greeting API'
			},
			components: {
				...detail.components
			}
		}
	})
)

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono는 스펙을 설명하기 위해 추가 노력이 필요합니다

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

> Elysia는 스펙을 스키마에 원활하게 통합합니다

</template>

</Compare>

Hono는 라우트 스펙을 설명하고 유효성 검사하기 위한 별도의 함수를 가지고 있으며, 제대로 설정하기 위해 일부 노력이 필요합니다.

Elysia는 제공한 스키마를 사용하여 OpenAPI 스펙을 생성하고 요청/응답을 유효성 검사하며 **단일 진실 공급원**에서 타입을 자동으로 추론합니다.

Elysia는 또한 `model`에 등록된 스키마를 OpenAPI 스펙에 추가하여 Swagger 또는 Scalar UI의 전용 섹션에서 모델을 참조할 수 있도록 하는 반면, Hono는 스키마를 라우트에 인라인합니다.

## 테스팅

둘 다 Web Standard API 위에 구축되어 모든 테스트 라이브러리와 함께 사용할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describe, it, expect } from 'vitest'

const app = new Hono()
	.get('/', (c) => c.text('Hello World'))

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.request('/')

		expect(res.status).toBe(200)
		expect(await res.text()).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Hono는 요청을 실행하기 위한 내장 `request` 메서드를 가지고 있습니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.get('/', 'Hello World')

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.handle(
			new Request('http://localhost')
		)

		expect(res.status).toBe(200)
		expect(await res.text()).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청 및 응답을 처리하기 위해 Web Standard API를 사용합니다

</template>

</Compare>

또한 Elysia는 End-to-end 타입 안전성을 위한 [Eden](/eden/overview)이라는 헬퍼 라이브러리를 제공하여 자동 완성 및 완전한 타입 안전성으로 테스트할 수 있습니다.

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

## End-to-end 타입 안전성
둘 다 end-to-end 타입 안전성을 제공하지만, Hono는 상태 코드에 기반한 타입 안전 오류 처리를 제공하지 않는 것 같습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()
	.post(
		'/mirror',
		zValidator(
			'json',
			z.object({
				message: z.string()
			})
		),
		(c) => c.json(c.req.valid('json'))
	)

const client = hc<typeof app>('/')

const response = await client.mirror.$post({
	json: {
		message: 'Hello, world!'
	}
})

const data = await response.json()
//     ^?




console.log(data)
```

:::
</template>

<template v-slot:left-content>

> Hono는 요청을 실행하기 위해 `hc`를 사용하고, end-to-end 타입 안전성을 제공합니다

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

> Elysia는 요청을 실행하기 위해 `treaty`를 사용하고, end-to-end 타입 안전성을 제공합니다

</template>

</Compare>

둘 다 end-to-end 타입 안전성을 제공하지만, Elysia는 상태 코드에 기반한 더 타입 안전한 오류 처리를 제공하는 반면 Hono는 그렇지 않습니다.

각 프레임워크에 대해 동일한 목적 코드를 사용하여 타입 추론 속도를 측정하면, Elysia는 타입 검사에서 Hono보다 2.3배 빠릅니다.

![Elysia eden type inference performance](/migrate/elysia-type-infer.webp)
> Elysia는 Elysia와 Eden 모두를 추론하는 데 536ms가 걸립니다 (확대하려면 클릭)

![Hono HC type inference performance](/migrate/hono-type-infer.webp)
> Hono는 Hono와 HC 모두를 추론하는 데 오류와 함께 1.27초가 걸립니다 (중단됨) (확대하려면 클릭)

1.27초는 추론의 전체 기간을 반영하지 않고, 시작부터 오류 **"Type instantiation is excessively deep and possibly infinite."**로 중단될 때까지의 기간입니다. 이는 스키마가 너무 클 때 발생합니다.

![Hono HC code showing excessively deep error](/migrate/hono-hc-infer.webp)
> Hono HC가 과도하게 깊은 오류를 표시합니다

이는 큰 스키마로 인해 발생하며, Hono는 복잡한 본문 및 응답 유효성 검사와 함께 100개 이상의 라우트를 지원하지 않는 반면, Elysia는 이 문제가 없습니다.

![Elysia Eden code showing type inference without error](/migrate/elysia-eden-infer.webp)
> Elysia Eden 코드가 오류 없이 타입 추론을 표시합니다

Elysia는 더 빠른 타입 추론 성능을 가지고 있으며, 복잡한 본문 및 응답 유효성 검사와 함께 *최소* 2,000개의 라우트까지 **"Type instantiation is excessively deep and possibly infinite."** 문제가 없습니다.

end-to-end 타입 안전성이 중요하다면 Elysia가 올바른 선택입니다.

---

둘 다 Web Standard API 위에 구축된 차세대 웹 프레임워크이지만 약간의 차이가 있습니다.

Elysia는 **건전한 타입 안전성**에 중점을 두고 인체공학적이며 개발자 친화적으로 설계되었으며, Hono보다 더 나은 성능을 가지고 있습니다.

Hono는 특히 Cloudflare Workers와 같은 여러 런타임과의 광범위한 호환성 및 더 큰 사용자 기반을 제공합니다.

또는 다른 프레임워크에서 온 경우 다음을 확인할 수 있습니다:

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		tRPC와 Elysia 비교
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Fastify와 Elysia 비교
    </Card>
    <Card title="From tRPC" href="/migrate/from-trpc">
  		tRPC와 Elysia 비교
    </Card>
</Deck>
